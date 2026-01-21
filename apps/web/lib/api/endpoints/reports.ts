import { apiClient } from "../client";
import type { SavedReport, ReportFilter, ReportSort } from "@/types/reports";
import type { Voter } from "@/types/voters";
import type { ApiResponse, PaginationMeta } from "@/types/api";

// DTOs matching backend
export interface CreateReportDto {
  name: string;
  description?: string;
  filters: ReportFilter[];
  sorting: ReportSort[];
  columns: string[];
  isPublic?: boolean;
}

export interface UpdateReportDto {
  name?: string;
  description?: string;
  filters?: ReportFilter[];
  sorting?: ReportSort[];
  columns?: string[];
  isPublic?: boolean;
}

export interface FilterReportDto {
  page?: number;
  perPage?: number;
  search?: string;
  isPublic?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PreviewReportDto {
  page?: number;
  perPage?: number;
}

export interface ExportReportDto {
  format: "pdf" | "csv" | "excel";
  includeCharts?: boolean;
}

export interface ExportJobStatus {
  id: string;
  state: "waiting" | "active" | "completed" | "failed";
  progress: number;
  downloadUrl?: string;
  error?: string;
}

export interface ReportPreviewResponse {
  data: Voter[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

const CAMPAIGN_ID = "1"; // TODO: Get from auth context when implemented

/**
 * Map frontend operator names to backend operator names
 */
const operatorMapping: Record<string, string> = {
  equals: "equals",
  notEquals: "not_equals",
  contains: "contains",
  notContains: "not_contains",
  startsWith: "starts_with",
  endsWith: "ends_with",
  greaterThan: "greater_than",
  lessThan: "less_than",
  greaterThanOrEqual: "greater_than_or_equal",
  lessThanOrEqual: "less_than_or_equal",
  between: "between",
  in: "in",
  notIn: "not_in",
  isEmpty: "is_null",
  isNotEmpty: "is_not_null",
};

/**
 * Transform frontend filters to backend format
 * - Removes 'id' property
 * - Converts camelCase operators to snake_case
 * - Handles null values for is_null/is_not_null operators
 */
function transformFiltersForBackend(
  filters: ReportFilter[]
): Array<{ field: string; operator: string; value?: any }> {
  return filters.map((filter) => {
    const backendOperator = operatorMapping[filter.operator] || filter.operator;

    // For is_null and is_not_null, value should be omitted
    if (backendOperator === "is_null" || backendOperator === "is_not_null") {
      return {
        field: filter.field,
        operator: backendOperator,
      };
    }

    return {
      field: filter.field,
      operator: backendOperator,
      value: filter.value,
    };
  });
}

/**
 * Reports API Client
 * Connects to backend reports endpoints
 */
export const reportsApi = {
  /**
   * Fetch all saved reports with optional filters
   */
  async fetchReports(
    filters?: FilterReportDto
  ): Promise<ApiResponse<SavedReport[]>> {
    return apiClient.get<SavedReport[]>("/reports", {
      params: filters,
    });
  },

  /**
   * Fetch a single report by ID
   */
  async fetchReportById(id: string): Promise<ApiResponse<SavedReport>> {
    return apiClient.get<SavedReport>(`/reports/${id}`);
  },

  /**
   * Create a new saved report
   */
  async createReport(data: CreateReportDto): Promise<ApiResponse<SavedReport>> {
    // Transform filters to backend format
    const backendData = {
      ...data,
      filters: data.filters ? transformFiltersForBackend(data.filters) : [],
    };
    return apiClient.post<SavedReport>("/reports", backendData);
  },

  /**
   * Update an existing report
   */
  async updateReport(
    id: string,
    data: UpdateReportDto
  ): Promise<ApiResponse<SavedReport>> {
    // Transform filters to backend format if provided
    const backendData = {
      ...data,
      filters: data.filters ? transformFiltersForBackend(data.filters) : undefined,
    };
    return apiClient.patch<SavedReport>(`/reports/${id}`, backendData);
  },

  /**
   * Delete a report (soft delete)
   */
  async deleteReport(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/reports/${id}`);
  },

  /**
   * Preview report data with pagination
   */
  async previewReport(
    id: string,
    params?: PreviewReportDto
  ): Promise<ApiResponse<ReportPreviewResponse>> {
    return apiClient.post<ReportPreviewResponse>(`/reports/${id}/preview`, {
      page: params?.page || 1,
      perPage: params?.perPage || 20,
    });
  },

  /**
   * Execute a report without saving (ad-hoc query)
   */
  async executeReport(data: {
    filters: ReportFilter[];
    sorting: ReportSort[];
    columns: string[];
    page?: number;
    perPage?: number;
  }): Promise<ApiResponse<ReportPreviewResponse>> {
    // Transform filters to backend format
    const backendData = {
      ...data,
      filters: data.filters ? transformFiltersForBackend(data.filters) : [],
    };
    return apiClient.post<ReportPreviewResponse>("/reports/execute", backendData);
  },

  /**
   * Export a report (small datasets return immediately, large ones are queued)
   */
  async exportReport(
    id: string,
    format: "pdf" | "csv" | "excel",
    includeCharts: boolean = false
  ): Promise<ApiResponse<{ downloadUrl?: string; jobId?: string }>> {
    const response = await apiClient.post<{
      downloadUrl?: string;
      jobId?: string;
    }>(`/reports/${id}/export`, {
      format,
      includeCharts,
    });

    // If downloadUrl is returned, it's an immediate download
    // If jobId is returned, it's a queued job
    return response;
  },

  /**
   * Check export job status
   */
  async getExportStatus(jobId: string): Promise<ApiResponse<ExportJobStatus>> {
    return apiClient.get<ExportJobStatus>(`/reports/exports/${jobId}/status`);
  },

  /**
   * Download exported report file
   * Returns a blob that can be used to trigger download
   */
  async downloadExport(url: string): Promise<Blob> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }
    return response.blob();
  },

  /**
   * Get export history for a report
   */
  async getExportHistory(reportId: string): Promise<
    ApiResponse<
      Array<{
        id: string;
        format: string;
        recordCount: number;
        fileSize: number;
        exportedAt: string;
        exportedBy: string;
      }>
    >
  > {
    return apiClient.get(`/reports/${reportId}/exports`);
  },

  /**
   * Duplicate an existing report
   */
  async duplicateReport(id: string): Promise<ApiResponse<SavedReport>> {
    const report = await this.fetchReportById(id);
    return this.createReport({
      name: `${report.data.name} (Copy)`,
      description: report.data.description,
      filters: report.data.filters,
      sorting: report.data.sorting,
      columns: report.data.columns,
      isPublic: false,
    });
  },

  /**
   * Update report usage statistics (called when report is used)
   */
  async incrementUsageCount(id: string): Promise<void> {
    // Backend automatically tracks usage when preview/export is called
    // This is handled server-side, no need for explicit call
  },
};
