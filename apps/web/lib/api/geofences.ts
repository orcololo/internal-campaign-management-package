import { apiClient } from "./client";
import { Geofence } from "../../types/geofence";

interface CreateGeofenceDto {
  name: string;
  description?: string;
  type: "circle" | "polygon";
  coordinates: number[][][] | [number, number]; // Polygon rings or circle center
  radius?: number; // For circles only
  color?: string;
  city?: string;
  state?: string;
  neighborhood?: string;
}

interface UpdateGeofenceDto extends Partial<CreateGeofenceDto> {
  active?: boolean;
}

export const geofencesApi = {
  /**
   * Get all geofences from the database
   */
  getAll: async (): Promise<Geofence[]> => {
    const response = await apiClient.get<Geofence[]>("/geofences");
    return response.data || [];
  },

  /**
   * Get a single geofence by ID
   */
  getById: async (id: string): Promise<Geofence> => {
    const response = await apiClient.get<Geofence>(`/geofences/${id}`);
    return response.data!;
  },

  /**
   * Create a new geofence
   */
  create: async (data: CreateGeofenceDto): Promise<Geofence> => {
    const response = await apiClient.post<Geofence>("/geofences", data);
    return response.data!;
  },

  /**
   * Update an existing geofence
   */
  update: async (id: string, data: UpdateGeofenceDto): Promise<Geofence> => {
    const response = await apiClient.patch<Geofence>(`/geofences/${id}`, data);
    return response.data!;
  },

  /**
   * Delete a geofence (soft delete)
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/geofences/${id}`);
  },

  /**
   * Toggle geofence active status
   */
  toggleActive: async (id: string): Promise<Geofence> => {
    const response = await apiClient.patch<Geofence>(`/geofences/${id}/toggle`, {});
    return response.data!;
  },

  /**
   * Get voters within a specific geofence using backend calculation
   */
  getVotersInGeofence: async (geofenceId: string, lat: number, lng: number) => {
    const response = await apiClient.get<{ isInside: boolean }>(
      `/geofences/${geofenceId}/check-point?lat=${lat}&lng=${lng}`
    );
    return response.data;
  },

  /**
   * Find all geofences containing a specific point
   */
  findByPoint: async (lat: number, lng: number): Promise<Geofence[]> => {
    const response = await apiClient.get<Geofence[]>(
      `/geofences/find-by-point/location?lat=${lat}&lng=${lng}`
    );
    return response.data || [];
  },
};
