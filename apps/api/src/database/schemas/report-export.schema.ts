import {
  pgTable,
  uuid,
  varchar,
  text,
  jsonb,
  timestamp,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { savedReports } from './saved-report.schema';
import { users } from './user.schema';
import type { ReportFilter } from './saved-report.schema';

/**
 * Export Format Enum
 */
export const exportFormatEnum = pgEnum('export_format', ['pdf', 'csv', 'excel']);

/**
 * Export Status Enum
 */
export const exportStatusEnum = pgEnum('export_status', [
  'pending',
  'processing',
  'completed',
  'failed',
]);

/**
 * Report Exports Table
 *
 * Tracks history of report exports for:
 * - Download management
 * - Audit trail
 * - Auto-cleanup of old files
 * - Performance monitoring
 */
export const reportExports = pgTable('report_exports', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Report Reference
  savedReportId: uuid('saved_report_id').references(() => savedReports.id, {
    onDelete: 'set null',
  }),
  reportName: varchar('report_name', { length: 255 }),

  // Export Details
  format: varchar('format', { length: 10 }).notNull(), // 'pdf' | 'csv' | 'excel'
  recordCount: integer('record_count').notNull(),
  fileSize: integer('file_size'), // bytes
  filePath: text('file_path'), // S3 path or local path

  // Filters Applied (snapshot for audit)
  appliedFilters: jsonb('applied_filters').$type<ReportFilter[]>(),

  // Processing Status
  status: varchar('status', { length: 20 })
    .notNull()
    .default('pending'), // 'pending' | 'processing' | 'completed' | 'failed'
  processingTime: integer('processing_time'), // milliseconds
  errorMessage: text('error_message'),

  // User
  exportedBy: uuid('exported_by')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  exportedAt: timestamp('exported_at').defaultNow().notNull(),

  // Expiration (auto-delete after X days)
  expiresAt: timestamp('expires_at'),
  deletedAt: timestamp('deleted_at'),
});

// Type exports
export type ReportExport = typeof reportExports.$inferSelect;
export type NewReportExport = typeof reportExports.$inferInsert;

/**
 * Export status union type
 */
export type ExportStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * Export format union type
 */
export type ExportFormat = 'pdf' | 'csv' | 'excel';

/**
 * Export job data interface (for queue processing)
 */
export interface ExportJobData {
  reportId: string;
  userId: string;
  format: ExportFormat;
  recordCount: number;
  filters: ReportFilter[];
}
