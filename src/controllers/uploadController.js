// Upload Controller
// Handles file uploads to Cloudinary

const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

// Upload image to Cloudinary
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided',
      });
    }

    const { folder = 'theplayfree/seo' } = req.body;

    console.log('📁 Uploading file:', {
      filename: req.file.originalname,
      size: req.file.size,
      folder,
    });

    // Upload to Cloudinary
    const result = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname,
      'image'
    );

    console.log('✅ Upload successful:', result.secure_url);

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      url: result.secure_url,
      data: {
        public_id: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
      },
    });
  } catch (error) {
    console.error('❌ Upload error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message,
    });
  }
};

// Upload multiple images
exports.uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files provided',
      });
    }

    const { folder = 'theplayfree/seo' } = req.body;

    console.log('📁 Uploading files:', {
      count: req.files.length,
      folder,
    });

    // Upload all files in parallel
    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer, file.originalname, 'image')
    );

    const results = await Promise.all(uploadPromises);

    console.log('✅ All uploads successful');

    res.status(200).json({
      success: true,
      message: 'Files uploaded successfully',
      data: results.map((result) => ({
        public_id: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
      })),
    });
  } catch (error) {
    console.error('❌ Upload error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message,
    });
  }
};
