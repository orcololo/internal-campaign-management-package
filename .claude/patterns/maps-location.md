# Maps & Location Pattern (Google Maps + Places API)

## Overview

Integration with Google Maps API and Places API for:
- Address autocomplete when creating/editing voters
- Geocoding (address → lat/lng coordinates)
- Map visualization with voter markers
- Heatmaps showing voter density
- Route planning for canvassing

---

## 1. Database Schema (Drizzle)

Add location fields to voters table:

```typescript
// apps/api/src/db/schema.ts
import { pgTable, integer, varchar, real, point } from 'drizzle-orm/pg-core';

export const voters = pgTable('voters', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  
  // Location fields
  address: varchar('address', { length: 500 }), // Full formatted address
  addressComponents: jsonb('address_components').$type<{
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  }>(),
  
  latitude: real('latitude'),  // -33.8688 (exemplo São Paulo)
  longitude: real('longitude'), // -151.2093
  
  placeId: varchar('place_id', { length: 255 }), // Google Place ID (unique)
  
  // Standard fields
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Spatial index for location queries
  locationIdx: index('voters_location_idx').using('gist', 
    sql`point(${table.longitude}, ${table.latitude})`
  ),
  placeIdIdx: index('voters_place_id_idx').on(table.placeId),
}));
```

**Enable PostGIS (optional, for advanced spatial queries):**
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

---

## 2. Backend Setup (NestJS)

### Environment Variables

```bash
# .env
GOOGLE_MAPS_API_KEY=AIza...your-key-here
```

### Google Maps Service

```typescript
// apps/api/src/common/services/google-maps.service.ts
import { Injectable } from '@nestjs/common';
import { Client } from '@googlemaps/google-maps-services-js';

@Injectable()
export class GoogleMapsService {
  private client: Client;
  private apiKey: string;

  constructor() {
    this.client = new Client({});
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY;
  }

  /**
   * Geocode address to coordinates
   */
  async geocodeAddress(address: string) {
    try {
      const response = await this.client.geocode({
        params: {
          address,
          key: this.apiKey,
          language: 'pt-BR',
          region: 'br',
        },
      });

      if (response.data.results.length === 0) {
        return null;
      }

      const result = response.data.results[0];
      
      return {
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        formattedAddress: result.formatted_address,
        placeId: result.place_id,
        addressComponents: this.parseAddressComponents(result.address_components),
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  /**
   * Reverse geocode (coordinates → address)
   */
  async reverseGeocode(lat: number, lng: number) {
    try {
      const response = await this.client.reverseGeocode({
        params: {
          latlng: { lat, lng },
          key: this.apiKey,
          language: 'pt-BR',
        },
      });

      if (response.data.results.length === 0) {
        return null;
      }

      const result = response.data.results[0];
      return {
        formattedAddress: result.formatted_address,
        placeId: result.place_id,
        addressComponents: this.parseAddressComponents(result.address_components),
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  }

  /**
   * Calculate distance between two points (in meters)
   */
  async calculateDistance(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
  ) {
    try {
      const response = await this.client.distancematrix({
        params: {
          origins: [`${origin.lat},${origin.lng}`],
          destinations: [`${destination.lat},${destination.lng}`],
          key: this.apiKey,
          language: 'pt-BR',
        },
      });

      const element = response.data.rows[0].elements[0];
      
      if (element.status === 'OK') {
        return {
          distance: element.distance.value, // meters
          duration: element.duration.value, // seconds
          distanceText: element.distance.text,
          durationText: element.duration.text,
        };
      }

      return null;
    } catch (error) {
      console.error('Distance calculation error:', error);
      return null;
    }
  }

  /**
   * Get place details from Place ID
   */
  async getPlaceDetails(placeId: string) {
    try {
      const response = await this.client.placeDetails({
        params: {
          place_id: placeId,
          key: this.apiKey,
          language: 'pt-BR',
        },
      });

      return response.data.result;
    } catch (error) {
      console.error('Place details error:', error);
      return null;
    }
  }

  /**
   * Parse address components into structured format
   */
  private parseAddressComponents(components: any[]) {
    const parsed: any = {};

    for (const component of components) {
      const types = component.types;

      if (types.includes('street_number')) {
        parsed.number = component.long_name;
      }
      if (types.includes('route')) {
        parsed.street = component.long_name;
      }
      if (types.includes('sublocality') || types.includes('neighborhood')) {
        parsed.neighborhood = component.long_name;
      }
      if (types.includes('administrative_area_level_2')) {
        parsed.city = component.long_name;
      }
      if (types.includes('administrative_area_level_1')) {
        parsed.state = component.short_name;
      }
      if (types.includes('postal_code')) {
        parsed.postalCode = component.long_name;
      }
      if (types.includes('country')) {
        parsed.country = component.short_name;
      }
    }

    return parsed;
  }
}
```

**Install dependency:**
```bash
pnpm add @googlemaps/google-maps-services-js
```

### Update Voters Service

```typescript
// apps/api/src/modules/voters/voters.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { GoogleMapsService } from '@/common/services/google-maps.service';

@Injectable()
export class VotersService {
  constructor(
    @Inject('DATABASE') private db: Database,
    private googleMapsService: GoogleMapsService,
  ) {}

  async create(dto: CreateVoterDto) {
    // Geocode address if provided
    let locationData = null;
    if (dto.address) {
      locationData = await this.googleMapsService.geocodeAddress(dto.address);
    }

    const [voter] = await this.db.insert(voters).values({
      ...dto,
      address: locationData?.formattedAddress || dto.address,
      latitude: locationData?.latitude,
      longitude: locationData?.longitude,
      placeId: locationData?.placeId,
      addressComponents: locationData?.addressComponents,
    }).returning();

    return voter;
  }

  async update(id: number, dto: UpdateVoterDto) {
    await this.findOne(id);

    // Re-geocode if address changed
    let locationData = null;
    if (dto.address) {
      locationData = await this.googleMapsService.geocodeAddress(dto.address);
    }

    const [updated] = await this.db.update(voters)
      .set({
        ...dto,
        ...(locationData && {
          address: locationData.formattedAddress,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          placeId: locationData.placeId,
          addressComponents: locationData.addressComponents,
        }),
        updatedAt: new Date(),
      })
      .where(eq(voters.id, id))
      .returning();

    return updated;
  }

  /**
   * Find voters near a location (within radius in meters)
   */
  async findNearby(lat: number, lng: number, radiusMeters: number = 5000) {
    // Using Haversine formula for distance calculation
    const voters = await this.db
      .select()
      .from(voters)
      .where(
        and(
          isNotNull(voters.latitude),
          isNotNull(voters.longitude),
          isNull(voters.deletedAt),
          sql`
            (6371000 * acos(
              cos(radians(${lat})) *
              cos(radians(${voters.latitude})) *
              cos(radians(${voters.longitude}) - radians(${lng})) +
              sin(radians(${lat})) *
              sin(radians(${voters.latitude}))
            )) <= ${radiusMeters}
          `
        )
      );

    return voters;
  }
}
```

### API Endpoints

```typescript
// apps/api/src/modules/voters/voters.controller.ts
@Controller('campaigns/:campaignId/voters')
export class VotersController {
  
  @Get('nearby')
  @Roles('CANDIDATO', 'ESTRATEGISTA', 'LIDERANCA')
  findNearby(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
  ) {
    return this.service.findNearby(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseInt(radius) : 5000,
    );
  }

  @Get('geocode')
  @Roles('CANDIDATO', 'ESTRATEGISTA')
  async geocodeAddress(@Query('address') address: string) {
    return this.googleMapsService.geocodeAddress(address);
  }
}
```

---

## 3. Frontend Setup (Next.js)

### Install Dependencies

```bash
pnpm add @googlemaps/js-api-loader
pnpm add @vis.gl/react-google-maps
```

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...your-key-here
```

### Google Maps Provider

```typescript
// apps/web/components/providers/maps-provider.tsx
'use client';

import { APIProvider } from '@vis.gl/react-google-maps';

export function MapsProvider({ children }: { children: React.ReactNode }) {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      {children}
    </APIProvider>
  );
}
```

Add to layout:

```typescript
// apps/web/app/layout.tsx
import { MapsProvider } from '@/components/providers/maps-provider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MapsProvider>
          {children}
        </MapsProvider>
      </body>
    </html>
  );
}
```

### Address Autocomplete Component

```typescript
// apps/web/components/features/maps/address-autocomplete.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Loader } from '@googlemaps/js-api-loader';

interface Props {
  value: string;
  onChange: (address: string, placeData?: any) => void;
  placeholder?: string;
}

export function AddressAutocomplete({ value, onChange, placeholder }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: 'weekly',
      libraries: ['places'],
    });

    loader.load().then(() => {
      if (!inputRef.current) return;

      const autocompleteInstance = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          componentRestrictions: { country: 'br' }, // Brazil only
          fields: ['address_components', 'formatted_address', 'geometry', 'place_id'],
          types: ['address'],
        }
      );

      autocompleteInstance.addListener('place_changed', () => {
        const place = autocompleteInstance.getPlace();

        if (!place.geometry) {
          return;
        }

        onChange(place.formatted_address || '', {
          latitude: place.geometry.location?.lat(),
          longitude: place.geometry.location?.lng(),
          placeId: place.place_id,
          addressComponents: place.address_components,
        });
      });

      setAutocomplete(autocompleteInstance);
    });

    return () => {
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, []);

  return (
    <Input
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || 'Digite o endereço...'}
    />
  );
}
```

### Map Component with Markers

```typescript
// apps/web/components/features/maps/voters-map.tsx
'use client';

import { Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import { useState } from 'react';

interface Voter {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface Props {
  voters: Voter[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

export function VotersMap({ voters, center, zoom = 12 }: Props) {
  const [selectedVoter, setSelectedVoter] = useState<Voter | null>(null);

  // Calculate center from voters if not provided
  const mapCenter = center || calculateCenter(voters);

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border">
      <Map
        defaultCenter={mapCenter}
        defaultZoom={zoom}
        mapId="voters-map"
      >
        {voters.map((voter) => (
          <Marker
            key={voter.id}
            position={{ lat: voter.latitude, lng: voter.longitude }}
            onClick={() => setSelectedVoter(voter)}
          />
        ))}

        {selectedVoter && (
          <InfoWindow
            position={{
              lat: selectedVoter.latitude,
              lng: selectedVoter.longitude,
            }}
            onCloseClick={() => setSelectedVoter(null)}
          >
            <div className="p-2">
              <h3 className="font-bold">{selectedVoter.name}</h3>
              <p className="text-sm text-gray-600">{selectedVoter.address}</p>
            </div>
          </InfoWindow>
        )}
      </Map>
    </div>
  );
}

function calculateCenter(voters: Voter[]) {
  if (voters.length === 0) {
    return { lat: -23.5505, lng: -46.6333 }; // São Paulo default
  }

  const sum = voters.reduce(
    (acc, voter) => ({
      lat: acc.lat + voter.latitude,
      lng: acc.lng + voter.longitude,
    }),
    { lat: 0, lng: 0 }
  );

  return {
    lat: sum.lat / voters.length,
    lng: sum.lng / voters.length,
  };
}
```

### Heatmap Component

```typescript
// apps/web/components/features/maps/voters-heatmap.tsx
'use client';

import { Map } from '@vis.gl/react-google-maps';
import { useEffect, useRef } from 'react';

interface Props {
  voters: { latitude: number; longitude: number }[];
}

export function VotersHeatmap({ voters }: Props) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const points = voters.map(
      (v) => new google.maps.LatLng(v.latitude, v.longitude)
    );

    if (heatmapRef.current) {
      heatmapRef.current.setMap(null);
    }

    heatmapRef.current = new google.maps.visualization.HeatmapLayer({
      data: points,
      radius: 20,
      opacity: 0.6,
    });

    heatmapRef.current.setMap(mapRef.current);
  }, [voters]);

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border">
      <Map
        defaultCenter={{ lat: -23.5505, lng: -46.6333 }}
        defaultZoom={12}
        onLoad={(map) => (mapRef.current = map)}
      />
    </div>
  );
}
```

### Updated Voter Form

```typescript
// apps/web/components/features/voters/voter-form.tsx
'use client';

import { AddressAutocomplete } from '@/components/features/maps/address-autocomplete';

export function VoterForm({ voter, campaignId }: Props) {
  const { register, handleSubmit, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: voter,
  });

  const address = watch('address');

  const handleAddressChange = (newAddress: string, placeData?: any) => {
    setValue('address', newAddress);
    
    if (placeData) {
      // Hidden fields for lat/lng (sent to backend)
      setValue('latitude', placeData.latitude);
      setValue('longitude', placeData.longitude);
      setValue('placeId', placeData.placeId);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* ... other fields ... */}

      <div>
        <Label>Endereço</Label>
        <AddressAutocomplete
          value={address || ''}
          onChange={handleAddressChange}
          placeholder="Digite o endereço completo..."
        />
      </div>

      {/* Hidden fields */}
      <input type="hidden" {...register('latitude')} />
      <input type="hidden" {...register('longitude')} />
      <input type="hidden" {...register('placeId')} />

      {/* ... submit button ... */}
    </form>
  );
}
```

### Map View Page

```typescript
// apps/web/app/(auth)/voters/map/page.tsx
import { VotersMap } from '@/components/features/maps/voters-map';

async function getVoters() {
  const res = await fetch(`${process.env.API_URL}/campaigns/current/voters`, {
    cache: 'no-store',
  });
  return res.json();
}

export default async function VotersMapPage() {
  const { data: voters } = await getVoters();
  
  // Filter only voters with coordinates
  const votersWithLocation = voters.filter(
    (v) => v.latitude && v.longitude
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mapa de Eleitores</h1>
        <p className="text-gray-600">
          {votersWithLocation.length} de {voters.length} com localização
        </p>
      </div>

      <VotersMap voters={votersWithLocation} />
    </div>
  );
}
```

---

## 4. Usage Examples

### Geocode on Save

```typescript
// Automatically geocode when creating voter
const voter = await votersService.create({
  name: 'João Silva',
  address: 'Av. Paulista, 1578, São Paulo, SP',
  // Backend automatically fills: latitude, longitude, placeId
});
```

### Find Nearby Voters

```typescript
// Find all voters within 5km of a location
const nearby = await votersService.findNearby(
  -23.5505, // latitude
  -46.6333, // longitude
  5000 // radius in meters
);
```

### Address Autocomplete

```typescript
// User types, Google suggests addresses
<AddressAutocomplete
  value={address}
  onChange={(addr, data) => {
    setAddress(addr);
    setCoordinates({ lat: data.latitude, lng: data.longitude });
  }}
/>
```

---

## 5. Checklist

- [ ] Enable Google Maps API in Google Cloud Console
- [ ] Enable Places API
- [ ] Enable Geocoding API
- [ ] Set up billing (required for Google Maps)
- [ ] Add API key to environment variables
- [ ] Restrict API key (HTTP referrers for frontend, IP for backend)
- [ ] Database: Add location fields to voters table
- [ ] Backend: Install `@googlemaps/google-maps-services-js`
- [ ] Backend: Create GoogleMapsService
- [ ] Frontend: Install `@vis.gl/react-google-maps`
- [ ] Frontend: Add MapsProvider to layout
- [ ] Frontend: Create AddressAutocomplete component
- [ ] Frontend: Create map visualization pages

---

## 6. Google Cloud Console Setup

1. Go to https://console.cloud.google.com
2. Create new project or select existing
3. Enable APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Distance Matrix API (optional)
4. Create API key
5. Restrict API key:
   - **Frontend key**: HTTP referrers (your domain)
   - **Backend key**: IP addresses (your server IPs)

---

## Best Practices

- ✅ **Cache geocoding results** - Don't re-geocode same address
- ✅ **Use Place ID** - More reliable than address string
- ✅ **Rate limiting** - Google has quotas, implement caching
- ✅ **Error handling** - Geocoding can fail, handle gracefully
- ✅ **Privacy** - Don't expose exact voter locations to unauthorized users
- ✅ **Spatial indexes** - Use GIST index for fast location queries
