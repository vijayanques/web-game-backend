// SEO Metadata Model
// Stores SEO metadata for games and categories

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SeoMetadata = sequelize.define(
  'SeoMetadata',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    entityType: {
      type: DataTypes.ENUM('game', 'category', 'page'),
      allowNull: false,
    },
    entityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pageName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Page name (for page entityType)',
    },
    pageSlug: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Page slug/URL (for page entityType)',
    },
    metaTitle: {
      type: DataTypes.STRING(60),
      allowNull: true,
      comment: 'SEO title (60 chars recommended)',
    },
    metaDescription: {
      type: DataTypes.STRING(160),
      allowNull: true,
      comment: 'SEO description (160 chars recommended)',
    },
    metaKeywords: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Comma-separated keywords',
    },
    canonicalUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    ogTitle: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ogDescription: {
      type: DataTypes.STRING(160),
      allowNull: true,
    },
    ogImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Open Graph image URL',
    },
    twitterTitle: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    twitterDescription: {
      type: DataTypes.STRING(160),
      allowNull: true,
    },
    twitterImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    robots: {
      type: DataTypes.STRING(100),
      defaultValue: 'index, follow',
      comment: 'Robots meta tag value',
    },
    structuredData: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'JSON-LD structured data',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'seo_metadata',
    timestamps: true,
    indexes: [
      {
        fields: ['entityType', 'entityId'],
        unique: true,
      },
    ],
  }
);

module.exports = SeoMetadata;
