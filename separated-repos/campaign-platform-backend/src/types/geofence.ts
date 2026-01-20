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
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface CreateGeofenceRequest {
    name: string;
    description?: string;
    type: 'polygon' | 'circle';
    coordinates: number[][][] | [number, number];
    radius?: number;
    color?: string;
    fillOpacity?: number;
    strokeOpacity?: number;
    active?: boolean;
}

export interface UpdateGeofenceRequest extends Partial<CreateGeofenceRequest> { }

export interface GeofenceFilters {
    active?: boolean;
    search?: string;
}

export interface GeofenceStats {
    totalGeofences: number;
    activeGeofences: number;
    votersInGeofences: number;
}
