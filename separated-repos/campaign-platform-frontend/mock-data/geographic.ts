// Geographic data for Macapá neighborhoods with voter distribution
// Each neighborhood has multiple points to create a proper heatmap visualization

export interface VoterPoint {
  id: string;
  lat: number;
  lng: number;
  weight: number; // Intensity: 1-10
  neighborhood: string;
}

export interface Neighborhood {
  id: string;
  name: string;
  center: {
    lat: number;
    lng: number;
  };
  voterCount: number;
  color: string;
}

// Macapá neighborhoods with realistic coordinates
export const neighborhoods: Neighborhood[] = [
  {
    id: "1",
    name: "Centro",
    center: { lat: 0.0345, lng: -51.0665 },
    voterCount: 45,
    color: "#ef4444", // High density
  },
  {
    id: "2",
    name: "Jesus de Nazaré",
    center: { lat: 0.029, lng: -51.058 },
    voterCount: 38,
    color: "#f97316",
  },
  {
    id: "3",
    name: "Buritizal",
    center: { lat: 0.041, lng: -51.045 },
    voterCount: 32,
    color: "#f59e0b",
  },
  {
    id: "4",
    name: "Santa Rita",
    center: { lat: 0.025, lng: -51.072 },
    voterCount: 28,
    color: "#84cc16",
  },
  {
    id: "5",
    name: "Laguinho",
    center: { lat: 0.048, lng: -51.061 },
    voterCount: 24,
    color: "#22c55e",
  },
  {
    id: "6",
    name: "Araxá",
    center: { lat: 0.018, lng: -51.054 },
    voterCount: 18,
    color: "#3b82f6",
  },
  {
    id: "7",
    name: "Perpétuo Socorro",
    center: { lat: 0.052, lng: -51.07 },
    voterCount: 15,
    color: "#8b5cf6", // Low density
  },
];

// Generate multiple voter points per neighborhood for heatmap effect
export const voterPoints: VoterPoint[] = neighborhoods.flatMap(
  (neighborhood) => {
    const points: VoterPoint[] = [];

    // Create points distributed around neighborhood center
    for (let i = 0; i < neighborhood.voterCount; i++) {
      // Random offset within ~500m radius (roughly 0.005 degrees)
      const latOffset = (Math.random() - 0.5) * 0.01;
      const lngOffset = (Math.random() - 0.5) * 0.01;

      // Weight varies based on distance from center (cluster effect)
      const distance = Math.sqrt(latOffset ** 2 + lngOffset ** 2);
      const weight = Math.max(1, Math.round(10 * (1 - distance * 100)));

      points.push({
        id: `${neighborhood.id}-${i}`,
        lat: neighborhood.center.lat + latOffset,
        lng: neighborhood.center.lng + lngOffset,
        weight,
        neighborhood: neighborhood.name,
      });
    }

    return points;
  }
);

// Convert to GeoJSON format for MapLibre
export const voterPointsGeoJSON = {
  type: "FeatureCollection" as const,
  features: voterPoints.map((point) => ({
    type: "Feature" as const,
    properties: {
      weight: point.weight,
      neighborhood: point.neighborhood,
    },
    geometry: {
      type: "Point" as const,
      coordinates: [point.lng, point.lat],
    },
  })),
};

// Macapá city center for map initialization
export const MACAPA_CENTER = {
  lat: 0.0345,
  lng: -51.0665,
  zoom: 12,
};

// Calculate bounding box for all points
export const getBounds = () => {
  const lats = voterPoints.map((p) => p.lat);
  const lngs = voterPoints.map((p) => p.lng);

  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    west: Math.min(...lngs),
  };
};
