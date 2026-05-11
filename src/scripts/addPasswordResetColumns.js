// Script to add password reset columns to users table
// Usage: node src/scripts/addPasswordResetColumns.js

require('dotenv').config();
const sequelize = require('../config/database');

async function addPasswordResetColumns() {
  try {
    console.log('🚀 Starting migration...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    const queryInterface = sequelize.getQueryInterface();

    // Check if columns already exist
    const tableDescription = await queryInterface.describeTable('users');
    
    if (tableDescription.reset_token_hash) {
      console.log('⚠️  Column reset_token_hash already exists');
    } else {
      // Add reset_token_hash column
      await queryInterface.addColumn('users', 'reset_token_hash', {
        type: sequelize.Sequelize.STRING(255),
        allowNull: true,
        after: 'password',
      });
      console.log('✅ Added column: reset_token_hash');
    }

    if (tableDescription.reset_token_expiry) {
      console.log('⚠️  Column reset_token_expiry already exists');
    } else {
      // Add reset_token_expiry column
      await queryInterface.addColumn('users', 'reset_token_expiry', {
        type: sequelize.Sequelize.DATE,
        allowNull: true,
        after: 'reset_token_hash',
      });
      console.log('✅ Added column: reset_token_expiry');
    }

    // Add index for faster lookups
    try {
      await queryInterface.addIndex('users', ['reset_token_hash'], {
        name: 'idx_reset_token_hash',
      });
      console.log('✅ Added index: idx_reset_token_hash');
    } catch (error) {
      if (error.message.includes('Duplicate key name')) {
        console.log('⚠️  Index idx_reset_token_hash already exists');
      } else {
        throw error;
      }
    }

    console.log('✅ Migration completed successfully');
    console.log('\n📋 Updated users table structure:');
    
    const updatedDescription = await queryInterface.describeTable('users');
    console.table(updatedDescription);

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

addPasswordResetColumns();
