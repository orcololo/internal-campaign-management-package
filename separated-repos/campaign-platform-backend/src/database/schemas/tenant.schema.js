"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenants = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
/**
 * Tenants table - Main table for multi-tenant architecture
 * Each tenant represents a campaign organization
 */
exports.tenants = (0, pg_core_1.pgTable)('tenants', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    slug: (0, pg_core_1.varchar)('slug', { length: 100 }).notNull().unique(),
    schemaName: (0, pg_core_1.varchar)('schema_name', { length: 100 }).notNull().unique(),
    isActive: (0, pg_core_1.boolean)('is_active').notNull().default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
    deletedAt: (0, pg_core_1.timestamp)('deleted_at'),
});
