const express = require('express');
const {
  getDashboardStats,
  getUsers,
  updateUser,
  deleteUser,
  getSystemStats,
  getRecentActivity
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/auth');
const { validateObjectId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// All routes require admin access
router.use(protect, authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);
router.get('/stats', getSystemStats);
router.get('/activity', getRecentActivity);

// User management
router.get('/users', validatePagination, getUsers);
router.put('/users/:id', validateObjectId('id'), updateUser);
router.delete('/users/:id', validateObjectId('id'), deleteUser);

module.exports = router;
