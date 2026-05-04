// Database Setup Script
// Creates tables and runs migrations

const sequelize = require('./database');
const { execSync } = require('child_process');

const setupDatabase = async () => {
  try {
    console.log('Setting up database...');

    // Sync database
    await sequelize.sync({ alter: true });
    console.log(' Database tables synchronized');

    // Run migration
    console.log('Running migrations...');
    execSync('node src/config/migrationDatabase.js', { stdio: 'inherit' });

    console.log(' Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(' Setup failed:', error.message);
    process.exit(1);
  }
};

// Run setup
setupDatabase();
