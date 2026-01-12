import { create } from 'zustand';
import { votersApi, type VoterFilters } from '@/lib/api/voters';
import type { Voter } from '@/types/voters';
import type { PaginatedResponse } from '@/types/api';

interface VotersState {
  // Data
  voters: Voter[];
  selectedVoter: Voter | null;
  totalVoters: number;
  statistics: any | null;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  perPage: number;
  
  // Filters
  filters: VoterFilters;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  selectedIds: string[];
  
  // Actions
  fetchVoters: (filters?: VoterFilters) => Promise<void>;
  fetchStatistics: () => Promise<void>;
  fetchVoter: (id: string) => Promise<void>;
  createVoter: (data: Partial<Voter>) => Promise<Voter | null>;
  updateVoter: (id: string, data: Partial<Voter>) => Promise<Voter | null>;
  deleteVoter: (id: string) => Promise<boolean>;
  bulkDelete: (ids: string[]) => Promise<boolean>;
  bulkUpdate: (updates: Array<{ id: string; data: Partial<Voter> }>) => Promise<boolean>;
  
  // Import/Export
  importCsv: (file: File, options?: { skipDuplicates?: boolean; autoGeocode?: boolean }) => Promise<any>;
  exportCsv: (filters?: VoterFilters) => Promise<void>;
  
  // Location
  geocodeVoter: (id: string) => Promise<boolean>;
  batchGeocode: (limit?: number) => Promise<any>;
  findNearby: (lat: number, lng: number, radius: number) => Promise<Voter[]>;
  
  // Referrals
  getReferrals: (id: string, page?: number) => Promise<PaginatedResponse<Voter> | null>;
  getReferralStats: (id: string) => Promise<any>;
  generateReferralCode: (id: string) => Promise<{ referralCode: string; referralUrl: string } | null>;
  
  // UI Actions
  setFilters: (filters: Partial<VoterFilters>) => void;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  setSelectedIds: (ids: string[]) => void;
  toggleSelectedId: (id: string) => void;
  clearSelection: () => void;
  clearError: () => void;
  reset: () => void;
}

const initialFilters: VoterFilters = {
  page: 1,
  limit: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export const useVotersStore = create<VotersState>((set, get) => ({
  // Initial State
  voters: [],
  selectedVoter: null,
  totalVoters: 0,
  statistics: null,
  currentPage: 1,
  totalPages: 1,
  perPage: 20,
  filters: initialFilters,
  isLoading: false,
  error: null,
  selectedIds: [],

  // Fetch voters with filters
  fetchVoters: async (filters?: VoterFilters) => {
    set({ isLoading: true, error: null });
    
    try {
      const currentFilters = filters || get().filters;
      const response = await votersApi.list(currentFilters);
      
      if (response.data) {
        set({
          voters: response.data.data,
          totalVoters: response.data.total,
          currentPage: response.data.page,
          totalPages: response.data.totalPages,
          perPage: response.data.perPage,
          filters: currentFilters,
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch voters',
        isLoading: false,
      });
    }
  },

  // Fetch statistics
  fetchStatistics: async () => {
    try {
      const response = await votersApi.getStatistics();
      if (response.data) {
        set({ statistics: response.data });
      }
    } catch (error: any) {
      console.error('Failed to fetch statistics:', error);
    }
  },

  // Fetch single voter
  fetchVoter: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await votersApi.getById(id);
      if (response.data) {
        set({
          selectedVoter: response.data,
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch voter',
        isLoading: false,
      });
    }
  },

  // Create voter
  createVoter: async (data: Partial<Voter>) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await votersApi.create(data);
      if (response.data) {
        // Refresh the list
        await get().fetchVoters();
        set({ isLoading: false });
        return response.data;
      }
      return null;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to create voter',
        isLoading: false,
      });
      return null;
    }
  },

  // Update voter
  updateVoter: async (id: string, data: Partial<Voter>) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await votersApi.update(id, data);
      if (response.data) {
        // Update in list if present
        set((state) => ({
          voters: state.voters.map((v) => (v.id === id ? response.data! : v)),
          selectedVoter: state.selectedVoter?.id === id ? response.data : state.selectedVoter,
          isLoading: false,
        }));
        return response.data;
      }
      return null;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update voter',
        isLoading: false,
      });
      return null;
    }
  },

  // Delete voter
  deleteVoter: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await votersApi.delete(id);
      
      // Remove from list
      set((state) => ({
        voters: state.voters.filter((v) => v.id !== id),
        totalVoters: state.totalVoters - 1,
        isLoading: false,
      }));
      
      return true;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to delete voter',
        isLoading: false,
      });
      return false;
    }
  },

  // Bulk delete
  bulkDelete: async (ids: string[]) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await votersApi.bulkDelete(ids);
      
      if (response.data) {
        // Refresh the list
        await get().fetchVoters();
        set({ isLoading: false, selectedIds: [] });
        return true;
      }
      
      return false;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to delete voters',
        isLoading: false,
      });
      return false;
    }
  },

  // Bulk update
  bulkUpdate: async (updates: Array<{ id: string; data: Partial<Voter> }>) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await votersApi.bulkUpdate(updates);
      
      if (response.data) {
        // Refresh the list
        await get().fetchVoters();
        set({ isLoading: false, selectedIds: [] });
        return true;
      }
      
      return false;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update voters',
        isLoading: false,
      });
      return false;
    }
  },

  // Import CSV
  importCsv: async (file: File, options?: { skipDuplicates?: boolean; autoGeocode?: boolean }) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await votersApi.importCsv(file, options);
      
      if (response.data) {
        // Refresh the list
        await get().fetchVoters();
        set({ isLoading: false });
        return response.data;
      }
      
      return null;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to import CSV',
        isLoading: false,
      });
      return null;
    }
  },

  // Export CSV
  exportCsv: async (filters?: VoterFilters) => {
    set({ isLoading: true, error: null });
    
    try {
      const exportFilters = filters || get().filters;
      await votersApi.exportCsv(exportFilters);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to export CSV',
        isLoading: false,
      });
    }
  },

  // Geocode voter
  geocodeVoter: async (id: string) => {
    try {
      const response = await votersApi.geocode(id);
      
      if (response.data) {
        // Update voter in list
        set((state) => ({
          voters: state.voters.map((v) =>
            v.id === id
              ? {
                  ...v,
                  latitude: response.data!.latitude,
                  longitude: response.data!.longitude,
                  address: response.data!.formattedAddress,
                }
              : v
          ),
        }));
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Failed to geocode voter:', error);
      return false;
    }
  },

  // Batch geocode
  batchGeocode: async (limit?: number) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await votersApi.batchGeocode(limit);
      
      if (response.data) {
        // Refresh the list
        await get().fetchVoters();
        set({ isLoading: false });
        return response.data;
      }
      
      return null;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to batch geocode',
        isLoading: false,
      });
      return null;
    }
  },

  // Find nearby voters
  findNearby: async (lat: number, lng: number, radius: number) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await votersApi.findNearby({ lat, lng, radius });
      
      if (response.data) {
        set({ isLoading: false });
        return response.data;
      }
      
      return [];
    } catch (error: any) {
      set({
        error: error.message || 'Failed to find nearby voters',
        isLoading: false,
      });
      return [];
    }
  },

  // Get referrals
  getReferrals: async (id: string, page?: number) => {
    try {
      const response = await votersApi.getReferrals(id, page, 20);
      return response.data || null;
    } catch (error: any) {
      console.error('Failed to fetch referrals:', error);
      return null;
    }
  },

  // Get referral stats
  getReferralStats: async (id: string) => {
    try {
      const response = await votersApi.getReferralStats(id);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch referral stats:', error);
      return null;
    }
  },

  // Generate referral code
  generateReferralCode: async (id: string) => {
    try {
      const response = await votersApi.generateReferralCode(id);
      return response.data || null;
    } catch (error: any) {
      console.error('Failed to generate referral code:', error);
      return null;
    }
  },

  // UI Actions
  setFilters: (filters: Partial<VoterFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  setPage: (page: number) => {
    const state = get();
    state.fetchVoters({ ...state.filters, page });
  },

  setPerPage: (perPage: number) => {
    const state = get();
    state.fetchVoters({ ...state.filters, limit: perPage, page: 1 });
  },

  setSelectedIds: (ids: string[]) => {
    set({ selectedIds: ids });
  },

  toggleSelectedId: (id: string) => {
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((selectedId) => selectedId !== id)
        : [...state.selectedIds, id],
    }));
  },

  clearSelection: () => {
    set({ selectedIds: [] });
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({
      voters: [],
      selectedVoter: null,
      totalVoters: 0,
      statistics: null,
      currentPage: 1,
      totalPages: 1,
      perPage: 20,
      filters: initialFilters,
      isLoading: false,
      error: null,
      selectedIds: [],
    });
  },
}));
