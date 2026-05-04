// Database Migration Script
// Removes displayOrder and icon columns, adds slug and image columns to categories table

const sequelize = require('./database');

const migrateDatabase = async () => {
  try {
    console.log('Starting database migration...');

    // Get the query interface
    const queryInterface = sequelize.getQueryInterface();

    // Describe the current table
    const table = await queryInterface.describeTable('categories');
    console.log('Current table columns:', Object.keys(table));

    // Remove displayOrder column if it exists
    if (table.displayOrder) {
      console.log('Removing displayOrder column...');
      await queryInterface.removeColumn('categories', 'displayOrder');
      console.log(' displayOrder column removed');
    }

    // Remove icon column if it exists
    if (table.icon) {
      console.log('Removing icon column...');
      await queryInterface.removeColumn('categories', 'icon');
      console.log(' icon column removed');
    }

    // Add slug column if it doesn't exist
    if (!table.slug) {
      console.log('Adding slug column...');
      await queryInterface.addColumn('categories', 'slug', {
        type: sequelize.Sequelize.STRING(100),
        allowNull: false,
        unique: true,
        defaultValue: '',
      });
      console.log(' slug column added');
    }

    // Add image column if it doesn't exist
    if (!table.image) {
      console.log('Adding image column...');
      await queryInterface.addColumn('categories', 'image', {
        type: sequelize.Sequelize.STRING(255),
        allowNull: true,
      });
      console.log(' image column added');
    }

    console.log('\n Database migration completed successfully!');
    console.log('\nUpdated table columns:');
    const updatedTable = await queryInterface.describeTable('categories');
    console.log(Object.keys(updatedTable));
    
    process.exit(0);
  } catch (error) {
    console.error(' Migration failed:', error.message);
    process.exit(1);
  }
};

// Run migration
migrateDatabase();
