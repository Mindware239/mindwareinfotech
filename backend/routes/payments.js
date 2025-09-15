const express = require('express');
const router = express.Router();
const {
  getPayments,
  getPayment,
  getMyPayments,
  createPayment,
  createRazorpayOrder,
  verifyRazorpayPayment,
  createStripePaymentIntent,
  verifyStripePayment,
  updatePayment,
  deletePayment,
  verifyPayment,
  refundPayment,
  getPaymentMethods,
  getPaymentStats
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/methods', getPaymentMethods);

// Protected routes
router.use(protect);

// User routes
router.get('/my-payments', getMyPayments);
router.post('/', createPayment);
router.post('/razorpay/create-order', createRazorpayOrder);
router.post('/razorpay/verify', verifyRazorpayPayment);
router.post('/stripe/create-payment-intent', createStripePaymentIntent);
router.post('/stripe/verify', verifyStripePayment);
router.get('/:id', getPayment);
router.put('/:id', updatePayment);
router.post('/:id/verify', verifyPayment);

// Admin routes
router.get('/', authorize('admin'), getPayments);
router.get('/stats', authorize('admin'), getPaymentStats);
router.delete('/:id', authorize('admin'), deletePayment);
router.post('/:id/refund', authorize('admin'), refundPayment);

module.exports = router;