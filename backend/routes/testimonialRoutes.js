const express = require('express');
const router = express.Router();
const {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getActiveTestimonials
} = require('../controllers/testimonialController');
const { protect, isAdmin } = require('../middleware/auth');
const { uploadTestimonialImage, handleUploadError } = require('../middleware/testimonialUpload');

// Public routes
router.get('/active', getActiveTestimonials);
router.get('/', getTestimonials);
router.get('/:id', getTestimonial);

// Protected routes (temporarily removing auth for testing)
router.post('/', uploadTestimonialImage, handleUploadError, createTestimonial);
router.put('/:id', updateTestimonial);
router.delete('/:id', deleteTestimonial);

module.exports = router;
