-- Run this SQL query in your MySQL database (phpMyAdmin, MySQL Workbench, or command line)

USE game_app_db;

-- Add gameUrl column to games table
ALTER TABLE games ADD COLUMN gameUrl VARCHAR(500) NULL AFTER thumbnail;

-- Verify the column was added
DESCRIBE games;
