-- Make created_by nullable for development (mock auth doesn't have users table)
ALTER TABLE saved_reports ALTER COLUMN created_by DROP NOT NULL;
ALTER TABLE report_exports ALTER COLUMN exported_by DROP NOT NULL;
