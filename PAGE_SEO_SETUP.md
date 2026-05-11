# Page SEO Setup Instructions

## Problem
When creating Page SEO metadata, getting 404 error because backend doesn't support 'page' entityType.

## Solution
Updated backend to support 'page' entityType for static pages (landing, privacy policy, login, etc.)

## Changes Made

### 1. Model Updated (`src/models/SeoMetadata.js`)
- Added `'page'` to entityType enum
- Added `pageName` field (VARCHAR 255)
- Added `pageSlug` field (VARCHAR 255)

### 2. Controller Updated (`src/controllers/seoController.js`)
- Skip entity validation for 'page' type (pages don't have a model)
- Handle `pageName` and `pageSlug` in create/update operations

### 3. Migration Created
- Script: `src/scripts/runMigration.js`
- Adds 'page' to enum
- Adds pageName and pageSlug columns

## How to Deploy

### Step 1: Commit and Push Backend Changes
```bash
cd D:\vijay\game_web_backend
git add .
git commit -m "Add page entityType support to SEO metadata"
git push
```

### Step 2: Run Migration on Railway
After deployment, run this command in Railway console or via SSH:

```bash
npm run migrate
```

Or manually run these SQL commands in Railway MySQL:

```sql
-- Add 'page' to ENUM
ALTER TABLE seo_metadata 
MODIFY COLUMN entityType ENUM('game', 'category', 'page') NOT NULL;

-- Add columns
ALTER TABLE seo_metadata 
ADD COLUMN IF NOT EXISTS pageName VARCHAR(255) NULL 
COMMENT 'Page name (for page entityType)';

ALTER TABLE seo_metadata 
ADD COLUMN IF NOT EXISTS pageSlug VARCHAR(255) NULL 
COMMENT 'Page slug/URL (for page entityType)';
```

### Step 3: Verify
1. Go to admin panel: https://games-admin.vercel.app/pages
2. Click "Add Page"
3. Select a page (e.g., Privacy Policy)
4. Fill SEO metadata
5. Save - should work now!

## Testing

### Test API Endpoint
```bash
# Create page metadata
curl -X POST https://game-backend-production-3988.up.railway.app/api/seo/page/123456 \
  -H "Content-Type: application/json" \
  -d '{
    "pageName": "Privacy Policy",
    "pageSlug": "/privacy-policy",
    "metaTitle": "Privacy Policy - Theplayfree",
    "metaDescription": "Our privacy policy",
    "robots": "index, follow"
  }'

# Get all pages
curl https://game-backend-production-3988.up.railway.app/api/seo/type/page
```

## Troubleshooting

### If migration fails:
1. Check Railway logs
2. Verify database connection
3. Run SQL commands manually in Railway PostgreSQL console

### If still getting 404:
1. Verify backend is deployed
2. Check Railway environment variables
3. Restart Railway service

## Files Changed
- ✅ `src/models/SeoMetadata.js` - Added page support
- ✅ `src/controllers/seoController.js` - Handle page entityType
- ✅ `src/scripts/runMigration.js` - Migration script
- ✅ `package.json` - Added migrate command
