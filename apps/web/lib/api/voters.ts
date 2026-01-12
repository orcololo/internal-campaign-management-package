import { realApiClient } from "./real-client";
import {
  transformVoter,
  transformVoters,
} from "@/lib/transformers/voter-transformer";
import type { Voter } from "@/types/voters";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

export interface VoterFilters {
  page?: number;
  limit?: number;
  perPage?: number; // Alternative to limit
  search?: string;
  supportLevel?: string;
  city?: string;
  state?: string;
  ageGroup?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface BulkDeleteRequest {
  ids: string[];
}

export interface BulkUpdateRequest {
  updates: Array<{
    id: string;
    data: Partial<Voter>;
  }>;
}

export interface ImportResult {
  success: number;
  failed: number;
  skipped: number;
  errors: Array<{
    row: number;
    error: string;
  }>;
}

export interface ReferralStats {
  totalReferrals: number;
  referralsBySupportLevel: Record<string, number>;
  conversionRate: number;
  topReferrer: boolean;
  referralScore: number;
}

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

export interface NearbyVotersParams {
  lat: number;
  lng: number;
  radius: number;
  limit?: number;
}

export interface GeofenceParams {
  centerLat: number;
  centerLng: number;
  radiusKm: number;
}

export interface GeofencePolygonParams {
  polygon: Array<{ lat: number; lng: number }>;
}

/**
 * Voters API Client
 *
 * Provides methods to interact with the voters backend API
 */
export const votersApi = {
  /**
   * List voters with pagination and filters
   */
  async list(
    filters?: VoterFilters
  ): Promise<ApiResponse<PaginatedResponse<Voter>>> {
    // Map frontend params to backend params
    const params: any = { ...filters };

    // Backend uses 'limit', frontend uses 'perPage' or 'limit'
    if (params.perPage) {
      params.limit = params.perPage;
      delete params.perPage;
    }

    const response = await realApiClient.get<any>("/voters", {
      params,
    });

    // Backend returns {data: [], meta: {total, page, limit, totalPages}}
    // Transform to frontend format {data: [], total, page, perPage, totalPages}
    if (response.data) {
      const backendData = response.data;
      const transformedData: PaginatedResponse<Voter> = {
        data: transformVoters(backendData.data || []),
        total: backendData.meta?.total || 0,
        page: backendData.meta?.page || 1,
        perPage: backendData.meta?.limit || 20,
        totalPages: backendData.meta?.totalPages || 1,
      };

      return {
        ...response,
        data: transformedData,
      };
    }

    return response;
  },

  /**
   * Get voter statistics
   */
  async getStatistics(): Promise<ApiResponse<any>> {
    return realApiClient.get("/voters/statistics");
  },

  /**
   * Get single voter by ID
   */
  async getById(id: string): Promise<ApiResponse<Voter>> {
    const response = await realApiClient.get<Voter>(`/voters/${id}`);

    if (response.data) {
      response.data = transformVoter(response.data);
    }

    return response;
  },

  /**
   * Create new voter
   */
  async create(data: Partial<Voter>): Promise<ApiResponse<Voter>> {
    const response = await realApiClient.post<Voter>("/voters", data);

    if (response.data) {
      response.data = transformVoter(response.data);
    }

    return response;
  },

  /**
   * Update voter
   */
  async update(id: string, data: Partial<Voter>): Promise<ApiResponse<Voter>> {
    const response = await realApiClient.patch<Voter>(`/voters/${id}`, data);

    if (response.data) {
      response.data = transformVoter(response.data);
    }

    return response;
  },

  /**
   * Delete voter (soft delete)
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    return realApiClient.delete<void>(`/voters/${id}`);
  },

  /**
   * Bulk delete voters
   */
  async bulkDelete(
    ids: string[]
  ): Promise<ApiResponse<{ deleted: number; failed: number; errors: any[] }>> {
    return realApiClient.post("/voters/bulk/delete", { ids });
  },

  /**
   * Bulk update voters
   */
  async bulkUpdate(
    updates: Array<{ id: string; data: Partial<Voter> }>
  ): Promise<ApiResponse<{ updated: number; failed: number; errors: any[] }>> {
    return realApiClient.patch("/voters/bulk/update", { updates });
  },

  /**
   * Import voters from CSV
   */
  async importCsv(
    file: File,
    options?: {
      skipDuplicates?: boolean;
      autoGeocode?: boolean;
    }
  ): Promise<ApiResponse<ImportResult>> {
    return realApiClient.uploadFile<ImportResult>(
      "/voters/import/csv",
      file,
      options
    );
  },

  /**
   * Export voters to CSV
   */
  async exportCsv(filters?: VoterFilters): Promise<void> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const endpoint = `/voters/export/csv${
      queryString ? `?${queryString}` : ""
    }`;

    await realApiClient.downloadFile(endpoint, "voters-export.csv");
  },

  /**
   * Geocode voter address
   */
  async geocode(id: string): Promise<ApiResponse<GeocodeResult>> {
    return realApiClient.post<GeocodeResult>(`/voters/${id}/geocode`);
  },

  /**
   * Batch geocode voters
   */
  async batchGeocode(
    limit?: number
  ): Promise<ApiResponse<{ geocoded: number; failed: number }>> {
    const endpoint = `/voters/location/batch-geocode${
      limit ? `?limit=${limit}` : ""
    }`;
    return realApiClient.post(endpoint);
  },

  /**
   * Find nearby voters
   */
  async findNearby(params: NearbyVotersParams): Promise<ApiResponse<Voter[]>> {
    const queryParams = new URLSearchParams({
      lat: String(params.lat),
      lng: String(params.lng),
      radius: String(params.radius),
      ...(params.limit && { limit: String(params.limit) }),
    });

    const response = await realApiClient.get<Voter[]>(
      `/voters/location/nearby?${queryParams}`
    );

    if (response.data) {
      response.data = transformVoters(response.data);
    }

    return response;
  },

  /**
   * Find voters in circular geofence
   */
  async findInGeofence(params: GeofenceParams): Promise<ApiResponse<Voter[]>> {
    const response = await realApiClient.post<Voter[]>(
      "/voters/location/geofence",
      params
    );

    if (response.data) {
      response.data = transformVoters(response.data);
    }

    return response;
  },

  /**
   * Find voters in polygon geofence
   */
  async findInPolygon(
    params: GeofencePolygonParams
  ): Promise<ApiResponse<Voter[]>> {
    const response = await realApiClient.post<Voter[]>(
      "/voters/location/geofence-polygon",
      params
    );

    if (response.data) {
      response.data = transformVoters(response.data);
    }

    return response;
  },

  /**
   * Get voter referrals
   */
  async getReferrals(
    id: string,
    page?: number,
    limit?: number
  ): Promise<ApiResponse<PaginatedResponse<Voter>>> {
    const params = new URLSearchParams();
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));

    const queryString = params.toString();
    const endpoint = `/voters/${id}/referrals${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await realApiClient.get<PaginatedResponse<Voter>>(
      endpoint
    );

    if (response.data?.data) {
      response.data.data = transformVoters(response.data.data);
    }

    return response;
  },

  /**
   * Get referral statistics
   */
  async getReferralStats(id: string): Promise<ApiResponse<ReferralStats>> {
    return realApiClient.get<ReferralStats>(`/voters/${id}/referral-stats`);
  },

  /**
   * Generate referral code
   */
  async generateReferralCode(
    id: string
  ): Promise<ApiResponse<{ referralCode: string; referralUrl: string }>> {
    return realApiClient.post(`/voters/${id}/referral-code`);
  },

  /**
   * Register via referral code
   */
  async registerViaReferral(data: {
    referralCode: string;
    name: string;
    email?: string;
    phone?: string;
    [key: string]: any;
  }): Promise<ApiResponse<Voter>> {
    const response = await realApiClient.post<Voter>(
      "/voters/register-referral",
      data
    );

    if (response.data) {
      response.data = transformVoter(response.data);
    }

    return response;
  },
};
