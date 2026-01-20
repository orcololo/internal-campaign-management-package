import { Injectable } from '@nestjs/common';
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { auditLogs, AuditAction, AuditEntity, NewAuditLog } from '../database/schemas';
import { QueryAuditLogsDto } from './dto/query-audit-logs.dto';

export interface AuditLogInput {
    userId?: string;
    action: AuditAction;
    entityType: AuditEntity;
    entityId?: string;
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
}

@Injectable()
export class AuditService {
    constructor(private readonly databaseService: DatabaseService) { }

    /**
     * Create an audit log entry
     */
    async log(input: AuditLogInput): Promise<void> {
        const db = this.databaseService.getDb();

        await db.insert(auditLogs).values({
            userId: input.userId,
            action: input.action,
            entityType: input.entityType,
            entityId: input.entityId,
            oldValues: input.oldValues,
            newValues: input.newValues,
            ipAddress: input.ipAddress,
            userAgent: input.userAgent,
        });
    }

    /**
     * Find audit logs with filtering and pagination
     */
    async findAll(query: QueryAuditLogsDto) {
        const db = this.databaseService.getDb();
        const { userId, entityType, entityId, action, fromDate, toDate, page = 1, limit = 50 } = query;
        const offset = (page - 1) * limit;

        // Build conditions
        const conditions: any[] = [];

        if (userId) {
            conditions.push(eq(auditLogs.userId, userId));
        }
        if (entityType) {
            conditions.push(eq(auditLogs.entityType, entityType as AuditEntity));
        }
        if (entityId) {
            conditions.push(eq(auditLogs.entityId, entityId));
        }
        if (action) {
            conditions.push(eq(auditLogs.action, action as AuditAction));
        }
        if (fromDate) {
            conditions.push(gte(auditLogs.createdAt, new Date(fromDate)));
        }
        if (toDate) {
            conditions.push(lte(auditLogs.createdAt, new Date(toDate)));
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        // Get total count
        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(auditLogs)
            .where(whereClause);

        const total = Number(countResult[0]?.count || 0);

        // Get logs
        const logs = await db
            .select()
            .from(auditLogs)
            .where(whereClause)
            .orderBy(desc(auditLogs.createdAt))
            .limit(limit)
            .offset(offset);

        return {
            data: logs,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get audit logs for a specific entity
     */
    async findByEntity(entityType: AuditEntity, entityId: string) {
        const db = this.databaseService.getDb();

        return db
            .select()
            .from(auditLogs)
            .where(and(eq(auditLogs.entityType, entityType), eq(auditLogs.entityId, entityId)))
            .orderBy(desc(auditLogs.createdAt));
    }

    /**
     * Get audit logs for a specific user
     */
    async findByUser(userId: string, limit = 100) {
        const db = this.databaseService.getDb();

        return db
            .select()
            .from(auditLogs)
            .where(eq(auditLogs.userId, userId))
            .orderBy(desc(auditLogs.createdAt))
            .limit(limit);
    }

    /**
     * Export audit logs to CSV format
     */
    async exportToCsv(query: QueryAuditLogsDto): Promise<string> {
        // Get all matching logs (no pagination for export)
        const result = await this.findAll({ ...query, limit: 10000, page: 1 });
        const logs = result.data;

        if (logs.length === 0) {
            return 'No data';
        }

        const headers = ['ID', 'User ID', 'Action', 'Entity Type', 'Entity ID', 'Created At', 'IP Address'];
        const rows = logs.map((log) => [
            log.id,
            log.userId || '',
            log.action,
            log.entityType,
            log.entityId || '',
            log.createdAt?.toISOString() || '',
            log.ipAddress || '',
        ]);

        const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
        return csvContent;
    }
}
