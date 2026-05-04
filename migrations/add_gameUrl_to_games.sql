-- Add gameUrl column to games table
ALTER TABLE games ADD COLUMN IF NOT EXISTS gameUrl VARCHAR(500);
