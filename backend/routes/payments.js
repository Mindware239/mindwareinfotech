const express = require('express');
const {
  createPayment,
  verifyPayment,
  getPayments,
  getPayment,
  refundPayment,
  getMyPayments
} = require('../controllers/paymentController');

const { protect, authorize } = require('../middleware/auth');
const { validateObjectId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Public payment routes
router.post('/create', createPayment);
router.post('/verify', verifyPayment);

// User routes
router.get('/my-payments', getMyPayments);
router.get('/:id', validateObjectId('id'), getPayment);

// Admin routes
router.get('/', authorize('admin'), validatePagination, getPayments);
router.post('/:id/refund', authorize('admin'), validateObjectId('id'), refundPayment);

module.exports = router;
