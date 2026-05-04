-- Fix Active Games
-- Run this SQL if your games are not showing in search

-- Check current status of games
SELECT 
  id,
  title,
  slug,
  isActive,
  categoryId
FROM games;

-- Make all games active
UPDATE games SET isActive = 1;

-- Verify the update
SELECT 
  id,
  title,
  slug,
  isActive,
  categoryId
FROM games;

-- Check games with categories
SELECT 
  g.id,
  g.title,
  g.slug,
  g.isActive,
  c.name as category_name
FROM games g
LEFT JOIN categories c ON g.categoryId = c.id;
