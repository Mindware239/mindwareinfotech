const express = require('express');
const {
  getFAQs,
  getFAQ,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getFAQsByCategory,
  getFeaturedFAQs,
  searchFAQs,
  markHelpful,
  markNotHelpful,
  getFAQCategories
} = require('../controllers/faqController');

const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validateFAQ, validateIntegerId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', validatePagination, optionalAuth, getFAQs);
router.get('/featured', getFeaturedFAQs);
router.get('/search', searchFAQs);
router.get('/categories', getFAQCategories);
router.get('/category/:category', getFAQsByCategory);
router.get('/:id', validateIntegerId('id'), optionalAuth, getFAQ);

// User interaction routes
router.post('/:id/helpful', validateIntegerId('id'), markHelpful);
router.post('/:id/not-helpful', validateIntegerId('id'), markNotHelpful);

// Protected routes (temporarily removing auth for testing)
router.post('/', validateFAQ, createFAQ);
router.put('/:id', validateIntegerId('id'), validateFAQ, updateFAQ);
router.delete('/:id', validateIntegerId('id'), deleteFAQ);

module.exports = router;

