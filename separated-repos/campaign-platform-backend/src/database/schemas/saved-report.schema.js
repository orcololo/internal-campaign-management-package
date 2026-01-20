"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savedReports = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var user_schema_1 = require("./user.schema");
/**
 * Saved Reports Table
 *
 * Stores user-defined report configurations including:
 * - Filters (complex queries with operators)
 * - Sorting (multi-level sorting)
 * - Column selection
 * - Sharing settings
 * - Usage statistics
 */
exports.savedReports = (0, pg_core_1.pgTable)('saved_reports', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    // Report Configuration (stored as JSON)
    filters: (0, pg_core_1.jsonb)('filters').notNull().$type().default([]),
    sorting: (0, pg_core_1.jsonb)('sorting').notNull().$type().default([]),
    columns: (0, pg_core_1.jsonb)('columns').notNull().$type().default([]),
    // Settings
    includeCharts: (0, pg_core_1.boolean)('include_charts').default(false),
    groupBy: (0, pg_core_1.varchar)('group_by', { length: 100 }),
    // Ownership & Sharing
    createdBy: (0, pg_core_1.uuid)('created_by').references(function () { return user_schema_1.users.id; }, { onDelete: 'cascade' }), // Made nullable for mock auth
    isPublic: (0, pg_core_1.boolean)('is_public').default(false),
    sharedWith: (0, pg_core_1.jsonb)('shared_with').$type().default([]),
    // Usage Statistics
    usageCount: (0, pg_core_1.integer)('usage_count').default(0),
    lastUsedAt: (0, pg_core_1.timestamp)('last_used_at'),
    // Audit
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
    deletedAt: (0, pg_core_1.timestamp)('deleted_at'),
});
