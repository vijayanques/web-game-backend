const multer = require('multer');
const path = require('path');

// Use memory storage for temporary file handling
const storage = multer.memoryStorage();

// Create multer upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB for videos
  },
  fileFilter: (req, file, cb) => {
    const allowedImageMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    const allowedVideoMimes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    
    const allAllowedMimes = [...allowedImageMimes, ...allowedVideoMimes];
    
    if (allAllowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WebP, SVG (images) and MP4, WebM, OGG, MOV (videos) are allowed.'));
    }
  },
});

module.exports = upload;
