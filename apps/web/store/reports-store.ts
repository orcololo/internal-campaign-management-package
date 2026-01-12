import { create } from "zustand";
import { toast } from "sonner";
import type { SavedReport, ReportFilter, ReportSort } from "@/types/reports";
import type { Voter } from "@/types/voters";
import {
  reportsApi,
  type CreateReportDto,
  type UpdateReportDto,
  type FilterReportDto,
  type PreviewReportDto,
} from "@/lib/api/endpoints/reports";

interface ReportsStore {
  savedReports: SavedReport[];
  currentReport: Partial<SavedReport> | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchReports: (filters?: FilterReportDto) => Promise<void>;
  fetchReportById: (id: string) => Promise<SavedReport | null>;
  createReport: (data: CreateReportDto) => Promise<SavedReport | null>;
  updateReport: (
    id: string,
    updates: UpdateReportDto
  ) => Promise<SavedReport | null>;
  deleteReport: (id: string) => Promise<boolean>;
  duplicateReport: (id: string) => Promise<SavedReport | null>;

  // Preview & Export
  previewReport: (
    id: string,
    params?: PreviewReportDto
  ) => Promise<{ data: Voter[]; meta: any } | null>;
  exportReport: (
    id: string,
    format: "pdf" | "csv" | "excel",
    includeCharts?: boolean
  ) => Promise<{ downloadUrl?: string; jobId?: string } | null>;

  // Local state management
  setCurrentReport: (report: Partial<SavedReport> | null) => void;
  clearError: () => void;

  // Helpers
  getReportById: (id: string) => SavedReport | undefined;
  getMostUsedReports: (limit?: number) => SavedReport[];
  getRecentReports: (limit?: number) => SavedReport[];
}

export const useReportsStore = create<ReportsStore>((set, get) => ({
  savedReports: [],
  currentReport: null,
  isLoading: false,
  error: null,

  // Fetch all reports
  fetchReports: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await reportsApi.fetchReports(filters);
      const reports = Array.isArray(response.data) ? response.data : [];

      // Convert date strings to Date objects
      const normalizedReports = reports.map((r) => ({
        ...r,
        createdAt: new Date(r.createdAt),
        updatedAt: new Date(r.updatedAt),
        lastUsedAt: r.lastUsedAt ? new Date(r.lastUsedAt) : undefined,
      }));

      set({ savedReports: normalizedReports, isLoading: false });
    } catch (error: any) {
      const errorMsg = error.message || "Failed to fetch reports";
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
    }
  },

  // Fetch single report
  fetchReportById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await reportsApi.fetchReportById(id);
      const report = {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
        lastUsedAt: response.data.lastUsedAt
          ? new Date(response.data.lastUsedAt)
          : undefined,
      };
      set({ isLoading: false });
      return report;
    } catch (error: any) {
      const errorMsg = error.message || "Failed to fetch report";
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
      return null;
    }
  },

  // Create new report
  createReport: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await reportsApi.createReport(data);
      const newReport = {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
        lastUsedAt: response.data.lastUsedAt
          ? new Date(response.data.lastUsedAt)
          : undefined,
      };

      set((state) => ({
        savedReports: [...state.savedReports, newReport],
        isLoading: false,
      }));

      toast.success("Report created successfully");
      return newReport;
    } catch (error: any) {
      const errorMsg = error.message || "Failed to create report";
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
      return null;
    }
  },

  // Update report
  updateReport: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const response = await reportsApi.updateReport(id, updates);
      const updatedReport = {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
        lastUsedAt: response.data.lastUsedAt
          ? new Date(response.data.lastUsedAt)
          : undefined,
      };

      set((state) => ({
        savedReports: state.savedReports.map((r) =>
          r.id === id ? updatedReport : r
        ),
        isLoading: false,
      }));

      toast.success("Report updated successfully");
      return updatedReport;
    } catch (error: any) {
      const errorMsg = error.message || "Failed to update report";
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
      return null;
    }
  },

  // Delete report
  deleteReport: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await reportsApi.deleteReport(id);

      set((state) => ({
        savedReports: state.savedReports.filter((r) => r.id !== id),
        isLoading: false,
      }));

      toast.success("Report deleted successfully");
      return true;
    } catch (error: any) {
      const errorMsg = error.message || "Failed to delete report";
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
      return false;
    }
  },

  // Duplicate report
  duplicateReport: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await reportsApi.duplicateReport(id);
      const duplicatedReport = {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
        lastUsedAt: response.data.lastUsedAt
          ? new Date(response.data.lastUsedAt)
          : undefined,
      };

      set((state) => ({
        savedReports: [...state.savedReports, duplicatedReport],
        isLoading: false,
      }));

      toast.success("Report duplicated successfully");
      return duplicatedReport;
    } catch (error: any) {
      const errorMsg = error.message || "Failed to duplicate report";
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
      return null;
    }
  },

  // Preview report data
  previewReport: async (id, params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await reportsApi.previewReport(id, params);
      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      const errorMsg = error.message || "Failed to preview report";
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
      return null;
    }
  },

  // Export report
  exportReport: async (id, format, includeCharts = false) => {
    set({ isLoading: true, error: null });
    try {
      const response = await reportsApi.exportReport(id, format, includeCharts);
      set({ isLoading: false });

      if (response.data.downloadUrl) {
        // Immediate download
        const blob = await reportsApi.downloadExport(response.data.downloadUrl);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `report-${id}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success("Report exported successfully");
      } else if (response.data.jobId) {
        // Queued job
        toast.info("Export job queued. You'll be notified when ready.");
      }

      return response.data;
    } catch (error: any) {
      const errorMsg = error.message || "Failed to export report";
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
      return null;
    }
  },

  // Local state management
  setCurrentReport: (report) => set({ currentReport: report }),

  clearError: () => set({ error: null }),

  // Helpers
  getReportById: (id) => {
    return get().savedReports.find((r) => r.id === id);
  },

  getMostUsedReports: (limit = 5) => {
    return [...get().savedReports]
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  },

  getRecentReports: (limit = 5) => {
    return [...get().savedReports]
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, limit);
  },
}));
