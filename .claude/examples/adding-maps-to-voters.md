# Example: Adding Google Maps to Voters Module

This example shows how to add location features to the existing voters module.

---

## Step 1: Update Database Schema

Edit `apps/api/src/db/schema.ts`:

```typescript
import { pgTable, integer, varchar, real, jsonb, index, sql } from 'drizzle-orm/pg-core';

export const voters = pgTable('voters', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  
  // ===== NEW: Location fields =====
  address: varchar('address', { length: 500 }),
  addressComponents: jsonb('address_components').$type<{
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  }>(),
  latitude: real('latitude'),
  longitude: real('longitude'),
  placeId: varchar('place_id', { length: 255 }),
  // ===== END NEW =====
  
  zone: varchar('zone', { length: 100 }),
  tags: text('tags').array().default([]),
  
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('voters_email_idx').on(table.email),
  zoneIdx: index('voters_zone_idx').on(table.zone),
  
  // ===== NEW: Spatial index =====
  locationIdx: index('voters_location_idx').using('gist',
    sql`point(${table.longitude}, ${table.latitude})`
  ),
  placeIdIdx: index('voters_place_id_idx').on(table.placeId),
  // ===== END NEW =====
}));
```

Run migration:
```bash
cd apps/api
pnpm drizzle-kit generate:pg
pnpm drizzle-kit push:pg
```

---

## Step 2: Backend - Google Maps Service

Create `apps/api/src/common/services/google-maps.service.ts`:

```typescript
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

  private parseAddressComponents(components: any[]) {
    const parsed: any = {};

    for (const component of components) {
      const types = component.types;

      if (types.includes('street_number')) parsed.number = component.long_name;
      if (types.includes('route')) parsed.street = component.long_name;
      if (types.includes('sublocality')) parsed.neighborhood = component.long_name;
      if (types.includes('administrative_area_level_2')) parsed.city = component.long_name;
      if (types.includes('administrative_area_level_1')) parsed.state = component.short_name;
      if (types.includes('postal_code')) parsed.postalCode = component.long_name;
    }

    return parsed;
  }
}
```

Register in common module:

```typescript
// apps/api/src/common/common.module.ts
import { Module, Global } from '@nestjs/common';
import { GoogleMapsService } from './services/google-maps.service';

@Global()
@Module({
  providers: [GoogleMapsService],
  exports: [GoogleMapsService],
})
export class CommonModule {}
```

Add to app.module.ts:
```typescript
import { CommonModule } from './common/common.module';

@Module({
  imports: [CommonModule, ...],
})
export class AppModule {}
```

Install dependency:
```bash
cd apps/api
pnpm add @googlemaps/google-maps-services-js
```

Add to .env:
```bash
GOOGLE_MAPS_API_KEY=AIza...your-key
```

---

## Step 3: Update Voters Service

Edit `apps/api/src/modules/voters/voters.service.ts`:

```typescript
import { GoogleMapsService } from '@/common/services/google-maps.service';

@Injectable()
export class VotersService {
  constructor(
    @Inject('DATABASE') private db: Database,
    private googleMapsService: GoogleMapsService, // ← NEW
  ) {}

  async create(dto: CreateVoterDto) {
    // ===== NEW: Geocode address =====
    let locationData = null;
    if (dto.address) {
      locationData = await this.googleMapsService.geocodeAddress(dto.address);
    }
    // ===== END NEW =====

    const [voter] = await this.db.insert(voters).values({
      ...dto,
      // ===== NEW: Add location fields =====
      address: locationData?.formattedAddress || dto.address,
      latitude: locationData?.latitude,
      longitude: locationData?.longitude,
      placeId: locationData?.placeId,
      addressComponents: locationData?.addressComponents,
      // ===== END NEW =====
    }).returning();

    return voter;
  }

  async update(id: number, dto: UpdateVoterDto) {
    await this.findOne(id);

    // ===== NEW: Re-geocode if address changed =====
    let locationData = null;
    if (dto.address) {
      locationData = await this.googleMapsService.geocodeAddress(dto.address);
    }
    // ===== END NEW =====

    const [updated] = await this.db.update(voters)
      .set({
        ...dto,
        // ===== NEW: Update location fields =====
        ...(locationData && {
          address: locationData.formattedAddress,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          placeId: locationData.placeId,
          addressComponents: locationData.addressComponents,
        }),
        // ===== END NEW =====
        updatedAt: new Date(),
      })
      .where(eq(voters.id, id))
      .returning();

    return updated;
  }

  // ===== NEW: Find nearby voters =====
  async findNearby(lat: number, lng: number, radiusMeters: number = 5000) {
    const voters = await this.db
      .select()
      .from(voters)
      .where(
        and(
          isNotNull(voters.latitude),
          isNotNull(voters.longitude),
          isNull(voters.deletedAt),
          // Haversine formula for distance
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
  // ===== END NEW =====
}
```

---

## Step 4: Add Nearby Endpoint

Edit `apps/api/src/modules/voters/voters.controller.ts`:

```typescript
@Controller('campaigns/:campaignId/voters')
export class VotersController {
  
  // ===== NEW: Nearby endpoint =====
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
  // ===== END NEW =====
}
```

---

## Step 5: Frontend - Address Autocomplete

Create `apps/web/components/features/maps/address-autocomplete.tsx`:

```typescript
'use client';

import { useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Loader } from '@googlemaps/js-api-loader';

interface Props {
  value: string;
  onChange: (address: string, placeData?: any) => void;
}

export function AddressAutocomplete({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: 'weekly',
      libraries: ['places'],
    });

    loader.load().then(() => {
      if (!inputRef.current) return;

      const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'br' },
        fields: ['formatted_address', 'geometry', 'place_id'],
        types: ['address'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();

        if (place.geometry) {
          onChange(place.formatted_address || '', {
            latitude: place.geometry.location?.lat(),
            longitude: place.geometry.location?.lng(),
            placeId: place.place_id,
          });
        }
      });
    });
  }, []);

  return (
    <Input
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Digite o endereço..."
    />
  );
}
```

Install dependencies:
```bash
cd apps/web
pnpm add @googlemaps/js-api-loader
pnpm add @vis.gl/react-google-maps
```

Add to .env.local:
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...your-key
```

---

## Step 6: Update Voter Form

Edit `apps/web/components/features/voters/voter-form.tsx`:

```typescript
import { AddressAutocomplete } from '@/components/features/maps/address-autocomplete';

const schema = z.object({
  name: z.string().min(3),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  // ===== NEW: Hidden fields for coordinates =====
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  placeId: z.string().optional(),
  // ===== END NEW =====
});

export function VoterForm({ voter, campaignId }: Props) {
  const { register, handleSubmit, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: voter,
  });

  const address = watch('address');

  // ===== NEW: Handle address selection =====
  const handleAddressChange = (newAddress: string, placeData?: any) => {
    setValue('address', newAddress);
    
    if (placeData) {
      setValue('latitude', placeData.latitude);
      setValue('longitude', placeData.longitude);
      setValue('placeId', placeData.placeId);
    }
  };
  // ===== END NEW =====

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Nome *</label>
        <input {...register('name')} />
      </div>

      <div>
        <label>Email</label>
        <input {...register('email')} type="email" />
      </div>

      {/* ===== NEW: Address autocomplete ===== */}
      <div>
        <label>Endereço</label>
        <AddressAutocomplete
          value={address || ''}
          onChange={handleAddressChange}
        />
      </div>

      {/* Hidden fields */}
      <input type="hidden" {...register('latitude')} />
      <input type="hidden" {...register('longitude')} />
      <input type="hidden" {...register('placeId')} />
      {/* ===== END NEW ===== */}

      <button type="submit">Salvar</button>
    </form>
  );
}
```

---

## Step 7: Create Map View

Create `apps/web/components/features/maps/voters-map.tsx`:

```typescript
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

export function VotersMap({ voters }: { voters: Voter[] }) {
  const [selected, setSelected] = useState<Voter | null>(null);

  const center = voters.length > 0
    ? {
        lat: voters.reduce((sum, v) => sum + v.latitude, 0) / voters.length,
        lng: voters.reduce((sum, v) => sum + v.longitude, 0) / voters.length,
      }
    : { lat: -23.5505, lng: -46.6333 }; // São Paulo

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border">
      <Map defaultCenter={center} defaultZoom={12}>
        {voters.map((voter) => (
          <Marker
            key={voter.id}
            position={{ lat: voter.latitude, lng: voter.longitude }}
            onClick={() => setSelected(voter)}
          />
        ))}

        {selected && (
          <InfoWindow
            position={{ lat: selected.latitude, lng: selected.longitude }}
            onCloseClick={() => setSelected(null)}
          >
            <div className="p-2">
              <h3 className="font-bold">{selected.name}</h3>
              <p className="text-sm">{selected.address}</p>
            </div>
          </InfoWindow>
        )}
      </Map>
    </div>
  );
}
```

Create map page `apps/web/app/(auth)/voters/map/page.tsx`:

```typescript
import { VotersMap } from '@/components/features/maps/voters-map';

async function getVoters() {
  const res = await fetch(`${process.env.API_URL}/campaigns/current/voters`, {
    cache: 'no-store',
  });
  return res.json();
}

export default async function VotersMapPage() {
  const { data: voters } = await getVoters();
  
  const votersWithLocation = voters.filter(v => v.latitude && v.longitude);

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
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

## Step 8: Add Maps Provider

Edit `apps/web/app/layout.tsx`:

```typescript
import { APIProvider } from '@vis.gl/react-google-maps';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
          {children}
        </APIProvider>
      </body>
    </html>
  );
}
```

---

## Done! ✅

You now have:
- ✅ Address autocomplete in voter form
- ✅ Automatic geocoding on save
- ✅ Latitude/longitude stored in database
- ✅ Map view showing all voters
- ✅ Info windows with voter details
- ✅ API endpoint to find nearby voters

**Test it:**
```bash
# Backend
cd apps/api && pnpm dev

# Frontend
cd apps/web && pnpm dev

# Visit:
http://localhost:3000/voters/new (create with address)
http://localhost:3000/voters/map (view on map)
```

**API Examples:**
```bash
# Find voters within 5km of a point
GET /campaigns/current/voters/nearby?lat=-23.5505&lng=-46.6333&radius=5000

# Response: voters with distances calculated
```
