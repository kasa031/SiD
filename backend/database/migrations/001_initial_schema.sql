-- Create database (run this manually if needed)
-- CREATE DATABASE polls_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    profile_picture_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Polls table
CREATE TABLE IF NOT EXISTS polls (
    id SERIAL PRIMARY KEY,
    creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location_type VARCHAR(20) NOT NULL CHECK (location_type IN ('by', 'land')),
    location_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ends_at TIMESTAMP
);

-- Poll options table
CREATE TABLE IF NOT EXISTS poll_options (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
    option_text VARCHAR(255) NOT NULL,
    votes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    option_id INTEGER REFERENCES poll_options(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(poll_id, user_id) -- Ensures one vote per user per poll
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Politician tags table
CREATE TABLE IF NOT EXISTS politician_tags (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
    politician_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_polls_creator ON polls(creator_id);
CREATE INDEX IF NOT EXISTS idx_polls_location ON polls(location_type, location_name);
CREATE INDEX IF NOT EXISTS idx_votes_user_poll ON votes(user_id, poll_id);
CREATE INDEX IF NOT EXISTS idx_comments_poll ON comments(poll_id);
CREATE INDEX IF NOT EXISTS idx_politician_tags_name ON politician_tags(politician_name);
CREATE INDEX IF NOT EXISTS idx_politician_tags_poll ON politician_tags(poll_id);

