-- Update slugs for existing games
USE game_app_db;

-- Generate slugs from titles
UPDATE games 
SET slug = LOWER(
  REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(title, ' ', '-'),
            '.', ''
          ),
          ',', ''
        ),
        '!', ''
      ),
      '?', ''
    ),
    '--', '-'
  )
)
WHERE slug IS NULL OR slug = '';

-- Check the result
SELECT id, title, slug FROM games;
