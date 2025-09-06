const express = require('express');
const router = express.Router();
const {
  getEnrollments,
  getEnrollment,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
  updateEnrollmentStatus,
  getEnrollmentStats,
  searchEnrollments,
  getRecentEnrollments,
  bulkUpdateEnrollments,
  bulkDeleteEnrollments,
  upload
} = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/', upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
  { name: 'idProof', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 },
  { name: 'certificates', maxCount: 10 }
]), createEnrollment);

// Protected routes (Admin only)
router.use(protect);
router.use(authorize('admin'));

// Get all enrollments
router.get('/', getEnrollments);

// Get enrollment statistics
router.get('/stats', getEnrollmentStats);

// Search enrollments
router.get('/search', searchEnrollments);

// Get recent enrollments
router.get('/recent', getRecentEnrollments);

// Get single enrollment
router.get('/:id', getEnrollment);

// Update enrollment
router.put('/:id', upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
  { name: 'idProof', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 },
  { name: 'certificates', maxCount: 10 }
]), updateEnrollment);

// Update enrollment status
router.patch('/:id/status', updateEnrollmentStatus);

// Delete enrollment
router.delete('/:id', deleteEnrollment);

// Bulk operations
router.patch('/bulk-update', bulkUpdateEnrollments);
router.delete('/bulk-delete', bulkDeleteEnrollments);

module.exports = router;
