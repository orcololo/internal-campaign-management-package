import { realApiClient } from "./real-client";
import type { ApiResponse } from "@/types/api";

/**
 * Audit log entry from API
 */
export interface AuditLog {
    id: string;
    userId: string | null;
    action: AuditAction;
    entityType: AuditEntity;
    entityId: string | null;
    oldValues: Record<string, any> | null;
    newValues: Record<string, any> | null;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: string;
}

export type AuditAction =
    | "create"
    | "update"
    | "delete"
    | "export"
    | "login"
    | "logout"
    | "bulk_delete"
    | "bulk_update"
    | "import";

export type AuditEntity =
    | "voter"
    | "user"
    | "event"
    | "geofence"
    | "report"
    | "campaign"
    | "template"
    | "notification";

export interface AuditFilters {
    userId?: string;
    entityType?: AuditEntity;
    entityId?: string;
    action?: AuditAction;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
}

export interface AuditPaginatedResponse {
    data: AuditLog[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

/**
 * Audit API Client
 */
export const auditApi = {
    /**
     * List audit logs with filters
     */
    async list(filters?: AuditFilters): Promise<ApiResponse<AuditPaginatedResponse>> {
        const params: Record<string, any> = {};

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params[key] = value;
                }
            });
        }

        return realApiClient.get<AuditPaginatedResponse>("/audit", { params });
    },

    /**
     * Get audit logs for a specific entity
     */
    async getByEntity(entityType: AuditEntity, entityId: string): Promise<ApiResponse<AuditLog[]>> {
        return realApiClient.get<AuditLog[]>(`/audit/entity/${entityType}/${entityId}`);
    },

    /**
     * Get audit logs for a specific user
     */
    async getByUser(userId: string): Promise<ApiResponse<AuditLog[]>> {
        return realApiClient.get<AuditLog[]>(`/audit/user/${userId}`);
    },

    /**
     * Export audit logs to CSV
     */
    async exportCsv(filters?: AuditFilters): Promise<void> {
        const params = new URLSearchParams();

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, String(value));
                }
            });
        }

        const queryString = params.toString();
        const endpoint = `/audit/export${queryString ? `?${queryString}` : ""}`;

        await realApiClient.downloadFile(endpoint, `audit-logs-${Date.now()}.csv`);
    },
};
