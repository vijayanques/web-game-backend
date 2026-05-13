// Migration Runner for entityId BIGINT change
// Run this file to execute the migration

require('dotenv').config();
const sequelize = require('../config/database');
const migration = require('./20260511-change-entityid-to-bigint');

async function runMigration() {
  try {
    console.log('🚀 Starting migration: Change entityId to BIGINT...');
    
    // Run the migration
    await migration.up(sequelize.getQueryInterface(), sequelize.Sequelize);
    
    console.log('✅ Migration completed successfully!');
    console.log('entityId column has been changed from INT to BIGINT');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
