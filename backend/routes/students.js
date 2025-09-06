const express = require('express');
const {
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  getStudentProfile,
  updateStudentProfile,
  getStudentApplications,
  getStudentCourses
} = require('../controllers/studentController');

const { protect, authorize } = require('../middleware/auth');
const { validateObjectId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Admin/Instructor routes
router.get('/', authorize('admin', 'instructor'), validatePagination, getStudents);
router.get('/:id', authorize('admin', 'instructor'), validateObjectId('id'), getStudent);
router.put('/:id', authorize('admin', 'instructor'), validateObjectId('id'), updateStudent);
router.delete('/:id', authorize('admin'), validateObjectId('id'), deleteStudent);

// Student routes
router.get('/profile/me', getStudentProfile);
router.put('/profile/me', updateStudentProfile);
router.get('/applications/me', getStudentApplications);
router.get('/courses/me', getStudentCourses);

module.exports = router;
