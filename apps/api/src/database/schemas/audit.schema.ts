import { pgTable, uuid, varchar, text, timestamp, jsonb, index, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './user.schema';

/**
 * Audit action types
 */
export const auditActionEnum = pgEnum('audit_action', [
    'create',
    'update',
    'delete',
    'export',
    'login',
    'logout',
    'bulk_delete',
    'bulk_update',
    'import',
]);

/**
 * Entity types for audit tracking
 */
export const auditEntityEnum = pgEnum('audit_entity', [
    'voter',
    'user',
    'event',
    'geofence',
    'report',
    'campaign',
    'template',
    'notification',
]);

/**
 * Audit Logs table
 * Tracks all data modifications for compliance and debugging
 */
export const auditLogs = pgTable('audit_logs', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id),
    action: auditActionEnum('action').notNull(),
    entityType: auditEntityEnum('entity_type').notNull(),
    entityId: uuid('entity_id'),
    oldValues: jsonb('old_values'),
    newValues: jsonb('new_values'),
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
    entityIdx: index('idx_audit_entity').on(table.entityType, table.entityId),
    userIdx: index('idx_audit_user').on(table.userId, table.createdAt),
    dateIdx: index('idx_audit_date').on(table.createdAt),
}));

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
export type AuditAction = (typeof auditActionEnum.enumValues)[number];
export type AuditEntity = (typeof auditEntityEnum.enumValues)[number];
