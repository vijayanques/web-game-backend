// Run migration to add page support to SEO metadata
require('dotenv').config();
const sequelize = require('../config/database');

async function runMigration() {
  try {
    console.log('🔄 Running migration: Add page support to SEO metadata...');

    // For MySQL: Modify ENUM to add 'page' value
    await sequelize.query(`
      ALTER TABLE seo_metadata 
      MODIFY COLUMN entityType ENUM('game', 'category', 'page') NOT NULL;
    `);

    console.log('✅ Added "page" to entityType enum');

    // Add pageName column if not exists
    try {
      await sequelize.query(`
        ALTER TABLE seo_metadata 
        ADD COLUMN pageName VARCHAR(255) NULL 
        COMMENT 'Page name (for page entityType)';
      `);
      console.log('✅ Added pageName column');
    } catch (error) {
      if (error.message.includes('Duplicate column')) {
        console.log('ℹ️  pageName column already exists');
      } else {
        throw error;
      }
    }

    // Add pageSlug column if not exists
    try {
      await sequelize.query(`
        ALTER TABLE seo_metadata 
        ADD COLUMN pageSlug VARCHAR(255) NULL 
        COMMENT 'Page slug/URL (for page entityType)';
      `);
      console.log('✅ Added pageSlug column');
    } catch (error) {
      if (error.message.includes('Duplicate column')) {
        console.log('ℹ️  pageSlug column already exists');
      } else {
        throw error;
      }
    }

    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
