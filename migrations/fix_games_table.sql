-- Fix games table: Add gameUrl and remove price

USE game_app_db;

-- Add gameUrl column if not exists
ALTER TABLE games ADD COLUMN IF NOT EXISTS gameUrl VARCHAR(500) NULL;

-- Remove price column if exists
ALTER TABLE games DROP COLUMN IF EXISTS price;

-- Verify the changes
DESCRIBE games;

-- Check if any data exists
SELECT COUNT(*) as total_games FROM games;
