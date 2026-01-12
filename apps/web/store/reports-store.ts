import { create } from "zustand";
import type { SavedReport, ReportFilter, ReportSort } from "@/types/reports";
import type { Voter } from "@/types/voters";

interface ReportsStore {
  savedReports: SavedReport[];
  currentReport: Partial<SavedReport> | null;

  // Actions
  setSavedReports: (reports: SavedReport[]) => void;
  addReport: (report: SavedReport) => void;
  updateReport: (id: string, updates: Partial<SavedReport>) => void;
  deleteReport: (id: string) => void;
  setCurrentReport: (report: Partial<SavedReport> | null) => void;

  // Helpers
  getReportById: (id: string) => SavedReport | undefined;
  getMostUsedReports: (limit?: number) => SavedReport[];
  getRecentReports: (limit?: number) => SavedReport[];
}

export const useReportsStore = create<ReportsStore>((set, get) => ({
  savedReports: [],
  currentReport: null,

  setSavedReports: (reports) => set({ savedReports: reports }),

  addReport: (report) =>
    set((state) => ({
      savedReports: [...state.savedReports, report],
    })),

  updateReport: (id, updates) =>
    set((state) => ({
      savedReports: state.savedReports.map((r) =>
        r.id === id ? { ...r, ...updates, updatedAt: new Date() } : r
      ),
    })),

  deleteReport: (id) =>
    set((state) => ({
      savedReports: state.savedReports.filter((r) => r.id !== id),
    })),

  setCurrentReport: (report) => set({ currentReport: report }),

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
