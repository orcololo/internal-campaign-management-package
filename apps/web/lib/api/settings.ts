import { apiClient } from "./client";

export interface Setting {
  id: string;
  key: string;
  value: any;
  description?: string;
  updatedAt: string;
}

export const settingsApi = {
  getAll: async (): Promise<Setting[]> => {
    const response = await apiClient.get<Setting[]>("/settings");
    return response.data || [];
  },

  getByKey: async (key: string): Promise<Setting | null> => {
    const response = await apiClient.get<Setting>(`/settings/${key}`);
    return response.data || null;
  },

  update: async (key: string, value: any): Promise<Setting> => {
    const response = await apiClient.patch<Setting>(`/settings/${key}`, { value });
    return response.data!;
  },
};
