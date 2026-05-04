-- Simple Database Fix
-- Copy and paste these commands one by one in MySQL Workbench

USE game_app_db;

-- 1. Add slug column
ALTER TABLE games ADD COLUMN slug VARCHAR(255) NULL AFTER title;

-- 2. Add gameUrl column  
ALTER TABLE games ADD COLUMN gameUrl VARCHAR(500) NULL AFTER thumbnail;

-- 3. Remove price column
ALTER TABLE games DROP COLUMN price;

-- 4. Generate slugs for existing games
UPDATE games SET slug = LOWER(REPLACE(REPLACE(REPLACE(REPLACE(title, ' ', '-'), '.', ''), ',', ''), '!', '')) WHERE slug IS NULL;

-- 5. Make slug NOT NULL
ALTER TABLE games MODIFY COLUMN slug VARCHAR(255) NOT NULL;

-- 6. Add unique index
ALTER TABLE games ADD UNIQUE INDEX idx_slug (slug);

-- 7. Check the result
SELECT id, title, slug FROM games;
