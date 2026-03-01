-- Migration 002: Add missing tables for games, prizes, and theme support
-- Run this AFTER 001_initial_schema.sql

-- Add theme_color column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS theme_color VARCHAR(50) DEFAULT 'ocean';

-- Game sessions table (replaces game_scores for richer tracking)
CREATE TABLE IF NOT EXISTS game_sessions (
    id SERIAL PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    game_type VARCHAR(50) NOT NULL,
    duration_seconds INTEGER NOT NULL DEFAULT 60,
    score INTEGER NOT NULL DEFAULT 0,
    points_earned INTEGER NOT NULL DEFAULT 0,
    played_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_game_sessions_profile_id ON game_sessions(profile_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_played_at ON game_sessions(played_at);

-- Prizes table
CREATE TABLE IF NOT EXISTS prizes (
    id SERIAL PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    point_cost INTEGER NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prizes_profile_id ON prizes(profile_id);

-- Prize redemptions table
CREATE TABLE IF NOT EXISTS prize_redemptions (
    id SERIAL PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    prize_id INTEGER NOT NULL REFERENCES prizes(id) ON DELETE CASCADE,
    points_spent INTEGER NOT NULL,
    redeemed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prize_redemptions_profile_id ON prize_redemptions(profile_id);
