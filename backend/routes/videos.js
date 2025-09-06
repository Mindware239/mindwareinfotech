const express = require('express');
const {
  getVideos,
  getVideo,
  createVideo,
  updateVideo,
  deleteVideo,
  getVideosByCourse,
  uploadVideo,
  getVideoProgress
} = require('../controllers/videoController');

const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validateObjectId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', validatePagination, optionalAuth, getVideos);
router.get('/course/:courseId', validateObjectId('courseId'), optionalAuth, getVideosByCourse);
router.get('/:id', validateObjectId('id'), optionalAuth, getVideo);

// Protected routes
router.post('/', protect, authorize('admin', 'instructor'), createVideo);
router.put('/:id', protect, authorize('admin', 'instructor'), validateObjectId('id'), updateVideo);
router.delete('/:id', protect, authorize('admin'), validateObjectId('id'), deleteVideo);
router.post('/upload', protect, authorize('admin', 'instructor'), uploadVideo);

// Student routes
router.get('/:id/progress', protect, validateObjectId('id'), getVideoProgress);

module.exports = router;
