// Geofence types for the campaign platform

import { Geofence as SharedGeofence, GeofenceFilters as SharedFilter, GeofenceStats as SharedStats } from "@repo/types";

export interface Geofence extends SharedGeofence { }
export interface GeofenceFilters extends SharedFilter { }
export interface GeofenceStats extends SharedStats { }

export interface GeofenceFilters {
  active?: boolean;
  search?: string;
}

export interface GeofenceStats {
  totalGeofences: number;
  activeGeofences: number;
  votersInGeofences: number;
}
