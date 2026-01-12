# Geographic Heatmap - Map-Based Visualization

## Overview

Upgraded the geographic heatmap from a simple list view to a full interactive map with heat overlay using MapLibre GL JS.

## What Was Implemented

### 1. **Geographic Data Structure** (`mock-data/geographic.ts`)

- 7 Macapá neighborhoods with realistic coordinates
- 200 voter points distributed across neighborhoods
- GeoJSON format for MapLibre compatibility
- Weight system (1-10) for heat intensity
- Color-coded neighborhoods by density

### 2. **Map-Based Heatmap Component** (`components/features/analytics/geographic-heatmap.tsx`)

- **OpenStreetMap** base tiles for geographic visualization
- **Heatmap layer** with gradient colors (blue → cyan → yellow → red)
- **Circle markers** that appear at high zoom levels
- **Colored pins** for neighborhood centers with popups
- **Zoom controls** (zoom in/out, reset view)
- **Interactive buttons** to focus on specific neighborhoods
- **Loading state** with placeholder while map initializes

### 3. **Features**

#### Heatmap Visualization

- Density-based color gradient
- Dynamic radius that scales with zoom level
- Smooth transition from heatmap to point markers at high zoom
- Weight-based intensity (higher concentration = hotter colors)

#### Interactivity

- Click neighborhood buttons to fly to that location
- Click markers to see popup with voter count
- Pan and zoom with mouse/touch
- Navigation controls in top-right corner

#### UI Elements

- Summary stats (7 bairros, 200 eleitores, 28.6 média)
- Grid of clickable neighborhood buttons
- Visual legend showing color meanings
- Responsive design with proper spacing

## How to View

### Pages with Heatmap

1. **Main Dashboard** - http://localhost:3000/

   - Click "Geografia" tab to see the map

2. **Analytics Page** - http://localhost:3000/analytics
   - Scroll down to see the full-width heatmap

### Map Controls

- **Zoom In/Out**: Click + / - buttons
- **Reset View**: Click maximize button to return to Macapá center
- **Focus Neighborhood**: Click any neighborhood button to fly to that location
- **Explore**: Pan around the map, zoom to see individual voter points

## Technical Details

### Libraries Used

- **maplibre-gl**: Open-source map rendering library
- **OpenStreetMap**: Free geographic tiles
- **MapLibre Heatmap Layer**: Built-in heatmap visualization

### Data Format

```typescript
// 200 voter points distributed across 7 neighborhoods
voterPointsGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { weight: 8, neighborhood: "Centro" },
      geometry: { type: "Point", coordinates: [-51.0665, 0.0345] },
    },
    // ... 199 more points
  ],
};
```

### Heatmap Configuration

- **Color Gradient**: Blue (low) → Cyan → Yellow → Orange → Red (high)
- **Radius**: 2px at zoom 0, 20px at zoom 15
- **Intensity**: 1x at zoom 0, 3x at zoom 15
- **Transition**: Fades out heatmap at zoom 15, shows circles instead

### Neighborhood Colors

- Centro: Red (#ef4444) - Highest density (45 voters)
- Jesus de Nazaré: Orange (#f97316) - 38 voters
- Buritizal: Amber (#f59e0b) - 32 voters
- Santa Rita: Lime (#84cc16) - 28 voters
- Laguinho: Green (#22c55e) - 24 voters
- Araxá: Blue (#3b82f6) - 18 voters
- Perpétuo Socorro: Purple (#8b5cf6) - 15 voters

## Benefits Over List View

| Feature               | Old List View          | New Map View                     |
| --------------------- | ---------------------- | -------------------------------- |
| Geographic Context    | ❌ None                | ✅ Actual map with neighborhoods |
| Density Visualization | 🟨 Color badges        | ✅ Heat overlay with gradients   |
| Spatial Relationships | ❌ Can't see distances | ✅ See proximity between areas   |
| Exploration           | ❌ Static list         | ✅ Pan, zoom, click to explore   |
| Data Understanding    | 🟨 Numbers only        | ✅ Visual patterns emerge        |

## Next Steps (Optional Enhancements)

1. **Real voter data integration**: Connect to actual voter database
2. **Filter by date range**: Show how distribution changes over time
3. **Custom clustering**: Group nearby voters at low zoom levels
4. **Export map**: Download map as image for reports
5. **Overlay layers**: Add streets, buildings, or electoral zones
6. **Route planning**: Draw routes between high-density areas

---

**Status**: ✅ Complete and functional
**Build**: ✅ Passes TypeScript compilation
**Accessible at**: `/` (Geografia tab) and `/analytics`
