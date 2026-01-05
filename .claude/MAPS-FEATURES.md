# Maps & Location Integration - Quick Reference

## What You Can Build

With the Maps & Location patterns, you can add:

### 🗺️ Address Features
- **Address Autocomplete** - Google Places autocomplete as user types
- **Auto-Geocoding** - Automatically convert address → lat/lng on save
- **Formatted Addresses** - Store standardized Brazilian addresses
- **Address Components** - Parse street, number, city, state, etc.

### 📍 Location Features
- **Voter Markers** - Show voters on interactive map
- **Heatmaps** - Visualize voter density by area
- **Info Windows** - Click markers to see voter details
- **Nearby Search** - Find voters within X km of a point
- **Route Planning** - Plan canvassing routes

### 📊 Analytics Features
- **Density Analysis** - Where are voters concentrated?
- **Coverage Gaps** - Which areas need more voters?
- **Distance Calculations** - How far is voter from campaign HQ?
- **Zone Visualization** - See electoral zones on map

---

## Pattern Files

- **`.claude/patterns/maps-location.md`** - Complete implementation guide
- **`.claude/examples/adding-maps-to-voters.md`** - Step-by-step example

---

## Quick Start

**Ask Claude:**
```
"Read .claude/patterns/maps-location.md and add Google Maps 
integration to the voters module"
```

**I will add:**
1. Location fields to database (address, lat, lng, placeId)
2. GoogleMapsService for geocoding
3. Auto-geocode on voter create/update
4. Address autocomplete in forms
5. Map view showing all voters
6. Nearby voters API endpoint

---

## Example: Create Voter with Location

**User types in form:**
```
Address: "Av. Paulista, 1578, São Paulo"
```

**What happens:**
1. Google Places suggests full address
2. User selects → Gets lat/lng automatically
3. Backend geocodes and stores:
   - address: "Av. Paulista, 1578 - Bela Vista, São Paulo - SP, 01310-200"
   - latitude: -23.5613
   - longitude: -46.6563
   - placeId: "ChIJ..."
   - addressComponents: { street, city, state, postalCode }

---

## Example: Find Nearby Voters

**API Request:**
```bash
GET /campaigns/123/voters/nearby?lat=-23.5613&lng=-46.6563&radius=2000
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "João Silva",
      "address": "Rua Augusta, 123",
      "latitude": -23.5642,
      "longitude": -46.6544,
      "distance": 450 // meters
    },
    // More voters within 2km...
  ]
}
```

---

## Example: Map Visualization

**Page:** `/voters/map`

Shows:
- 📍 Red markers for each voter with coordinates
- 🔥 Heatmap showing density
- 💬 Click marker → Info window with voter details
- 🎯 Auto-center map based on voter locations

---

## Database Schema Addition

```typescript
export const voters = pgTable('voters', {
  // Existing fields...
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }),
  
  // NEW: Location fields
  address: varchar('address', { length: 500 }),
  latitude: real('latitude'),
  longitude: real('longitude'),
  placeId: varchar('place_id', { length: 255 }),
  addressComponents: jsonb('address_components'),
  
  // Timestamps...
}, (table) => ({
  // NEW: Spatial index for fast location queries
  locationIdx: index().using('gist', 
    sql`point(${table.longitude}, ${table.latitude})`
  ),
}));
```

---

## Backend Service Methods

```typescript
class VotersService {
  // Geocode address automatically
  async create(dto: CreateVoterDto) {
    const geo = await googleMaps.geocode(dto.address);
    return db.insert(voters).values({
      ...dto,
      latitude: geo.lat,
      longitude: geo.lng,
      placeId: geo.placeId,
    });
  }

  // Find voters near a point
  async findNearby(lat: number, lng: number, radiusMeters: number) {
    // Uses Haversine formula
    return db.select().from(voters).where(
      sql`distance(lat, lng, ${lat}, ${lng}) <= ${radiusMeters}`
    );
  }
}
```

---

## Frontend Components

```typescript
// Address autocomplete (Google Places)
<AddressAutocomplete
  value={address}
  onChange={(addr, data) => {
    setAddress(addr);
    setCoordinates({ lat: data.latitude, lng: data.longitude });
  }}
/>

// Interactive map
<VotersMap voters={votersWithLocation} />

// Heatmap
<VotersHeatmap voters={votersWithLocation} />
```

---

## Setup Requirements

### Google Cloud Console
1. Enable APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
2. Create API key
3. Set billing (required)
4. Restrict key by domain/IP

### Environment Variables
```bash
# Backend
GOOGLE_MAPS_API_KEY=AIza...

# Frontend
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
```

### Dependencies
```bash
# Backend
pnpm add @googlemaps/google-maps-services-js

# Frontend
pnpm add @googlemaps/js-api-loader
pnpm add @vis.gl/react-google-maps
```

---

## Use Cases

### Campaign Planning
- **Where to campaign?** → See voter density heatmap
- **Route optimization** → Plan door-to-door visits
- **Coverage analysis** → Find underserved areas

### Voter Outreach
- **Local events** → Find voters near event location
- **Neighborhood targeting** → Group voters by area
- **Distance-based messaging** → "We're in your area today!"

### Analytics
- **Geographic trends** → Which neighborhoods support us?
- **Expansion opportunities** → Where to focus recruitment?
- **Resource allocation** → Where to open campaign offices?

---

## Best Practices

✅ **Cache geocoding results** - Don't re-geocode same address  
✅ **Use Place ID** - More reliable than text address  
✅ **Rate limiting** - Google has quotas, implement caching  
✅ **Privacy** - Don't expose exact locations publicly  
✅ **Offline fallback** - Allow manual lat/lng entry  
✅ **Error handling** - Geocoding can fail, handle gracefully  

---

## Performance Tips

1. **Lazy load maps** - Only load when needed
2. **Cluster markers** - For 1000+ voters, use marker clustering
3. **Pagination** - Don't load all voters at once
4. **Spatial indexes** - GIST index for fast distance queries
5. **Cache geocoded addresses** - Store in database

---

## Common Scenarios

### Scenario 1: User Creates Voter
```
1. User types address → Google autocomplete suggests
2. User selects → Form fills lat/lng automatically
3. Submit → Backend stores geocoded data
4. Voter appears on map immediately
```

### Scenario 2: Find Voters Near Event
```
1. Create event at "Praça da Sé"
2. Event gets geocoded → lat: -23.5505, lng: -46.6333
3. Query: voters within 2km
4. Send notifications to nearby voters
```

### Scenario 3: Plan Canvassing Route
```
1. Select neighborhood on map
2. System finds all voters in area
3. Optimize route using Google Directions
4. Export to mobile app for field workers
```

---

**Ready to add Maps?**

Ask Claude:
```
"Add Google Maps integration to voters following the pattern 
in .claude/patterns/maps-location.md"
```
