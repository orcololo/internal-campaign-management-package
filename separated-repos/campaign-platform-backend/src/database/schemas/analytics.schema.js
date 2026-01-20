"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reports = exports.dashboards = exports.metrics = exports.dashboardTypeEnum = exports.metricTypeEnum = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
/**
 * Enums for analytics
 */
exports.metricTypeEnum = (0, pg_core_1.pgEnum)('metric_type', [
    'VOTER_COUNT',
    'EVENT_COUNT',
    'CANVASSING_RESULT',
    'SUPPORT_LEVEL',
    'DEMOGRAPHIC',
    'GEOGRAPHIC',
    'ENGAGEMENT',
    'CUSTOM',
]);
exports.dashboardTypeEnum = (0, pg_core_1.pgEnum)('dashboard_type', [
    'OVERVIEW',
    'VOTERS',
    'EVENTS',
    'CANVASSING',
    'FINANCIAL',
    'CUSTOM',
]);
/**
 * Metrics table - Stores calculated metrics and KPIs
 */
exports.metrics = (0, pg_core_1.pgTable)('metrics', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    // Metric Information
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    type: (0, exports.metricTypeEnum)('type').notNull(),
    category: (0, pg_core_1.varchar)('category', { length: 100 }),
    description: (0, pg_core_1.text)('description'),
    // Metric Value
    value: (0, pg_core_1.numeric)('value', { precision: 15, scale: 2 }),
    stringValue: (0, pg_core_1.text)('string_value'),
    jsonValue: (0, pg_core_1.jsonb)('json_value'),
    // Time Period
    periodStart: (0, pg_core_1.date)('period_start'),
    periodEnd: (0, pg_core_1.date)('period_end'),
    calculatedAt: (0, pg_core_1.timestamp)('calculated_at').notNull().defaultNow(),
    // Metadata
    tags: (0, pg_core_1.jsonb)('tags'), // Array of tags
    metadata: (0, pg_core_1.jsonb)('metadata'), // Additional data
    // Audit fields
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
    deletedAt: (0, pg_core_1.timestamp)('deleted_at'),
});
/**
 * Dashboards table - Custom dashboard configurations
 */
exports.dashboards = (0, pg_core_1.pgTable)('dashboards', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    // Dashboard Information
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    type: (0, exports.dashboardTypeEnum)('type').notNull().default('CUSTOM'),
    description: (0, pg_core_1.text)('description'),
    // Configuration
    layout: (0, pg_core_1.jsonb)('layout'), // Dashboard layout configuration
    widgets: (0, pg_core_1.jsonb)('widgets'), // Array of widget configurations
    filters: (0, pg_core_1.jsonb)('filters'), // Default filters
    // Access Control
    isPublic: (0, pg_core_1.integer)('is_public').default(0), // 0 = private, 1 = public
    allowedRoles: (0, pg_core_1.jsonb)('allowed_roles'), // Array of roles that can access
    // Metadata
    createdBy: (0, pg_core_1.varchar)('created_by', { length: 255 }),
    tags: (0, pg_core_1.jsonb)('tags'),
    // Audit fields
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
    deletedAt: (0, pg_core_1.timestamp)('deleted_at'),
});
/**
 * Reports table - Saved reports and exports
 */
exports.reports = (0, pg_core_1.pgTable)('reports', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    // Report Information
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    type: (0, pg_core_1.varchar)('type', { length: 50 }), // e.g., 'PDF', 'CSV', 'EXCEL'
    // Report Data
    data: (0, pg_core_1.jsonb)('data'), // Report content/data
    filters: (0, pg_core_1.jsonb)('filters'), // Filters used to generate the report
    generatedAt: (0, pg_core_1.timestamp)('generated_at').notNull().defaultNow(),
    // File Information (if exported)
    fileUrl: (0, pg_core_1.text)('file_url'),
    fileSize: (0, pg_core_1.integer)('file_size'),
    // Metadata
    generatedBy: (0, pg_core_1.varchar)('generated_by', { length: 255 }),
    tags: (0, pg_core_1.jsonb)('tags'),
    // Audit fields
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
    deletedAt: (0, pg_core_1.timestamp)('deleted_at'),
});
