'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add 'page' to entityType enum
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_seo_metadata_entityType" ADD VALUE IF NOT EXISTS 'page';
    `);

    // Add pageName column
    await queryInterface.addColumn('seo_metadata', 'pageName', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Page name (for page entityType)',
    });

    // Add pageSlug column
    await queryInterface.addColumn('seo_metadata', 'pageSlug', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Page slug/URL (for page entityType)',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove columns
    await queryInterface.removeColumn('seo_metadata', 'pageName');
    await queryInterface.removeColumn('seo_metadata', 'pageSlug');
    
    // Note: Removing enum value is complex in PostgreSQL, so we skip it
    // You would need to recreate the enum type without 'page' value
  },
};
