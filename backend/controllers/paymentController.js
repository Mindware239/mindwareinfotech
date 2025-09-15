const Payment = require('../models/Payment');
const Enrollment = require('../models/Enrollment');
const { Op } = require('sequelize');
const crypto = require('crypto');

// Razorpay integration (optional)
const Razorpay = require('razorpay');
let razorpay = null;

// Initialize Razorpay only if keys are provided
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private/Admin
const getPayments = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sort = 'created_at',
      order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Add search filter
    if (search) {
      whereClause[Op.or] = [
        { transaction_id: { [Op.like]: `%${search}%` } },
        { student_email: { [Op.like]: `%${search}%` } }
      ];
    }

    // Add status filter
    if (status) {
      whereClause.status = status;
    }

    const { count, rows: payments } = await Payment.findAndCountAll({
      where: whereClause,
      order: [[sort, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: Enrollment,
          as: 'enrollment',
          attributes: ['id', 'firstName', 'lastName', 'courseInterest']
        }
      ]
    });

    res.status(200).json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: payments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
const getPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [
        {
          model: Enrollment,
          as: 'enrollment',
          attributes: ['id', 'firstName', 'lastName', 'courseInterest', 'courseFee']
        }
      ]
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my payments (for logged-in user)
// @route   GET /api/payments/my-payments
// @access  Private
const getMyPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: payments } = await Payment.findAndCountAll({
      where: { student_id: req.user.id },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: Enrollment,
          as: 'enrollment',
          attributes: ['id', 'courseInterest', 'courseFee']
        }
      ]
    });

    res.status(200).json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: payments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new payment
// @route   POST /api/payments
// @access  Private
const createPayment = async (req, res, next) => {
  try {
    const paymentData = {
      ...req.body,
      student_id: req.user.id
    };

    const payment = await Payment.create(paymentData);

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Razorpay order
// @route   POST /api/payments/razorpay/create-order
// @access  Private
const createRazorpayOrder = async (req, res, next) => {
  try {
    if (!razorpay) {
      return res.status(400).json({
        success: false,
        message: 'Razorpay is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to environment variables.'
      });
    }

    const { amount, currency = 'INR', receipt, notes } = req.body;

    const options = {
      amount: amount, // Amount in paise
      currency: currency,
      receipt: receipt,
      notes: notes
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/razorpay/verify
// @access  Private
const verifyRazorpayPayment = async (req, res, next) => {
  try {
    if (!razorpay) {
      return res.status(400).json({
        success: false,
        message: 'Razorpay is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to environment variables.'
      });
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      enrollment_id 
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Get order details
    const order = await razorpay.orders.fetch(razorpay_order_id);
    
    // Create payment record
    const payment = await Payment.create({
      student_id: req.user.id,
      enrollment_id: enrollment_id,
      amount: order.amount / 100, // Convert from paise to rupees
      currency: order.currency,
      payment_method: 'razorpay',
      transaction_id: razorpay_payment_id,
      status: 'completed',
      payment_gateway: 'razorpay',
      gateway_transaction_id: razorpay_payment_id,
      gateway_order_id: razorpay_order_id,
      payment_date: new Date()
    });

    // Update enrollment status
    await Enrollment.update(
      { 
        payment_status: 'completed',
        status: 'approved'
      },
      { where: { id: enrollment_id } }
    );

    res.status(200).json({
      success: true,
      message: 'Payment verified and processed successfully',
      data: payment
    });
  } catch (error) {
    console.error('Razorpay payment verification error:', error);
    res.status(400).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

// @desc    Create Stripe payment intent
// @route   POST /api/payments/stripe/create-payment-intent
// @access  Private
const createStripePaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency = 'inr', metadata } = req.body;

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: currency,
      metadata: metadata
    });

    res.status(200).json({
      success: true,
      message: 'Payment intent created successfully',
      data: {
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret
      }
    });
  } catch (error) {
    console.error('Stripe payment intent creation error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message
    });
  }
};

// @desc    Verify Stripe payment
// @route   POST /api/payments/stripe/verify
// @access  Private
const verifyStripePayment = async (req, res, next) => {
  try {
    const { payment_intent_id, enrollment_id } = req.body;

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }

    // Create payment record
    const payment = await Payment.create({
      student_id: req.user.id,
      enrollment_id: enrollment_id,
      amount: paymentIntent.amount / 100, // Convert from cents to rupees
      currency: paymentIntent.currency,
      payment_method: 'stripe',
      transaction_id: paymentIntent.id,
      status: 'completed',
      payment_gateway: 'stripe',
      gateway_transaction_id: paymentIntent.id,
      payment_date: new Date()
    });

    // Update enrollment status
    await Enrollment.update(
      { 
        payment_status: 'completed',
        status: 'approved'
      },
      { where: { id: enrollment_id } }
    );

    res.status(200).json({
      success: true,
      message: 'Payment verified and processed successfully',
      data: payment
    });
  } catch (error) {
    console.error('Stripe payment verification error:', error);
    res.status(400).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

// @desc    Update payment
// @route   PUT /api/payments/:id
// @access  Private
const updatePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findByPk(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const updatedPayment = await payment.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      data: updatedPayment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete payment
// @route   DELETE /api/payments/:id
// @access  Private/Admin
const deletePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findByPk(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    await payment.destroy();

    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify payment
// @route   POST /api/payments/:id/verify
// @access  Private
const verifyPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findByPk(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Update payment status
    await payment.update({
      status: 'completed',
      verified_at: new Date()
    });

    // Update enrollment status
    await Enrollment.update(
      { 
        payment_status: 'completed',
        status: 'approved'
      },
      { where: { id: payment.enrollment_id } }
    );

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refund payment
// @route   POST /api/payments/:id/refund
// @access  Private/Admin
const refundPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findByPk(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Update payment status
    await payment.update({
      status: 'refunded',
      refunded_at: new Date(),
      refund_reason: req.body.reason
    });

    // Update enrollment status
    await Enrollment.update(
      { 
        payment_status: 'refunded',
        status: 'cancelled'
      },
      { where: { id: payment.enrollment_id } }
    );

    res.status(200).json({
      success: true,
      message: 'Payment refunded successfully',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment methods
// @route   GET /api/payments/methods
// @access  Public
const getPaymentMethods = async (req, res, next) => {
  try {
    const methods = [
      {
        id: 'razorpay',
        name: 'Razorpay',
        icon: 'fa-credit-card',
        description: 'Pay with Razorpay (Cards, UPI, Net Banking)',
        enabled: !!process.env.RAZORPAY_KEY_ID
      },
      {
        id: 'stripe',
        name: 'Stripe',
        icon: 'fa-cc-stripe',
        description: 'Pay with Stripe (Cards, Digital Wallets)',
        enabled: !!process.env.STRIPE_SECRET_KEY
      },
      {
        id: 'paypal',
        name: 'PayPal',
        icon: 'fa-cc-paypal',
        description: 'Pay with PayPal',
        enabled: !!process.env.PAYPAL_CLIENT_ID
      }
    ];

    res.status(200).json({
      success: true,
      data: methods.filter(method => method.enabled)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment statistics
// @route   GET /api/payments/stats
// @access  Private/Admin
const getPaymentStats = async (req, res, next) => {
  try {
    const totalPayments = await Payment.count();
    const completedPayments = await Payment.count({ where: { status: 'completed' } });
    const pendingPayments = await Payment.count({ where: { status: 'pending' } });
    const failedPayments = await Payment.count({ where: { status: 'failed' } });
    const refundedPayments = await Payment.count({ where: { status: 'refunded' } });

    const totalRevenue = await Payment.sum('amount', {
      where: { status: 'completed' }
    });

    res.status(200).json({
      success: true,
      data: {
        totalPayments,
        completedPayments,
        pendingPayments,
        failedPayments,
        refundedPayments,
        totalRevenue: totalRevenue || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};