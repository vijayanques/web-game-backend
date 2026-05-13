// Upload Routes
// Handles file upload endpoints

const express = require('express');
const upload = require('../middleware/cloudinaryUpload');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

// POST upload single image
router.post('/image', upload.single('file'), uploadController.uploadImage);

// POST upload multiple images
router.post('/images', upload.array('files', 10), uploadController.uploadMultiple);

// POST upload with folder specification
router.post('/cloudinary', upload.single('file'), uploadController.uploadImage);

module.exports = router;
