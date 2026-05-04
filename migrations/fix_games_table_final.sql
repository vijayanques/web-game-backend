-- Fix games table: Remove price column and add gameUrl column
-- Run this manually in your MySQL database

USE game_app_db;

-- Add gameUrl column if it doesn't exist
ALTER TABLE games 
ADD COLUMN IF NOT EXISTS gameUrl VARCHAR(500) NULL AFTER thumbnail;

-- Remove price column if it exists
ALTER TABLE games 
DROP COLUMN IF EXISTS price;

-- Verify the changes
DESCRIBE games;
