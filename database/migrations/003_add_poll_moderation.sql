-- Poll moderation: Rapportering og sletting

-- Poll reports table
CREATE TABLE IF NOT EXISTS poll_reports (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    reason VARCHAR(100) NOT NULL, -- 'spam', 'inappropriate', 'offensive', 'other'
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(poll_id, user_id) -- En bruker kan kun rapportere en poll én gang
);

-- Add is_deleted flag to polls table (soft delete)
ALTER TABLE polls ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE polls ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE polls ADD COLUMN IF NOT EXISTS deleted_by INTEGER REFERENCES users(id) ON DELETE SET NULL;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_poll_reports_poll ON poll_reports(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_reports_user ON poll_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_polls_is_deleted ON polls(is_deleted);

-- Update existing polls query to exclude deleted polls
-- (This will be handled in application code)

