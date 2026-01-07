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

// Register mock data
apiClient.registerMockData("/analytics/dashboard-metrics", dashboardMetrics);
apiClient.registerMockData("/analytics/chart-data", chartData);
apiClient.registerMockData("/analytics/demographic-data", demographicData);
apiClient.registerMockData("/analytics/recent-activities", recentActivities);

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
};
