const express = require('express');
const {
  getVideos,
  getVideo,
  createVideo,
  updateVideo,
  deleteVideo,
  getVideosByCourse,
  uploadVideo,
  getVideoProgress,
  checkVideoAccess,
  grantVideoAccess,
  updateVideoProgress,
  purchaseVideoAccess
} = require('../controllers/videoController');

const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validateObjectId, validateIntegerId, validatePagination } = require('../middleware/validation');
const { 
  uploadVideo: uploadVideoMiddleware, 
  uploadThumbnail,
  uploadMultiple,
  handleUploadError,
  cleanupUploads
} = require('../middleware/videoUpload');

const router = express.Router();

// Public routes
router.get('/', validatePagination, optionalAuth, getVideos);
router.get('/course/:courseId', validateIntegerId('courseId'), optionalAuth, getVideosByCourse);
router.get('/:id', validateIntegerId('id'), optionalAuth, getVideo);

// Protected routes
router.post('/', protect, authorize('admin', 'instructor'), createVideo);
router.put('/:id', protect, authorize('admin', 'instructor'), validateIntegerId('id'), updateVideo);
router.delete('/:id', protect, authorize('admin'), validateIntegerId('id'), deleteVideo);

// Upload routes
router.post('/upload', protect, authorize('admin', 'instructor'), uploadVideoMiddleware, handleUploadError, cleanupUploads, uploadVideo);
router.post('/upload-thumbnail', protect, authorize('admin', 'instructor'), uploadThumbnail, handleUploadError, cleanupUploads, (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }
  
  res.json({
    success: true,
    data: {
      filename: req.file.filename,
      path: req.file.path,
      url: `/uploads/thumbnails/${req.file.filename}`
    }
  });
});
router.post('/upload-multiple', protect, authorize('admin', 'instructor'), uploadMultiple, handleUploadError, cleanupUploads, (req, res) => {
  const files = {};
  if (req.files.video) {
    files.video = {
      filename: req.files.video[0].filename,
      path: req.files.video[0].path,
      url: `/uploads/videos/${req.files.video[0].filename}`
    };
  }
  if (req.files.thumbnail) {
    files.thumbnail = {
      filename: req.files.thumbnail[0].filename,
      path: req.files.thumbnail[0].path,
      url: `/uploads/thumbnails/${req.files.thumbnail[0].filename}`
    };
  }
  
  res.json({
    success: true,
    data: files
  });
});

// Student routes
router.get('/:id/progress', protect, validateIntegerId('id'), getVideoProgress);
router.get('/:id/access', protect, validateIntegerId('id'), checkVideoAccess);
router.post('/:id/purchase', protect, validateIntegerId('id'), purchaseVideoAccess);
router.post('/:id/grant-access', protect, validateIntegerId('id'), grantVideoAccess);
router.post('/:id/progress', protect, validateIntegerId('id'), updateVideoProgress);

module.exports = router;
