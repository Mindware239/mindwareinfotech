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

// Public routes
router.get('/active', getActiveTestimonials);
router.get('/', getTestimonials);
router.get('/:id', getTestimonial);

// Protected routes (Admin only)
router.post('/', protect, isAdmin, createTestimonial);
router.put('/:id', protect, isAdmin, updateTestimonial);
router.delete('/:id', protect, isAdmin, deleteTestimonial);

module.exports = router;
