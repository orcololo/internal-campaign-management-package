import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {
  AnalyticsPeriod,
  AnalyticsFilters,
  AnalyticsTab,
  CampaignOverview,
  InfluenceAnalytics,
  EngagementAnalytics,
  VoterAnalytics,
  EventAnalytics,
  CanvassingAnalytics,
  GeographicData,
  TimeSeriesData,
  DrillDownData,
  AutoRefreshConfig,
  CampaignMetrics,
  DateRange,
} from "@/types/analytics";
import { analyticsApi } from "@/lib/api/endpoints/analytics";
import { toast } from "sonner";

interface AnalyticsState {
  // Filters
  period: AnalyticsPeriod;
  dateRange: DateRange | null;
  selectedTab: AnalyticsTab;
  filters: AnalyticsFilters;

  // Data
  overview: CampaignOverview | null;
  influence: InfluenceAnalytics | null;
  engagement: EngagementAnalytics | null;
  voters: VoterAnalytics | null;
  events: EventAnalytics | null;
  canvassing: CanvassingAnalytics | null;
  geographic: GeographicData | null;
  timeSeries: TimeSeriesData | null;
  campaignMetrics: CampaignMetrics | null;

  // UI State
  isLoading: boolean;
  error: string | null;
  autoRefresh: AutoRefreshConfig;
  drillDown: DrillDownData | null;
  exportInProgress: boolean;

  // Actions - Filters
  setPeriod: (period: AnalyticsPeriod) => void;
  setDateRange: (range: DateRange | null) => void;
  setSelectedTab: (tab: AnalyticsTab) => void;
  setFilters: (filters: Partial<AnalyticsFilters>) => void;
  clearFilters: () => void;

  // Actions - Data Fetching
  fetchOverview: () => Promise<void>;
  fetchInfluenceAnalytics: () => Promise<void>;
  fetchEngagementAnalytics: () => Promise<void>;
  fetchVoterAnalytics: () => Promise<void>;
  fetchEventAnalytics: () => Promise<void>;
  fetchCanvassingAnalytics: () => Promise<void>;
  fetchGeographicData: () => Promise<void>;
  fetchTimeSeries: (metric: string) => Promise<void>;
  fetchCampaignMetrics: () => Promise<void>;
  fetchAllData: () => Promise<void>;

  // Actions - UI
  toggleAutoRefresh: () => void;
  setAutoRefreshInterval: (interval: number) => void;
  openDrillDown: (data: DrillDownData) => void;
  closeDrillDown: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Actions - Export
  exportData: (format: "pdf" | "csv" | "excel") => Promise<void>;

  // Actions - Utilities
  reset: () => void;
}

const initialState = {
  // Filters
  period: "month" as AnalyticsPeriod,
  dateRange: null,
  selectedTab: "overview" as AnalyticsTab,
  filters: {},

  // Data
  overview: null,
  influence: null,
  engagement: null,
  voters: null,
  events: null,
  canvassing: null,
  geographic: null,
  timeSeries: null,
  campaignMetrics: null,

  // UI State
  isLoading: false,
  error: null,
  autoRefresh: {
    enabled: false,
    interval: 60, // 60 seconds default
    lastUpdate: null,
  },
  drillDown: null,
  exportInProgress: false,
};

export const useAnalyticsStore = create<AnalyticsState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Filter Actions
        setPeriod: (period) => {
          set({ period });
          // Trigger data refetch when period changes
          const { fetchAllData } = get();
          fetchAllData();
        },

        setDateRange: (range) => {
          set({ dateRange: range, period: "custom" });
          const { fetchAllData } = get();
          fetchAllData();
        },

        setSelectedTab: (tab) => set({ selectedTab: tab }),

        setFilters: (newFilters) =>
          set((state) => ({
            filters: { ...state.filters, ...newFilters },
          })),

        clearFilters: () => {
          set({ filters: {}, period: "month", dateRange: null });
          const { fetchAllData } = get();
          fetchAllData();
        },

        // Data Fetching Actions
        fetchOverview: async () => {
          try {
            set({ isLoading: true, error: null });
            const response = await analyticsApi.getCampaignOverview();
            if (response.data) {
              set({ overview: response.data });
            }
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            set({ error: errorMessage });
            toast.error("Failed to fetch campaign overview");
          } finally {
            set({ isLoading: false });
          }
        },

        fetchInfluenceAnalytics: async () => {
          try {
            set({ isLoading: true, error: null });
            const { period, filters } = get();
            const response = await analyticsApi.getInfluenceAnalytics({
              period,
              filters,
            });
            if (response.data) {
              set({ influence: response.data });
            }
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            set({ error: errorMessage });
            toast.error("Failed to fetch influence analytics");
          } finally {
            set({ isLoading: false });
          }
        },

        fetchEngagementAnalytics: async () => {
          try {
            set({ isLoading: true, error: null });
            const { period, filters } = get();
            const response = await analyticsApi.getEngagementAnalytics({
              period,
              filters,
            });
            if (response.data) {
              set({ engagement: response.data });
            }
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            set({ error: errorMessage });
            toast.error("Failed to fetch engagement analytics");
          } finally {
            set({ isLoading: false });
          }
        },

        fetchVoterAnalytics: async () => {
          try {
            set({ isLoading: true, error: null });
            const { period, filters } = get();
            const response = await analyticsApi.getVoterAnalytics({
              period,
              filters,
            });
            if (response.data) {
              set({ voters: response.data });
            }
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            set({ error: errorMessage });
            toast.error("Failed to fetch voter analytics");
          } finally {
            set({ isLoading: false });
          }
        },

        fetchEventAnalytics: async () => {
          try {
            set({ isLoading: true, error: null });
            const { period } = get();
            const response = await analyticsApi.getEventAnalytics({ period });
            if (response.data) {
              set({ events: response.data });
            }
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            set({ error: errorMessage });
            toast.error("Failed to fetch event analytics");
          } finally {
            set({ isLoading: false });
          }
        },

        fetchCanvassingAnalytics: async () => {
          try {
            set({ isLoading: true, error: null });
            const response = await analyticsApi.getCanvassingAnalytics();
            if (response.data) {
              set({ canvassing: response.data });
            }
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            set({ error: errorMessage });
            toast.error("Failed to fetch canvassing analytics");
          } finally {
            set({ isLoading: false });
          }
        },

        fetchGeographicData: async () => {
          try {
            set({ isLoading: true, error: null });
            const response = await analyticsApi.getGeographicHeatmap();
            if (response.data) {
              set({ geographic: response.data });
            }
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            set({ error: errorMessage });
            toast.error("Failed to fetch geographic data");
          } finally {
            set({ isLoading: false });
          }
        },

        fetchTimeSeries: async (metric) => {
          try {
            set({ isLoading: true, error: null });
            const { period, dateRange } = get();

            // Calculate date range based on period
            const endDate = new Date();
            const startDate = new Date();

            if (period === "week") {
              startDate.setDate(endDate.getDate() - 7);
            } else if (period === "month") {
              startDate.setDate(endDate.getDate() - 30);
            } else if (period === "quarter") {
              startDate.setDate(endDate.getDate() - 90);
            } else if (period === "year") {
              startDate.setDate(endDate.getDate() - 365);
            } else if (dateRange) {
              startDate.setTime(dateRange.start.getTime());
              endDate.setTime(dateRange.end.getTime());
            }

            const response = await analyticsApi.getTimeSeries({
              startDate: startDate.toISOString().split("T")[0],
              endDate: endDate.toISOString().split("T")[0],
              metric: metric as any,
            });

            if (response.data) {
              set({ timeSeries: response.data });
            }
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            set({ error: errorMessage });
            toast.error("Failed to fetch time series data");
          } finally {
            set({ isLoading: false });
          }
        },

        fetchCampaignMetrics: async () => {
          try {
            set({ isLoading: true, error: null });
            const response = await analyticsApi.getCampaignMetrics();
            if (response.data) {
              set({ campaignMetrics: response.data });
            }
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            set({ error: errorMessage });
            toast.error("Failed to fetch campaign metrics");
          } finally {
            set({ isLoading: false });
          }
        },

        fetchAllData: async () => {
          try {
            set({ isLoading: true, error: null });

            const {
              fetchOverview,
              fetchInfluenceAnalytics,
              fetchEngagementAnalytics,
              fetchVoterAnalytics,
              fetchEventAnalytics,
              fetchCanvassingAnalytics,
              fetchGeographicData,
              fetchCampaignMetrics,
            } = get();

            // Fetch all data in parallel
            await Promise.all([
              fetchOverview(),
              fetchInfluenceAnalytics(),
              fetchEngagementAnalytics(),
              fetchVoterAnalytics(),
              fetchEventAnalytics(),
              fetchCanvassingAnalytics(),
              fetchGeographicData(),
              fetchCampaignMetrics(),
            ]);

            set({
              autoRefresh: {
                ...get().autoRefresh,
                lastUpdate: new Date(),
              },
            });
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            set({ error: errorMessage });
            toast.error("Failed to fetch analytics data");
          } finally {
            set({ isLoading: false });
          }
        },

        // UI Actions
        toggleAutoRefresh: () =>
          set((state) => ({
            autoRefresh: {
              ...state.autoRefresh,
              enabled: !state.autoRefresh.enabled,
            },
          })),

        setAutoRefreshInterval: (interval) =>
          set((state) => ({
            autoRefresh: {
              ...state.autoRefresh,
              interval,
            },
          })),

        openDrillDown: (data) => set({ drillDown: data }),

        closeDrillDown: () => set({ drillDown: null }),

        setLoading: (loading) => set({ isLoading: loading }),

        setError: (error) => set({ error }),

        // Export Action
        exportData: async (format) => {
          try {
            set({ exportInProgress: true });

            // Import export service dynamically
            const { AnalyticsExportService } = await import(
              "@/lib/analytics/export-service"
            );
            const exportService = new AnalyticsExportService();

            const state = get();
            const data = {
              overview: state.overview,
              influence: state.influence,
              engagement: state.engagement,
              voters: state.voters,
              events: state.events,
              canvassing: state.canvassing,
              geographic: state.geographic,
              campaignMetrics: state.campaignMetrics,
            };

            const options = {
              format,
              period: state.period,
              sections: ["all"] as any,
              includeCharts: format === "pdf",
              chartResolution: "high" as any,
            };

            if (format === "pdf") {
              await exportService.exportToPDF(data, options);
              toast.success("PDF report exported successfully");
            } else if (format === "csv") {
              // Export each dataset as separate CSV
              if (state.influence?.topInfluencers) {
                await exportService.exportToCSV(
                  state.influence.topInfluencers,
                  "top-influencers"
                );
              }
              if (state.engagement?.topEngaged) {
                await exportService.exportToCSV(
                  state.engagement.topEngaged,
                  "top-engaged-voters"
                );
              }
              toast.success("CSV files exported successfully");
            } else if (format === "excel") {
              await exportService.exportToExcel(data, "analytics-report");
              toast.success("Excel report exported successfully");
            }
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Export failed";
            toast.error(errorMessage);
            set({ error: errorMessage });
          } finally {
            set({ exportInProgress: false });
          }
        },

        // Utility Actions
        reset: () => set(initialState),
      }),
      {
        name: "analytics-storage",
        partialize: (state) => ({
          // Only persist user preferences, not data
          period: state.period,
          selectedTab: state.selectedTab,
          filters: state.filters,
          autoRefresh: state.autoRefresh,
        }),
      }
    ),
    { name: "AnalyticsStore" }
  )
);

// Selectors for optimized re-renders
export const selectPeriod = (state: AnalyticsState) => state.period;
export const selectSelectedTab = (state: AnalyticsState) => state.selectedTab;
export const selectFilters = (state: AnalyticsState) => state.filters;
export const selectIsLoading = (state: AnalyticsState) => state.isLoading;
export const selectError = (state: AnalyticsState) => state.error;
export const selectOverview = (state: AnalyticsState) => state.overview;
export const selectInfluence = (state: AnalyticsState) => state.influence;
export const selectEngagement = (state: AnalyticsState) => state.engagement;
export const selectVoters = (state: AnalyticsState) => state.voters;
export const selectEvents = (state: AnalyticsState) => state.events;
export const selectCanvassing = (state: AnalyticsState) => state.canvassing;
export const selectGeographic = (state: AnalyticsState) => state.geographic;
export const selectTimeSeries = (state: AnalyticsState) => state.timeSeries;
export const selectCampaignMetrics = (state: AnalyticsState) =>
  state.campaignMetrics;
export const selectDrillDown = (state: AnalyticsState) => state.drillDown;
export const selectAutoRefresh = (state: AnalyticsState) => state.autoRefresh;
export const selectExportInProgress = (state: AnalyticsState) =>
  state.exportInProgress;
