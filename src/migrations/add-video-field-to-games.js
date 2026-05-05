const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Check if column already exists
      const tableDescription = await queryInterface.describeTable('games');
      
      if (!tableDescription.videoUrl) {
        await queryInterface.addColumn('games', 'videoUrl', {
          type: DataTypes.STRING(500),
          allowNull: true,
          after: 'thumbnail'
        });
        console.log('✅ Added videoUrl column to games table');
      } else {
        console.log('ℹ️ videoUrl column already exists in games table');
      }
    } catch (error) {
      console.error('❌ Migration error:', error.message);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('games', 'videoUrl');
      console.log('✅ Removed videoUrl column from games table');
    } catch (error) {
      console.error('❌ Rollback error:', error.message);
      throw error;
    }
  }
};
