const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for video uploads
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(uploadsDir, 'videos'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure multer for image uploads
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(uploadsDir, 'images'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for videos
const videoFilter = (req, file, cb) => {
  const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed!'), false);
  }
};

// File filter for images
const imageFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create multer instances
const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Error handling middleware
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 100MB for videos and 10MB for images.'
      });
    }
  }
  
  if (error.message === 'Only video files are allowed!' || error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
};

module.exports = {
  uploadVideo,
  uploadImage,
  handleUploadError
};
