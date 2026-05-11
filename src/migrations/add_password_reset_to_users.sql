-- Add password reset columns to users table
-- Run this SQL in your Railway MySQL database

-- Add reset_token_hash column (stores hashed token)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS reset_token_hash VARCHAR(255) NULL AFTER password;

-- Add reset_token_expiry column (stores expiration time)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS reset_token_expiry DATETIME NULL AFTER reset_token_hash;

-- Add index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_reset_token_hash ON users(reset_token_hash);

-- Verify columns were added
DESCRIBE users;
