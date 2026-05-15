// SEO Routes
// API endpoints for managing SEO metadata

const express = require('express');
const router = express.Router();
const seoController = require('../controllers/seoController');

// IMPORTANT: More specific routes must come BEFORE generic routes
// Get all SEO metadata by type (game, category, or page)
router.get('/type/:entityType', seoController.getSeoMetadataByType);

// Get all available static pages from the frontend (scanned)
router.get('/pages/available', seoController.getAvailablePages);

// Get SEO metadata by entity type and slug
router.get('/type/:entityType/slug/:pageSlug', seoController.getSeoMetadataBySlug);

// Get SEO metadata for a specific entity
router.get('/:entityType/:entityId', seoController.getSeoMetadata);

// Create or update SEO metadata
router.post('/:entityType/:entityId', seoController.upsertSeoMetadata);

// Update SEO metadata (alias for POST)
router.put('/:entityType/:entityId', seoController.upsertSeoMetadata);

// Delete SEO metadata
router.delete('/:entityType/:entityId', seoController.deleteSeoMetadata);

module.exports = router;
