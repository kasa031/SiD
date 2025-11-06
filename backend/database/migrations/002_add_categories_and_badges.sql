-- Add category to polls
ALTER TABLE polls ADD COLUMN IF NOT EXISTS category VARCHAR(50);

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_url VARCHAR(500),
    requirement_type VARCHAR(50) NOT NULL, -- 'votes', 'polls_created', 'comments', etc.
    requirement_value INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    badge_id INTEGER REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
);

-- Create user_stats table for tracking
CREATE TABLE IF NOT EXISTS user_stats (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_votes INTEGER DEFAULT 0,
    total_polls_created INTEGER DEFAULT 0,
    total_comments INTEGER DEFAULT 0,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_polls_category ON polls(category);
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge ON user_badges(badge_id);

-- Insert default badges
INSERT INTO badges (name, description, requirement_type, requirement_value) VALUES
    ('Første stemme', 'Har avlagt din første stemme', 'votes', 1),
    ('Aktiv deltaker', 'Har stemt 10 ganger', 'votes', 10),
    ('Engasjert borger', 'Har stemt 50 ganger', 'votes', 50),
    ('Demokratisk helt', 'Har stemt 100 ganger', 'votes', 100),
    ('Poll-skaper', 'Har opprettet din første poll', 'polls_created', 1),
    ('Aktiv skaper', 'Har opprettet 5 polls', 'polls_created', 5),
    ('Meningenees stemme', 'Har opprettet 20 polls', 'polls_created', 20),
    ('Kommentator', 'Har lagt til 10 kommentarer', 'comments', 10),
    ('Samfunnsdebattant', 'Har lagt til 50 kommentarer', 'comments', 50)
ON CONFLICT (name) DO NOTHING;
