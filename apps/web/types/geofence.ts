// Geofence types for the campaign platform

export interface Geofence {
  id: string;
  name: string;
  description?: string;
  type: "polygon" | "circle";
  coordinates: number[][][] | [number, number]; // Polygon: array of rings | Circle: center point
  radius?: number; // Only for circles (in meters)
  color: string;
  fillOpacity: number;
  strokeOpacity: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GeofenceFilters {
  active?: boolean;
  search?: string;
}

export interface GeofenceStats {
  totalGeofences: number;
  activeGeofences: number;
  votersInGeofences: number;
}
