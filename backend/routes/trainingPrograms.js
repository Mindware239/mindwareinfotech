const express = require('express');
const {
  getTrainingPrograms,
  getTrainingProgram,
  getTrainingProgramBySlug,
  getTrainingProgramsByCategory,
  getFeaturedTrainingPrograms,
  getTrainingCategories,
  createTrainingProgram,
  updateTrainingProgram,
  deleteTrainingProgram,
  getTrainingStats,
  seedTrainingPrograms
} = require('../controllers/trainingController');

const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validateObjectId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', validatePagination, optionalAuth, getTrainingPrograms);
router.get('/featured', getFeaturedTrainingPrograms);
router.get('/categories', getTrainingCategories);
router.get('/stats', getTrainingStats);
router.get('/category/:category', getTrainingProgramsByCategory);
router.get('/slug/:slug', getTrainingProgramBySlug);
router.get('/:id', validateObjectId('id'), getTrainingProgram);
router.post('/seed', seedTrainingPrograms); // Public seed endpoint for development

// Protected routes (Admin only) - Temporarily made public for testing
router.post('/', createTrainingProgram);
router.put('/:id', validateObjectId('id'), updateTrainingProgram);
router.delete('/:id', validateObjectId('id'), deleteTrainingProgram);

module.exports = router;
