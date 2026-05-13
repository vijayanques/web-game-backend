// SEO Controller
// Handles SEO metadata CRUD operations

const { SeoMetadata, Game, Category } = require('../models');
const { Op } = require('sequelize');

// Get SEO metadata for an entity
exports.getSeoMetadata = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;

    // Validate entityId is a valid number
    const numEntityId = Number(entityId);
    if (isNaN(numEntityId)) {
      return res.status(400).json({ message: 'Invalid entityId format' });
    }

    console.log('🔍 Fetching SEO metadata:', { entityType, entityId: numEntityId });

    // Try to find by entityId first
    let metadata = await SeoMetadata.findOne({
      where: { entityType, entityId: numEntityId },
    });

    // If not found and entityType is 'page', try to find by database id
    if (!metadata && entityType === 'page') {
      console.log('⚠️ Not found by entityId, trying by database id:', numEntityId);
      metadata = await SeoMetadata.findOne({
        where: { id: numEntityId },
      });
    }

    if (!metadata) {
      console.log('❌ SEO metadata not found for:', { entityType, entityId: numEntityId });
      return res.status(404).json({ 
        message: 'SEO metadata not found',
        details: `No metadata found for entityType: ${entityType}, entityId: ${numEntityId}`
      });
    }

    console.log('✅ SEO metadata found:', metadata.id);
    res.json(metadata);
  } catch (error) {
    console.error('❌ Error fetching SEO metadata:', error);
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

    // Validate entityId is a valid number
    const numEntityId = Number(entityId);
    if (isNaN(numEntityId)) {
      return res.status(400).json({ message: 'Invalid entityId format' });
    }

    console.log('💾 Upserting SEO metadata:', { entityType, entityId: numEntityId });

    // Validate entity exists (skip validation for 'page' type as pages don't have a model)
    if (entityType !== 'page') {
      const Model = entityType === 'game' ? Game : Category;
      const entity = await Model.findByPk(parseInt(entityId));
      if (!entity) {
        return res.status(404).json({ message: `${entityType} not found` });
      }
    }

    // For page type, try to find by database id first
    let metadata;
    let created = false;

    if (entityType === 'page') {
      // Try to find by database id first
      metadata = await SeoMetadata.findOne({
        where: { id: numEntityId },
      });

      if (metadata) {
        // Update existing
        console.log('📝 Updating existing page metadata (by id)');
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
      } else {
        // Try to find by entityId
        metadata = await SeoMetadata.findOne({
          where: { entityType, entityId: numEntityId },
        });

        if (metadata) {
          // Update existing
          console.log('📝 Updating existing page metadata (by entityId)');
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
        } else {
          // Create new
          console.log('✨ Creating new page metadata');
          metadata = await SeoMetadata.create({
            entityType,
            entityId: numEntityId,
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
          created = true;
        }
      }
    } else {
      // For game/category, use findOrCreate
      const [meta, isCreated] = await SeoMetadata.findOrCreate({
        where: { entityType, entityId: numEntityId },
        defaults: {
          entityType,
          entityId: numEntityId,
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

      metadata = meta;
      created = isCreated;

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
    }

    console.log('✅ SEO metadata saved successfully');
    res.status(created ? 201 : 200).json({
      message: created ? 'SEO metadata created' : 'SEO metadata updated',
      data: metadata,
    });
  } catch (error) {
    console.error('❌ Error upserting SEO metadata:', error);
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

    // Validate entityId is a valid number
    const numEntityId = Number(entityId);
    if (isNaN(numEntityId)) {
      return res.status(400).json({ message: 'Invalid entityId format' });
    }

    console.log('🗑️ Attempting to delete:', { entityType, entityId: numEntityId });

    // Try to find by entityId first (for games/categories)
    let result = await SeoMetadata.destroy({
      where: { entityType, entityId: numEntityId },
    });

    // If not found and entityType is 'page', try to find by database id
    if (result === 0 && entityType === 'page') {
      console.log('⚠️ Not found by entityId, trying by database id:', numEntityId);
      result = await SeoMetadata.destroy({
        where: { id: numEntityId },
      });
    }

    if (result === 0) {
      console.log('❌ SEO metadata not found for:', { entityType, entityId: numEntityId });
      return res.status(404).json({ 
        message: 'SEO metadata not found',
        details: `No metadata found for entityType: ${entityType}, entityId: ${numEntityId}`
      });
    }

    console.log('✅ SEO metadata deleted successfully');
    res.json({ message: 'SEO metadata deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting SEO metadata:', error);
    res.status(500).json({ 
      message: 'Error deleting SEO metadata',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get SEO metadata for an entity by page slug
exports.getSeoMetadataBySlug = async (req, res) => {
  try {
    const { entityType, pageSlug } = req.params;

    const normalizedSlug = pageSlug.trim().replace(/^\/+/, '');

    const metadata = await SeoMetadata.findOne({
      where: {
        entityType,
        [Op.or]: [
          { pageSlug: normalizedSlug },
          { pageSlug: `/${normalizedSlug}` },
        ],
      },
    });

    if (!metadata) {
      return res.status(404).json({ message: 'SEO metadata not found' });
    }

    res.json(metadata);
  } catch (error) {
    console.error('Error fetching SEO metadata by slug:', error);
    res.status(500).json({ message: 'Error fetching SEO metadata by slug' });
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
