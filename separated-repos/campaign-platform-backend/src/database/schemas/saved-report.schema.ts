import {
  pgTable,
  uuid,
  varchar,
  text,
  jsonb,
  boolean,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';
import { users } from './user.schema';

/**
 * Report Filter Interface (TypeScript representation)
 */
export interface ReportFilter {
  id: string;
  field: string;
  operator: string;
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

/**
 * Report Sort Interface (TypeScript representation)
 */
export interface ReportSort {
  field: string;
  direction: 'asc' | 'desc';
}

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
export const savedReports = pgTable('saved_reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),

  // Report Configuration (stored as JSON)
  filters: jsonb('filters').notNull().$type<ReportFilter[]>().default([]),
  sorting: jsonb('sorting').notNull().$type<ReportSort[]>().default([]),
  columns: jsonb('columns').notNull().$type<string[]>().default([]),

  // Settings
  includeCharts: boolean('include_charts').default(false),
  groupBy: varchar('group_by', { length: 100 }),

  // Ownership & Sharing
  createdBy: uuid('created_by').references(() => users.id, { onDelete: 'cascade' }), // Made nullable for mock auth
  isPublic: boolean('is_public').default(false),
  sharedWith: jsonb('shared_with').$type<string[]>().default([]),

  // Usage Statistics
  usageCount: integer('usage_count').default(0),
  lastUsedAt: timestamp('last_used_at'),

  // Audit
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

// Type exports
export type SavedReport = typeof savedReports.$inferSelect;
export type NewSavedReport = typeof savedReports.$inferInsert;

/**
 * Type-safe report configuration interface
 */
export interface ReportConfig {
  name: string;
  description?: string;
  filters: ReportFilter[];
  sorting: ReportSort[];
  columns: string[];
  includeCharts?: boolean;
  groupBy?: string;
}
