// v2
console.log('ALL ENV KEYS:', Object.keys(process.env));
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('Cloudinary Config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET',
});

exports.uploadToCloudinary = async (fileBuffer, fileName, resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const isSvg = fileName.toLowerCase().endsWith('.svg');
    const isVideo = ['mp4', 'webm', 'ogg', 'mov'].some(ext => fileName.toLowerCase().endsWith(ext));
    
    let finalResourceType = resourceType;
    if (resourceType === 'auto') {
      if (isSvg) finalResourceType = 'raw';
      else if (isVideo) finalResourceType = 'video';
      else finalResourceType = 'image';
    }
    
    const uploadStream = cloudinary.uploader.upload_stream(
      {
      folder: process.env.CLOUDINARY_FOLDER || 'categories_images',
      resource_type: finalResourceType,
      public_id: (isSvg || isVideo) ? fileName : fileName.split('.')[0],
      use_filename: isSvg || isVideo,
      unique_filename: false,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          console.log('Cloudinary upload success:', result.secure_url);
          resolve(result);
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};