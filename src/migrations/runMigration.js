// Migration Runner
// Run this file to execute the video field migration

require('dotenv').config();
const sequelize = require('../config/database');
const migration = require('./add-video-field-to-games');

async function runMigration() {
  try {
    console.log('🚀 Starting migration...');
    
    // Run the migration
    await migration.up(sequelize.getQueryInterface(), sequelize.Sequelize);
    
    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
