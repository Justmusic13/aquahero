-- Add theme_color to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS theme_color VARCHAR(20) DEFAULT 'ocean';

-- Prizes table
CREATE TABLE IF NOT EXISTS prizes (
    id SERIAL PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    point_cost INTEGER NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prize redemptions
CREATE TABLE IF NOT EXISTS prize_redemptions (
    id SERIAL PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    prize_id INTEGER NOT NULL REFERENCES prizes(id) ON DELETE CASCADE,
    points_spent INTEGER NOT NULL,
    redeemed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game sessions for tracking daily 15-min limit
CREATE TABLE IF NOT EXISTS game_sessions (
    id SERIAL PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    game_type VARCHAR(50) NOT NULL,
    duration_seconds INTEGER NOT NULL,
    score INTEGER DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    played_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add game_type to existing game_scores if not present
DO $$ BEGIN
    ALTER TABLE game_scores ADD COLUMN game_type VARCHAR(50) DEFAULT 'legacy';
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_prizes_profile_id ON prizes(profile_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_profile_id ON game_sessions(profile_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_played_at ON game_sessions(played_at);
CREATE INDEX IF NOT EXISTS idx_prize_redemptions_profile_id ON prize_redemptions(profile_id);
