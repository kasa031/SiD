-- Admin support: Legg til admin-rolle og forbedre moderation

-- Legg til is_admin flag i users tabell
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Legg til status i poll_reports (pending, reviewed, resolved)
ALTER TABLE poll_reports ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved'));
ALTER TABLE poll_reports ADD COLUMN IF NOT EXISTS reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE poll_reports ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP;

-- Indexes for admin queries
CREATE INDEX IF NOT EXISTS idx_poll_reports_status ON poll_reports(status);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);
CREATE INDEX IF NOT EXISTS idx_polls_is_deleted ON polls(is_deleted);

-- Opprett en admin-bruker (kan gjøres manuelt eller via script)
-- UPDATE users SET is_admin = TRUE WHERE username = 'admin';

