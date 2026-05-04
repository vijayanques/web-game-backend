-- Remove price column from games table

USE game_app_db;

-- Drop price column
ALTER TABLE games DROP COLUMN IF EXISTS price;

-- Verify the column was removed
DESCRIBE games;
