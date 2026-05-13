const { sequelize, Notification, FirebaseToken } = require('../models');

async function createNotificationTables() {
  try {
    console.log('🔄 Creating notification tables...');

    // Sync models with database
    await sequelize.sync({ alter: true });

    console.log('✅ Notification tables created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
  }
}

createNotificationTables();
