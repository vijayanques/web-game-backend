-- =====================================================
-- IMPORTANT: Run this SQL in MySQL to fix the database
-- =====================================================

USE game_app_db;

-- Step 1: Add gameUrl column if it doesn't exist
ALTER TABLE games 
ADD COLUMN IF NOT EXISTS gameUrl VARCHAR(500) NULL AFTER thumbnail;

-- Step 2: Remove price column if it exists
ALTER TABLE games 
DROP COLUMN IF EXISTS price;

-- Step 3: Verify the changes
DESCRIBE games;

-- You should see:
-- - gameUrl column present
-- - NO price column

-- =====================================================
-- After running this, restart your backend server:
-- cd game_web_backend
-- npm start
-- =====================================================
