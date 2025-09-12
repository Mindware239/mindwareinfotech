const express = require('express');
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  applyForJob,
  getJobApplications,
  updateApplicationStatus,
  getJobStats
} = require('../controllers/jobController');

const { protect, authorize } = require('../middleware/auth');
const { validateJob, validateObjectId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', validatePagination, getJobs);
router.get('/stats', getJobStats);
router.get('/:id', validateObjectId, getJob);
router.post('/:id/apply', validateObjectId, applyForJob);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.post('/', validateJob, createJob);
router.put('/:id', validateObjectId, validateJob, updateJob);
router.delete('/:id', validateObjectId, deleteJob);
router.get('/:id/applications', validateObjectId, validatePagination, getJobApplications);
router.put('/applications/:id', validateObjectId, updateApplicationStatus);

module.exports = router;
