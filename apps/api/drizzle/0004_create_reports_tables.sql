-- Migration: Create reports tables
-- Author: AI Implementation
-- Date: 2026-01-12
-- Description: Tables for saved reports and report exports tracking

-- Saved Reports Table
-- Stores user-defined report configurations with filters, sorting, and columns
CREATE TABLE IF NOT EXISTS saved_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Report Configuration (stored as JSON)
  filters JSONB NOT NULL DEFAULT '[]'::jsonb,
  sorting JSONB NOT NULL DEFAULT '[]'::jsonb,
  columns JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Settings
  include_charts BOOLEAN DEFAULT false,
  group_by VARCHAR(100),
  
  -- Ownership & Sharing
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT false,
  shared_with JSONB DEFAULT '[]'::jsonb, -- array of user IDs
  
  -- Usage Statistics
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP,
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMP
);

-- Report Exports Table
-- Tracks history of report exports for download, audit, and cleanup
CREATE TABLE IF NOT EXISTS report_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Report Reference
  saved_report_id UUID REFERENCES saved_reports(id) ON DELETE SET NULL,
  report_name VARCHAR(255),
  
  -- Export Details
  format VARCHAR(10) NOT NULL CHECK (format IN ('pdf', 'csv', 'excel')),
  record_count INTEGER NOT NULL,
  file_size INTEGER, -- bytes
  file_path TEXT, -- S3 path or local path
  
  -- Filters Applied (snapshot for audit)
  applied_filters JSONB,
  
  -- Processing Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  processing_time INTEGER, -- milliseconds
  error_message TEXT,
  
  -- User
  exported_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exported_at TIMESTAMP DEFAULT NOW() NOT NULL,
  
  -- Expiration (auto-delete after X days)
  expires_at TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Indexes for saved_reports
CREATE INDEX IF NOT EXISTS idx_saved_reports_created_by ON saved_reports(created_by);
CREATE INDEX IF NOT EXISTS idx_saved_reports_is_public ON saved_reports(is_public);
CREATE INDEX IF NOT EXISTS idx_saved_reports_usage_count ON saved_reports(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_saved_reports_created_at ON saved_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_reports_deleted_at ON saved_reports(deleted_at);

-- Indexes for report_exports
CREATE INDEX IF NOT EXISTS idx_report_exports_user ON report_exports(exported_by, exported_at DESC);
CREATE INDEX IF NOT EXISTS idx_report_exports_status ON report_exports(status);
CREATE INDEX IF NOT EXISTS idx_report_exports_expires ON report_exports(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_report_exports_saved_report ON report_exports(saved_report_id);
CREATE INDEX IF NOT EXISTS idx_report_exports_deleted_at ON report_exports(deleted_at);

-- Comments for documentation
COMMENT ON TABLE saved_reports IS 'User-defined report configurations with filters, sorting, and column selection';
COMMENT ON TABLE report_exports IS 'History of report exports for tracking and cleanup';

COMMENT ON COLUMN saved_reports.filters IS 'Array of filter objects: [{field, operator, value, logicalOperator}]';
COMMENT ON COLUMN saved_reports.sorting IS 'Array of sort objects: [{field, direction}]';
COMMENT ON COLUMN saved_reports.columns IS 'Array of column names to include in report';
COMMENT ON COLUMN saved_reports.shared_with IS 'Array of user UUIDs who have access to this report';
COMMENT ON COLUMN saved_reports.usage_count IS 'Number of times this report has been generated';

COMMENT ON COLUMN report_exports.applied_filters IS 'Snapshot of filters applied at export time for audit trail';
COMMENT ON COLUMN report_exports.expires_at IS 'When to auto-delete this export file';
COMMENT ON COLUMN report_exports.processing_time IS 'Time taken to generate export in milliseconds';
