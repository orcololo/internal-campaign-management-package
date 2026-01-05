import { pgTable, uuid, varchar, timestamp, text, integer, numeric, date, pgEnum, jsonb } from 'drizzle-orm/pg-core';

/**
 * Enums for analytics
 */
export const metricTypeEnum = pgEnum('metric_type', [
  'VOTER_COUNT',
  'EVENT_COUNT',
  'CANVASSING_RESULT',
  'SUPPORT_LEVEL',
  'DEMOGRAPHIC',
  'GEOGRAPHIC',
  'ENGAGEMENT',
  'CUSTOM',
]);

export const dashboardTypeEnum = pgEnum('dashboard_type', [
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
export const metrics = pgTable('metrics', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Metric Information
  name: varchar('name', { length: 255 }).notNull(),
  type: metricTypeEnum('type').notNull(),
  category: varchar('category', { length: 100 }),
  description: text('description'),

  // Metric Value
  value: numeric('value', { precision: 15, scale: 2 }),
  stringValue: text('string_value'),
  jsonValue: jsonb('json_value'),

  // Time Period
  periodStart: date('period_start'),
  periodEnd: date('period_end'),
  calculatedAt: timestamp('calculated_at').notNull().defaultNow(),

  // Metadata
  tags: jsonb('tags'), // Array of tags
  metadata: jsonb('metadata'), // Additional data

  // Audit fields
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

/**
 * Dashboards table - Custom dashboard configurations
 */
export const dashboards = pgTable('dashboards', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Dashboard Information
  name: varchar('name', { length: 255 }).notNull(),
  type: dashboardTypeEnum('type').notNull().default('CUSTOM'),
  description: text('description'),

  // Configuration
  layout: jsonb('layout'), // Dashboard layout configuration
  widgets: jsonb('widgets'), // Array of widget configurations
  filters: jsonb('filters'), // Default filters

  // Access Control
  isPublic: integer('is_public').default(0), // 0 = private, 1 = public
  allowedRoles: jsonb('allowed_roles'), // Array of roles that can access

  // Metadata
  createdBy: varchar('created_by', { length: 255 }),
  tags: jsonb('tags'),

  // Audit fields
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

/**
 * Reports table - Saved reports and exports
 */
export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Report Information
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 50 }), // e.g., 'PDF', 'CSV', 'EXCEL'

  // Report Data
  data: jsonb('data'), // Report content/data
  filters: jsonb('filters'), // Filters used to generate the report
  generatedAt: timestamp('generated_at').notNull().defaultNow(),

  // File Information (if exported)
  fileUrl: text('file_url'),
  fileSize: integer('file_size'),

  // Metadata
  generatedBy: varchar('generated_by', { length: 255 }),
  tags: jsonb('tags'),

  // Audit fields
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export type Metric = typeof metrics.$inferSelect;
export type NewMetric = typeof metrics.$inferInsert;
export type Dashboard = typeof dashboards.$inferSelect;
export type NewDashboard = typeof dashboards.$inferInsert;
export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;
export type MetricType = typeof metricTypeEnum.enumValues[number];
export type DashboardType = typeof dashboardTypeEnum.enumValues[number];
