// Routes Index
// Centralized export for all route modules

const express = require('express');
const userRoutes = require('./userRoutes');
const categoryRoutes = require('./categoryRoutes');
const gameRoutes = require('./gameRoutes');
const topPicksRoutes = require('./topPicksRoutes');
const userActivityRoutes = require('./userActivityRoutes');
const adminRoutes = require('./adminRoutes');
const seoRoutes = require('./seoRoutes');
const uploadRoutes = require('./uploadRoutes');
const notificationRoutes = require('./notificationRoutes');
const adsenseRoutes = require('./adsenseRoutes');
const trafficRoutes = require('./trafficRoutes');
const bugReportRoutes = require('./bugReportRoutes');

const router = express.Router();

// Mount routes
router.use('/api/users', userRoutes);
router.use('/api/categories', categoryRoutes);
router.use('/api/games', gameRoutes);
router.use('/api/top-picks', topPicksRoutes);
router.use('/api/user-activity', userActivityRoutes);
router.use('/api/admin', adminRoutes);
router.use('/api/seo', seoRoutes);
router.use('/api/upload', uploadRoutes);
router.use('/api/notifications', notificationRoutes);
router.use('/api/adsense', adsenseRoutes);
router.use('/api/traffic', trafficRoutes);
router.use('/api/bug-reports', bugReportRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// Test endpoint for debugging
router.post('/api/test', (req, res) => {
  console.log('Test endpoint called');
  console.log('Request body:', req.body);
  res.status(200).json({
    success: true,
    message: 'Test endpoint working',
    receivedData: req.body,
  });
});

// Debug endpoint to check page SEO records
router.get('/api/debug/page-seo', async (req, res) => {
  try {
    const { SeoMetadata } = require('../models');
    
    const records = await SeoMetadata.findAll({
      where: { entityType: 'page' },
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      totalRecords: records.length,
      records: records.map(r => ({
        id: r.id,
        entityType: r.entityType,
        entityId: r.entityId,
        pageName: r.pageName,
        pageSlug: r.pageSlug,
        metaTitle: r.metaTitle,
        metaDescription: r.metaDescription,
        metaKeywords: r.metaKeywords,
        canonicalUrl: r.canonicalUrl,
        ogTitle: r.ogTitle,
        ogImage: r.ogImage,
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Debug endpoint to test slug lookup
router.get('/api/debug/page-seo/slug/:slug', async (req, res) => {
  try {
    const { SeoMetadata } = require('../models');
    const { Op } = require('sequelize');
    const { slug } = req.params;

    const normalizedSlug = slug.trim().replace(/^\/+/, '');

    const record = await SeoMetadata.findOne({
      where: {
        entityType: 'page',
        [Op.or]: [
          { pageSlug: normalizedSlug },
          { pageSlug: `/${normalizedSlug}` },
        ],
      },
    });

    res.json({
      success: !!record,
      searchedSlug: slug,
      normalizedSlug,
      queries: [
        { pageSlug: normalizedSlug },
        { pageSlug: `/${normalizedSlug}` },
      ],
      record: record || { message: 'Not found' },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
