import { apiClient } from "../client";
import { ApiResponse } from "@/types/api";
import {
  dashboardMetrics,
  chartData,
  demographicData,
  recentActivities,
  DashboardMetrics,
  ChartDataPoint,
  DemographicData,
  RecentActivity,
} from "@/mock-data/analytics";
import type {
  CampaignOverview,
  InfluenceAnalytics,
  EngagementAnalytics,
  VoterAnalytics,
  EventAnalytics,
  CanvassingAnalytics,
  GeographicData,
  TimeSeriesData,
  CampaignMetrics,
  AnalyticsFilters,
  AnalyticsPeriod,
} from "@/types/analytics";

// Import new mock data
import {
  campaignOverviewMock,
  influenceAnalyticsMock,
  engagementAnalyticsMock,
  voterAnalyticsMock,
  eventAnalyticsMock,
  canvassingAnalyticsMock,
  geographicDataMock,
  timeSeriesDataMock,
  campaignMetricsMock,
} from "@/mock-data/analytics";

// Register mock data (existing)
apiClient.registerMockData("/analytics/dashboard-metrics", dashboardMetrics);
apiClient.registerMockData("/analytics/chart-data", chartData);
apiClient.registerMockData("/analytics/demographic-data", demographicData);
apiClient.registerMockData("/analytics/recent-activities", recentActivities);

// Register new analytics mock data
apiClient.registerMockData("/analytics/overview", campaignOverviewMock);
apiClient.registerMockData("/analytics/influence", influenceAnalyticsMock);
apiClient.registerMockData("/analytics/engagement", engagementAnalyticsMock);
apiClient.registerMockData("/analytics/voters", voterAnalyticsMock);
apiClient.registerMockData("/analytics/events", eventAnalyticsMock);
apiClient.registerMockData("/analytics/canvassing", canvassingAnalyticsMock);
apiClient.registerMockData("/analytics/geographic-heatmap", geographicDataMock);
apiClient.registerMockData("/analytics/time-series", timeSeriesDataMock);
apiClient.registerMockData("/analytics/campaign-metrics", campaignMetricsMock);

export const analyticsApi = {
  /**
   * Get dashboard metrics (voters, events, engagement, etc.)
   */
  getDashboardMetrics: async (): Promise<ApiResponse<DashboardMetrics>> => {
    return apiClient.get<DashboardMetrics>("/analytics/dashboard-metrics");
  },

  /**
   * Get chart data for time series
   */
  getChartData: async (params?: {
    period?: "week" | "month" | "quarter";
  }): Promise<ApiResponse<ChartDataPoint[]>> => {
    // TODO: Filter by period in real implementation
    return apiClient.get<ChartDataPoint[]>("/analytics/chart-data", { params });
  },

  /**
   * Get demographic data
   */
  getDemographicData: async (): Promise<ApiResponse<DemographicData>> => {
    return apiClient.get<DemographicData>("/analytics/demographic-data");
  },

  /**
   * Get recent activities
   */
  getRecentActivities: async (params?: {
    limit?: number;
  }): Promise<ApiResponse<RecentActivity[]>> => {
    return apiClient.get<RecentActivity[]>("/analytics/recent-activities", {
      params,
    });
  },

  /**
   * Get comprehensive campaign overview
   */
  getCampaignOverview: async (): Promise<ApiResponse<CampaignOverview>> => {
    return apiClient.get<CampaignOverview>("/analytics/overview");
  },

  /**
   * Get voter analytics with demographics and engagement
   */
  getVoterAnalytics: async (params?: {
    period?: AnalyticsPeriod;
    filters?: AnalyticsFilters;
  }): Promise<ApiResponse<VoterAnalytics>> => {
    return apiClient.get<VoterAnalytics>("/analytics/voters", { params });
  },

  /**
   * Get event analytics
   */
  getEventAnalytics: async (params?: {
    period?: AnalyticsPeriod;
  }): Promise<ApiResponse<EventAnalytics>> => {
    return apiClient.get<EventAnalytics>("/analytics/events", { params });
  },

  /**
   * Get canvassing analytics
   */
  getCanvassingAnalytics: async (): Promise<ApiResponse<CanvassingAnalytics>> => {
    return apiClient.get<CanvassingAnalytics>("/analytics/canvassing");
  },

  /**
   * Get geographic heatmap data
   */
  getGeographicHeatmap: async (params?: {
    metric?: 'support' | 'influence' | 'engagement';
  }): Promise<ApiResponse<GeographicData>> => {
    return apiClient.get<GeographicData>("/analytics/geographic-heatmap", { params });
  },

  /**
   * Get time series data
   */
  getTimeSeries: async (params: {
    startDate: string;
    endDate: string;
    metric: 'voter-registrations' | 'events' | 'canvassing' | 'engagement';
  }): Promise<ApiResponse<TimeSeriesData>> => {
    return apiClient.get<TimeSeriesData>("/analytics/time-series", { params });
  },

  /**
   * Get influence analytics
   */
  getInfluenceAnalytics: async (params?: {
    period?: AnalyticsPeriod;
    filters?: AnalyticsFilters;
    minScore?: number;
  }): Promise<ApiResponse<InfluenceAnalytics>> => {
    return apiClient.get<InfluenceAnalytics>("/analytics/influence", { params });
  },

  /**
   * Get engagement analytics
   */
  getEngagementAnalytics: async (params?: {
    period?: AnalyticsPeriod;
    filters?: AnalyticsFilters;
    trend?: string;
  }): Promise<ApiResponse<EngagementAnalytics>> => {
    return apiClient.get<EngagementAnalytics>("/analytics/engagement", { params });
  },

  /**
   * Get campaign metrics (milestones, coverage, geofencing)
   */
  getCampaignMetrics: async (): Promise<ApiResponse<CampaignMetrics>> => {
    return apiClient.get<CampaignMetrics>("/analytics/campaign-metrics");
  },
};
