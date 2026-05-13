'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Change entityId column from INT to BIGINT to support large numbers
    await queryInterface.changeColumn('seo_metadata', 'entityId', {
      type: Sequelize.BIGINT,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert to INT
    await queryInterface.changeColumn('seo_metadata', 'entityId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
