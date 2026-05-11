// SEO Controller
// Handles SEO metadata CRUD operations

const { SeoMetadata, Game, Category } = require('../models');

// Get SEO metadata for an entity
exports.getSeoMetadata = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;

    const metadata = await SeoMetadata.findOne({
      where: { entityType, entityId: parseInt(entityId) },
    });

    if (!metadata) {
      return res.status(404).json({ message: 'SEO metadata not found' });
    }

    res.json(metadata);
  } catch (error) {
    console.error('Error fetching SEO metadata:', error);
    res.status(500).json({ message: 'Error fetching SEO metadata' });
  }
};

// Create or update SEO metadata
exports.upsertSeoMetadata = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const {
      pageName,
      pageSlug,
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      ogTitle,
      ogDescription,
      ogImage,
      twitterTitle,
      twitterDescription,
      twitterImage,
      robots,
      structuredData,
    } = req.body;

    // Validate entity exists (skip validation for 'page' type as pages don't have a model)
    if (entityType !== 'page') {
      const Model = entityType === 'game' ? Game : Category;
      const entity = await Model.findByPk(entityId);
      if (!entity) {
        return res.status(404).json({ message: `${entityType} not found` });
      }
    }

    // Find or create metadata
    const [metadata, created] = await SeoMetadata.findOrCreate({
      where: { entityType, entityId: parseInt(entityId) },
      defaults: {
        pageName,
        pageSlug,
        metaTitle,
        metaDescription,
        metaKeywords,
        canonicalUrl,
        ogTitle,
        ogDescription,
        ogImage,
        twitterTitle,
        twitterDescription,
        twitterImage,
        robots,
        structuredData,
      },
    });

    // If exists, update it
    if (!created) {
      await metadata.update({
        pageName,
        pageSlug,
        metaTitle,
        metaDescription,
        metaKeywords,
        canonicalUrl,
        ogTitle,
        ogDescription,
        ogImage,
        twitterTitle,
        twitterDescription,
        twitterImage,
        robots,
        structuredData,
      });
    }

    res.status(created ? 201 : 200).json({
      message: created ? 'SEO metadata created' : 'SEO metadata updated',
      data: metadata,
    });
  } catch (error) {
    console.error('Error upserting SEO metadata:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      message: 'Error saving SEO metadata',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete SEO metadata
exports.deleteSeoMetadata = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;

    const result = await SeoMetadata.destroy({
      where: { entityType, entityId: parseInt(entityId) },
    });

    if (result === 0) {
      return res.status(404).json({ message: 'SEO metadata not found' });
    }

    res.json({ message: 'SEO metadata deleted' });
  } catch (error) {
    console.error('Error deleting SEO metadata:', error);
    res.status(500).json({ message: 'Error deleting SEO metadata' });
  }
};

// Get all SEO metadata for a specific entity type
exports.getSeoMetadataByType = async (req, res) => {
  try {
    const { entityType } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows } = await SeoMetadata.findAndCountAll({
      where: { entityType },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['updatedAt', 'DESC']],
    });

    res.json({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching SEO metadata:', error);
    res.status(500).json({ message: 'Error fetching SEO metadata' });
  }
};
