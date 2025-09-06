const express = require('express');
const {
  getGalleryItems,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getGalleryByCategory,
  searchGallery,
  likeGalleryItem
} = require('../controllers/galleryController');

const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validateGallery, validateObjectId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', validatePagination, optionalAuth, getGalleryItems);
router.get('/search', validatePagination, searchGallery);
router.get('/category/:category', validatePagination, getGalleryByCategory);
router.get('/:id', validateObjectId('id'), optionalAuth, getGalleryItem);

// Protected routes
router.post('/', protect, authorize('admin', 'instructor'), validateGallery, createGalleryItem);
router.put('/:id', protect, authorize('admin', 'instructor'), validateObjectId('id'), validateGallery, updateGalleryItem);
router.delete('/:id', protect, authorize('admin'), validateObjectId('id'), deleteGalleryItem);

// User interactions
router.post('/:id/like', protect, validateObjectId('id'), likeGalleryItem);

module.exports = router;
