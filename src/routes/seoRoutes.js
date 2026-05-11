// SEO Routes
// API endpoints for managing SEO metadata

const express = require('express');
const router = express.Router();
const seoController = require('../controllers/seoController');

// Get SEO metadata for a specific entity
router.get('/:entityType/:entityId', seoController.getSeoMetadata);

// Create or update SEO metadata
router.post('/:entityType/:entityId', seoController.upsertSeoMetadata);

// Update SEO metadata (alias for POST)
router.put('/:entityType/:entityId', seoController.upsertSeoMetadata);

// Delete SEO metadata
router.delete('/:entityType/:entityId', seoController.deleteSeoMetadata);

// Get all SEO metadata by type (game or category)
router.get('/type/:entityType', seoController.getSeoMetadataByType);

module.exports = router;
