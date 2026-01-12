import { apiClient } from "../client";
import { Voter, VoterFilters, VoterSortOptions } from "@/types/voters";
import { ApiResponse } from "@/types/api";

export interface GetVotersParams
  extends VoterFilters,
    Partial<VoterSortOptions> {
  page?: number;
  perPage?: number;
}

export const votersApi = {
  /**
   * List all voters with optional filtering, sorting, and pagination
   */
  list: async (params?: GetVotersParams): Promise<ApiResponse<Voter[]>> => {
    return apiClient.get<Voter[]>("/voters", {
      params: {
        page: params?.page || 1,
        perPage: params?.perPage || 10,
        search: params?.search,
        sortBy: params?.field,
        sortOrder: params?.order,
        filters: {
          cities: params?.cities,
          states: params?.states,
          supportLevels: params?.supportLevels,
          hasWhatsapp: params?.hasWhatsapp,
          hasLocation: params?.hasLocation,
          tags: params?.tags,
        },
      },
    });
  },

  /**
   * Get a single voter by ID
   */
  get: async (id: string): Promise<ApiResponse<Voter>> => {
    const response = await apiClient.get<Voter[]>("/voters");
    const voter = response.data.find((v: Voter) => v.id === id);

    if (!voter) {
      throw new Error(`Voter with ID ${id} not found`);
    }

    return { data: voter };
  },

  /**
   * Create a new voter
   */
  create: async (data: Partial<Voter>): Promise<ApiResponse<Voter>> => {
    return apiClient.post<Voter>("/voters", data);
  },

  /**
   * Update an existing voter
   */
  update: async (
    id: string,
    data: Partial<Voter>
  ): Promise<ApiResponse<Voter>> => {
    return apiClient.patch<Voter>(`/voters/${id}`, data);
  },

  /**
   * Delete a voter
   */
  delete: async (id: string): Promise<ApiResponse<{ success: boolean }>> => {
    return apiClient.delete<{ success: boolean }>(`/voters/${id}`);
  },

  /**
   * Bulk delete voters
   */
  bulkDelete: async (
    ids: string[]
  ): Promise<ApiResponse<{ success: boolean; count: number }>> => {
    // Simulate bulk delete
    return apiClient.post<{ success: boolean; count: number }>(
      "/voters/bulk-delete",
      {
        ids,
      }
    );
  },
};
