// Migration script to add last_login_at column
// Run this file with: node src/migrations/add-last-login-at.js

const sequelize = require('../config/database');

async function addLastLoginAtColumn() {
  try {
    console.log('Starting migration: Adding last_login_at column...');
    
    // Add the column using raw SQL
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP NULL DEFAULT NULL 
      AFTER level
    `);
    
    console.log('✅ Successfully added last_login_at column to users table');
    
    // Verify the column was added
    const [results] = await sequelize.query('DESCRIBE users');
    console.log('\nCurrent users table structure:');
    console.table(results);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

addLastLoginAtColumn();
