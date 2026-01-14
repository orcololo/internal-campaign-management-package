"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportExports = exports.exportStatusEnum = exports.exportFormatEnum = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var saved_report_schema_1 = require("./saved-report.schema");
var user_schema_1 = require("./user.schema");
/**
 * Export Format Enum
 */
exports.exportFormatEnum = (0, pg_core_1.pgEnum)('export_format', ['pdf', 'csv', 'excel']);
/**
 * Export Status Enum
 */
exports.exportStatusEnum = (0, pg_core_1.pgEnum)('export_status', [
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
exports.reportExports = (0, pg_core_1.pgTable)('report_exports', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    // Report Reference
    savedReportId: (0, pg_core_1.uuid)('saved_report_id').references(function () { return saved_report_schema_1.savedReports.id; }, {
        onDelete: 'set null',
    }),
    reportName: (0, pg_core_1.varchar)('report_name', { length: 255 }),
    // Export Details
    format: (0, pg_core_1.varchar)('format', { length: 10 }).notNull(), // 'pdf' | 'csv' | 'excel'
    recordCount: (0, pg_core_1.integer)('record_count').notNull(),
    fileSize: (0, pg_core_1.integer)('file_size'), // bytes
    filePath: (0, pg_core_1.text)('file_path'), // S3 path or local path
    // Filters Applied (snapshot for audit)
    appliedFilters: (0, pg_core_1.jsonb)('applied_filters').$type(),
    // Processing Status
    status: (0, pg_core_1.varchar)('status', { length: 20 }).notNull().default('pending'), // 'pending' | 'processing' | 'completed' | 'failed'
    processingTime: (0, pg_core_1.integer)('processing_time'), // milliseconds
    errorMessage: (0, pg_core_1.text)('error_message'),
    // User
    exportedBy: (0, pg_core_1.uuid)('exported_by').references(function () { return user_schema_1.users.id; }, { onDelete: 'cascade' }), // Made nullable for mock auth
    exportedAt: (0, pg_core_1.timestamp)('exported_at').defaultNow().notNull(),
    // Expiration (auto-delete after X days)
    expiresAt: (0, pg_core_1.timestamp)('expires_at'),
    deletedAt: (0, pg_core_1.timestamp)('deleted_at'),
});
