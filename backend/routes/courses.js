const express = require('express');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCoursesByCategory,
  getCoursesByInstructor,
  getFeaturedCourses
} = require('../controllers/courseController');

const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validateObjectId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', validatePagination, optionalAuth, getCourses);
router.get('/featured', getFeaturedCourses);
router.get('/category/:category', optionalAuth, getCoursesByCategory);
router.get('/instructor/:instructorId', validateObjectId('instructorId'), optionalAuth, getCoursesByInstructor);
router.get('/:id', validateObjectId('id'), optionalAuth, getCourse);

// Protected routes
router.post('/', protect, authorize('admin', 'instructor'), createCourse);
router.put('/:id', protect, authorize('admin', 'instructor'), validateObjectId('id'), updateCourse);
router.delete('/:id', protect, authorize('admin'), validateObjectId('id'), deleteCourse);

module.exports = router;
