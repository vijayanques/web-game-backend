-- SEO Metadata BIGINT Fix
-- This SQL script changes the entityId column from INT to BIGINT
-- Run this on your production database

-- Step 1: Check current column type (for verification)
-- DESCRIBE seo_metadata;

-- Step 2: Modify the column
ALTER TABLE seo_metadata MODIFY COLUMN entityId BIGINT NOT NULL;

-- Step 3: Verify the change
-- DESCRIBE seo_metadata;
-- The entityId column should now show 'bigint' as the type

-- Step 4: Verify the unique index still exists
-- SHOW INDEXES FROM seo_metadata;
-- Should show 'unique_entity' index on (entityType, entityId)
