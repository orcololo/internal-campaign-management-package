import { realApiClient } from "./real-client";
import type { ApiResponse } from "@/types/api";

/**
 * Notification from API
 */
export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string | null;
    link: string | null;
    read: boolean;
    readAt: string | null;
    createdAt: string;
}

export type NotificationType =
    | "event_reminder"
    | "task_assigned"
    | "campaign_complete"
    | "campaign_started"
    | "message_response"
    | "import_complete"
    | "export_complete"
    | "system"
    | "error";

/**
 * Notifications API Client
 */
export const notificationsApi = {
    /**
     * List notifications
     */
    async list(limit = 50, includeRead = false): Promise<ApiResponse<Notification[]>> {
        return realApiClient.get<Notification[]>("/notifications", {
            params: { limit, includeRead },
        });
    },

    /**
     * Get unread count
     */
    async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
        return realApiClient.get<{ count: number }>("/notifications/unread");
    },

    /**
     * Mark as read
     */
    async markAsRead(id: string): Promise<ApiResponse<void>> {
        return realApiClient.put<void>(`/notifications/${id}/read`);
    },

    /**
     * Mark all as read
     */
    async markAllAsRead(): Promise<ApiResponse<void>> {
        return realApiClient.put<void>("/notifications/read-all");
    },

    /**
     * Delete notification
     */
    async delete(id: string): Promise<ApiResponse<void>> {
        return realApiClient.delete<void>(`/notifications/${id}`);
    },
};
