# Google Maps Integration Guide

Complete guide for using Google Maps API integration in the Campaign Platform.

## 📋 Table of Contents

1. [Setup](#setup)
2. [Available Features](#available-features)
3. [API Endpoints](#api-endpoints)
4. [Usage Examples](#usage-examples)
5. [Common Use Cases](#common-use-cases)
6. [Troubleshooting](#troubleshooting)

---

## Setup

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - **Geocoding API**
   - **Places API**
   - **Maps JavaScript API** (for frontend)
4. Create credentials → API Key
5. Restrict your API key (recommended):
   - Application restrictions: HTTP referrers or IP addresses
   - API restrictions: Select specific APIs listed above

### 2. Configure Environment Variable

Add your API key to `apps/api/.env`:

```env
GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 3. Verify Integration

Check if the API is running:

```bash
curl http://localhost:3001/maps/geocode?address=Av+Paulista,+Sao+Paulo
```

If API key is not configured, endpoints will return `null` but won't crash.

---

## Available Features

### ✅ Implemented Features

1. **Geocoding** - Convert address → coordinates
2. **Reverse Geocoding** - Convert coordinates → address
3. **Autocomplete** - Address suggestions as user types
4. **Place Details** - Get full details from Google Place ID
5. **Distance Calculation** - Haversine formula (no API call)
6. **Circular Geofence** - Check if point is within radius
7. **Polygon Geofence** - Check if point is within custom polygon

---

## API Endpoints

### Base URL

```
http://localhost:3001/maps
```

All endpoints are documented in Swagger: `http://localhost:3001/api/docs`

### 1. Geocode Address → Coordinates

**GET** `/maps/geocode`

Convert an address to latitude/longitude coordinates.

**Query Parameters:**
- `address` (string, required): Full or partial address

**Example Request:**
```bash
curl "http://localhost:3001/maps/geocode?address=Av%20Paulista%2C%201000%2C%20São%20Paulo"
```

**Example Response:**
```json
{
  "latitude": -23.5505,
  "longitude": -46.6333,
  "formattedAddress": "Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100, Brazil",
  "placeId": "ChIJN1t_tDeuEmsRUsoyG83frY4",
  "addressComponents": [...]
}
```

---

### 2. Reverse Geocode Coordinates → Address

**GET** `/maps/reverse-geocode`

Convert latitude/longitude to a formatted address.

**Query Parameters:**
- `lat` (number, required): Latitude (-90 to 90)
- `lng` (number, required): Longitude (-180 to 180)

**Example Request:**
```bash
curl "http://localhost:3001/maps/reverse-geocode?lat=-23.5505&lng=-46.6333"
```

**Example Response:**
```json
{
  "formattedAddress": "Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100, Brazil",
  "city": "São Paulo",
  "state": "SP",
  "country": "Brazil",
  "zipCode": "01310-100",
  "neighborhood": "Bela Vista"
}
```

---

### 3. Address Autocomplete

**GET** `/maps/autocomplete`

Get address suggestions as user types (for autocomplete UI).

**Query Parameters:**
- `input` (string, required): Partial address (min 3 chars)
- `country` (string, optional): Country code, default: 'BR'

**Example Request:**
```bash
curl "http://localhost:3001/maps/autocomplete?input=Av%20Paulista&country=BR"
```

**Example Response:**
```json
[
  {
    "description": "Av. Paulista - Consolação, São Paulo - SP, Brazil",
    "place_id": "ChIJN1t_tDeuEmsRUsoyG83frY4",
    "matched_substrings": [...]
  },
  {
    "description": "Av. Paulista, 1000 - Bela Vista, São Paulo - SP, Brazil",
    "place_id": "ChIJeRpOeF65j4ARYn8hs8a2pKg",
    "matched_substrings": [...]
  }
]
```

---

### 4. Get Place Details

**GET** `/maps/place-details`

Get full details for a Google Place ID (from autocomplete).

**Query Parameters:**
- `placeId` (string, required): Google Maps Place ID

**Example Request:**
```bash
curl "http://localhost:3001/maps/place-details?placeId=ChIJN1t_tDeuEmsRUsoyG83frY4"
```

**Example Response:**
```json
{
  "latitude": -23.5505,
  "longitude": -46.6333,
  "formattedAddress": "Av. Paulista, 1000 - Bela Vista, São Paulo - SP, Brazil",
  "placeId": "ChIJN1t_tDeuEmsRUsoyG83frY4",
  "addressComponents": [...]
}
```

---

### 5. Calculate Distance

**POST** `/maps/distance`

Calculate distance between two points using Haversine formula (no API call).

**Request Body:**
```json
{
  "lat1": -23.5505,
  "lng1": -46.6333,
  "lat2": -23.5629,
  "lng2": -46.6544
}
```

**Example Response:**
```json
{
  "distance": 1.85,
  "unit": "km"
}
```

---

### 6. Check Circular Geofence

**POST** `/maps/check-geofence`

Check if a point is within a circular geofence.

**Request Body:**
```json
{
  "pointLat": -23.5505,
  "pointLng": -46.6333,
  "centerLat": -23.5500,
  "centerLng": -46.6300,
  "radiusKm": 1.5
}
```

**Example Response:**
```json
{
  "isInside": true
}
```

---

### 7. Check Polygon Geofence

**POST** `/maps/check-polygon`

Check if a point is within a custom polygon geofence.

**Request Body:**
```json
{
  "pointLat": -23.5505,
  "pointLng": -46.6333,
  "polygon": [
    { "lat": -23.5500, "lng": -46.6300 },
    { "lat": -23.5600, "lng": -46.6300 },
    { "lat": -23.5600, "lng": -46.6400 },
    { "lat": -23.5500, "lng": -46.6400 }
  ]
}
```

**Example Response:**
```json
{
  "isInside": true
}
```

---

## Usage Examples

### Example 1: Geocode Voter Address

When adding a voter, geocode their address to get coordinates:

```typescript
// In voters.service.ts
import { MapsService } from '@/maps/maps.service';

@Injectable()
export class VotersService {
  constructor(
    private db: DatabaseService,
    private mapsService: MapsService,
  ) {}

  async create(dto: CreateVoterDto) {
    let latitude: number | null = null;
    let longitude: number | null = null;

    // Geocode address if provided
    if (dto.address) {
      const geocoded = await this.mapsService.geocodeAddress(dto.address);
      if (geocoded) {
        latitude = geocoded.latitude;
        longitude = geocoded.longitude;
      }
    }

    const [voter] = await this.db.insert(voters)
      .values({
        ...dto,
        latitude,
        longitude,
      })
      .returning();

    return voter;
  }
}
```

### Example 2: Address Autocomplete in Frontend

```typescript
// React component
import { useState, useEffect } from 'react';

function AddressAutocomplete() {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (input.length < 3) return;

    const fetchSuggestions = async () => {
      const response = await fetch(
        `http://localhost:3001/maps/autocomplete?input=${encodeURIComponent(input)}`
      );
      const data = await response.json();
      setSuggestions(data);
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [input]);

  const handleSelect = async (placeId: string) => {
    const response = await fetch(
      `http://localhost:3001/maps/place-details?placeId=${placeId}`
    );
    const place = await response.json();

    // Use place.latitude, place.longitude, place.formattedAddress
    console.log(place);
  };

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Digite o endereço..."
      />
      {suggestions.map((s) => (
        <div key={s.place_id} onClick={() => handleSelect(s.place_id)}>
          {s.description}
        </div>
      ))}
    </div>
  );
}
```

### Example 3: Find Voters Near Location

```typescript
async findVotersNearby(centerLat: number, centerLng: number, radiusKm: number) {
  const voters = await this.db.select()
    .from(votersTable)
    .where(isNull(votersTable.deletedAt));

  // Filter voters within radius
  const nearby = voters.filter((voter) => {
    if (!voter.latitude || !voter.longitude) return false;

    return this.mapsService.isPointInCircle(
      voter.latitude,
      voter.longitude,
      centerLat,
      centerLng,
      radiusKm,
    );
  });

  return nearby;
}
```

### Example 4: Check if Voter is in Campaign Area

```typescript
async isVoterInCampaignArea(voterId: number, geofenceId: number): Promise<boolean> {
  const voter = await this.findOne(voterId);
  const geofence = await this.geofencesService.findOne(geofenceId);

  if (!voter.latitude || !voter.longitude) {
    return false;
  }

  if (geofence.type === 'CIRCLE') {
    return this.mapsService.isPointInCircle(
      voter.latitude,
      voter.longitude,
      geofence.centerLatitude,
      geofence.centerLongitude,
      geofence.radiusKm,
    );
  } else if (geofence.type === 'POLYGON') {
    return this.mapsService.isPointInPolygon(
      voter.latitude,
      voter.longitude,
      geofence.polygon, // Array of {lat, lng}
    );
  }

  return false;
}
```

---

## Common Use Cases

### 1. Voter Management

- **Geocode addresses** when adding/importing voters
- **Display voters on map** using lat/lng
- **Search voters nearby** a specific location
- **Filter voters by geofence** (neighborhood, zone)

### 2. Campaign Events

- **Geocode event locations**
- **Show events on map**
- **Calculate distance** from candidate location to event
- **Find voters near event** for targeted outreach

### 3. Canvassing (Door-to-Door)

- **Create walk routes** based on voter locations
- **Track volunteer location** during canvassing
- **Record visited addresses** with GPS coordinates
- **Calculate route distance** for volunteer tracking

### 4. Geofencing

- **Define campaign zones** (circles or custom polygons)
- **Target voters by area** for specific messages
- **Track campaign coverage** by zone
- **Analyze voter distribution** by geographic area

---

## Troubleshooting

### Issue: Geocoding returns `null`

**Possible causes:**
1. API key not configured
2. API key doesn't have Geocoding API enabled
3. Invalid address format
4. API quota exceeded

**Solution:**
```bash
# Check if API key is set
cat apps/api/.env | grep GOOGLE_MAPS_API_KEY

# Verify the key works
curl "https://maps.googleapis.com/maps/api/geocode/json?address=São+Paulo&key=YOUR_KEY"
```

### Issue: "Invalid API key" error

**Solution:**
1. Check API restrictions in Google Cloud Console
2. Ensure API key has proper APIs enabled
3. Check if IP/domain restrictions are blocking requests

### Issue: Autocomplete is slow

**Solution:**
Implement debouncing on the frontend (wait 300-500ms after user stops typing):

```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    fetchSuggestions();
  }, 300);

  return () => clearTimeout(timer);
}, [input]);
```

### Issue: Quota exceeded

Google Maps APIs have usage limits:
- **Free tier**: $200/month credit (~28,500 geocode requests)
- **Paid tier**: Pay per request

**Solutions:**
1. Cache geocoded results in database
2. Only geocode when address changes
3. Use client-side geocoding for public-facing features
4. Monitor usage in Google Cloud Console

---

## Best Practices

### 1. Cache Results

Always store geocoded coordinates in the database:

```typescript
// ❌ Bad: Geocode every time
async getVoterLocation(voterId: number) {
  const voter = await this.findOne(voterId);
  return await this.mapsService.geocodeAddress(voter.address);
}

// ✅ Good: Use cached coordinates
async getVoterLocation(voterId: number) {
  const voter = await this.findOne(voterId);
  if (voter.latitude && voter.longitude) {
    return { latitude: voter.latitude, longitude: voter.longitude };
  }
  // Only geocode if not cached
  const geocoded = await this.mapsService.geocodeAddress(voter.address);
  if (geocoded) {
    await this.update(voterId, {
      latitude: geocoded.latitude,
      longitude: geocoded.longitude,
    });
  }
  return geocoded;
}
```

### 2. Validate Input

Use the DTOs for automatic validation:

```typescript
// The ValidationPipe will automatically validate:
// - lat/lng are numbers within valid ranges
// - address is not empty
// - polygon has at least 3 points
```

### 3. Handle Errors Gracefully

The service returns `null` on errors instead of throwing:

```typescript
const geocoded = await this.mapsService.geocodeAddress(address);
if (!geocoded) {
  // Handle failure gracefully
  this.logger.warn(`Failed to geocode address: ${address}`);
  return; // or use default coordinates
}
```

### 4. Batch Operations

For bulk imports, geocode in batches to respect API limits:

```typescript
async importVoters(voters: CreateVoterDto[]) {
  const batchSize = 50;

  for (let i = 0; i < voters.length; i += batchSize) {
    const batch = voters.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (voter) => {
        const geocoded = await this.mapsService.geocodeAddress(voter.address);
        // ... save with coordinates
      })
    );

    // Wait 1 second between batches to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
```

---

## API Costs (Reference)

**Google Maps Pricing** (as of 2026):

| Feature | Cost per Request | Free Tier |
|---------|------------------|-----------|
| Geocoding | $5 per 1,000 | $200 credit/month |
| Autocomplete | $2.83 per 1,000 (session) | Included |
| Place Details | $17 per 1,000 | Included |
| Maps JavaScript API | $7 per 1,000 loads | Included |

**Monthly Free Allowance** (~$200 credit):
- ~40,000 geocoding requests
- ~70,000 autocomplete requests
- ~11,700 place details requests

**Recommendation**: For production, enable billing alerts at 50%, 75%, and 90% of budget.

---

## Next Steps

1. ✅ API key configured
2. ✅ Test endpoints working
3. ✅ DTOs added for validation
4. 🔲 Add to voters module
5. 🔲 Add to events module
6. 🔲 Build frontend map component
7. 🔲 Implement geofencing features

---

**Questions?** Check the [Maps service source](apps/api/src/maps/maps.service.ts) for implementation details.
