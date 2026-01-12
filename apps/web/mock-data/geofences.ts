// Mock geofence data for Macapá neighborhoods

import { Geofence } from "@/types/geofence";

export const geofences: Geofence[] = [
  {
    id: "1",
    name: "Centro",
    description: "Região central de Macapá",
    type: "polygon",
    coordinates: [
      [
        [-51.07, 0.038],
        [-51.062, 0.038],
        [-51.062, 0.031],
        [-51.07, 0.031],
        [-51.07, 0.038],
      ],
    ],
    color: "#ef4444",
    fillOpacity: 0.2,
    strokeOpacity: 0.8,
    active: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "2",
    name: "Jesus de Nazaré",
    description: "Bairro residencial próximo ao centro",
    type: "polygon",
    coordinates: [
      [
        [-51.062, 0.033],
        [-51.054, 0.033],
        [-51.054, 0.025],
        [-51.062, 0.025],
        [-51.062, 0.033],
      ],
    ],
    color: "#f97316",
    fillOpacity: 0.2,
    strokeOpacity: 0.8,
    active: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "3",
    name: "Buritizal",
    description: "Área residencial e comercial",
    type: "polygon",
    coordinates: [
      [
        [-51.05, 0.045],
        [-51.04, 0.045],
        [-51.04, 0.037],
        [-51.05, 0.037],
        [-51.05, 0.045],
      ],
    ],
    color: "#f59e0b",
    fillOpacity: 0.2,
    strokeOpacity: 0.8,
    active: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "4",
    name: "Santa Rita",
    description: "Zona residencial sul",
    type: "polygon",
    coordinates: [
      [
        [-51.076, 0.029],
        [-51.068, 0.029],
        [-51.068, 0.021],
        [-51.076, 0.021],
        [-51.076, 0.029],
      ],
    ],
    color: "#84cc16",
    fillOpacity: 0.2,
    strokeOpacity: 0.8,
    active: true,
    createdAt: new Date("2026-01-02"),
    updatedAt: new Date("2026-01-02"),
  },
  {
    id: "5",
    name: "Laguinho",
    description: "Bairro com lagoas naturais",
    type: "polygon",
    coordinates: [
      [
        [-51.065, 0.052],
        [-51.057, 0.052],
        [-51.057, 0.044],
        [-51.065, 0.044],
        [-51.065, 0.052],
      ],
    ],
    color: "#22c55e",
    fillOpacity: 0.2,
    strokeOpacity: 0.8,
    active: true,
    createdAt: new Date("2026-01-03"),
    updatedAt: new Date("2026-01-03"),
  },
  {
    id: "6",
    name: "Araxá",
    description: "Zona leste da cidade",
    type: "polygon",
    coordinates: [
      [
        [-51.058, 0.022],
        [-51.05, 0.022],
        [-51.05, 0.014],
        [-51.058, 0.014],
        [-51.058, 0.022],
      ],
    ],
    color: "#3b82f6",
    fillOpacity: 0.2,
    strokeOpacity: 0.8,
    active: false,
    createdAt: new Date("2026-01-04"),
    updatedAt: new Date("2026-01-04"),
  },
  {
    id: "7",
    name: "Perpétuo Socorro",
    description: "Bairro norte da cidade",
    type: "polygon",
    coordinates: [
      [
        [-51.074, 0.056],
        [-51.066, 0.056],
        [-51.066, 0.048],
        [-51.074, 0.048],
        [-51.074, 0.056],
      ],
    ],
    color: "#8b5cf6",
    fillOpacity: 0.2,
    strokeOpacity: 0.8,
    active: true,
    createdAt: new Date("2026-01-05"),
    updatedAt: new Date("2026-01-05"),
  },
];

// Helper function to check if a point is inside a polygon
export function isPointInPolygon(
  point: [number, number],
  polygon: number[][][]
): boolean {
  const [lng, lat] = point;
  const ring = polygon[0]; // Use first ring (exterior)

  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];

    const intersect =
      yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

// Helper function to check if a point is inside a circle
export function isPointInCircle(
  point: [number, number],
  center: [number, number],
  radiusMeters: number
): boolean {
  const [lng1, lat1] = point;
  const [lng2, lat2] = center;

  // Haversine formula for distance
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance <= radiusMeters;
}
