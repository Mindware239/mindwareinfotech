const express = require('express');
const {
  getInternships,
  getInternship,
  createInternship,
  updateInternship,
  deleteInternship,
  getInternshipsByCategory,
  searchInternships,
  applyToInternship,
  getMyApplications
} = require('../controllers/internshipController');

const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validateInternship, validateObjectId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', validatePagination, optionalAuth, getInternships);
router.get('/search', validatePagination, searchInternships);
router.get('/category/:category', validatePagination, getInternshipsByCategory);
router.get('/:id', validateObjectId('id'), optionalAuth, getInternship);

// Protected routes
router.post('/', protect, authorize('admin', 'instructor'), validateInternship, createInternship);
router.put('/:id', protect, authorize('admin', 'instructor'), validateObjectId('id'), validateInternship, updateInternship);
router.delete('/:id', protect, authorize('admin'), validateObjectId('id'), deleteInternship);

// Student routes
router.post('/:id/apply', protect, validateObjectId('id'), applyToInternship);
router.get('/my/applications', protect, getMyApplications);

module.exports = router;
