-- =============================================================================
-- Migration V6: Add matched column to ai_triage_audit
-- This allows SQL-level counting of AI suggestion accuracy for reports.
-- =============================================================================

ALTER TABLE ai_triage_audit ADD COLUMN IF NOT EXISTS matched BOOLEAN;

-- Index for analytics performance
CREATE INDEX ix_ai_triage_audit_matched ON ai_triage_audit(matched);
