-- =====================================================
-- FINAL DATABASE FIX - Run this in MySQL
-- =====================================================

USE game_app_db;

-- Step 1: Add gameUrl column if it doesn't exist
ALTER TABLE games 
ADD COLUMN IF NOT EXISTS gameUrl VARCHAR(500) NULL AFTER thumbnail;

-- Step 2: Add slug column if it doesn't exist
ALTER TABLE games 
ADD COLUMN IF NOT EXISTS slug VARCHAR(255) NULL AFTER title;

-- Step 3: Remove price column if it exists
ALTER TABLE games 
DROP COLUMN IF EXISTS price;

-- Step 4: Generate slugs for existing games (if any)
UPDATE games 
SET slug = LOWER(REPLACE(REPLACE(REPLACE(title, ' ', '-'), '.', ''), ',', ''))
WHERE slug IS NULL OR slug = '';

-- Step 5: Make slug unique and not null
ALTER TABLE games 
MODIFY COLUMN slug VARCHAR(255) NOT NULL;

-- Step 6: Add unique index on slug
ALTER TABLE games 
ADD UNIQUE INDEX idx_slug (slug);

-- Step 7: Verify the changes
DESCRIBE games;

-- You should see:
-- - slug column (VARCHAR(255), NOT NULL, UNIQUE)
-- - gameUrl column (VARCHAR(500), NULL)
-- - NO price column

-- =====================================================
-- After running this, restart your backend server:
-- cd game_web_backend
-- npm start
-- =====================================================
