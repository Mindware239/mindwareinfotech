import api from './api';

const paymentService = {
  // Get all payments
  getPayments: async (params = {}) => {
    try {
      const response = await api.get('/payments', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single payment
  getPayment: async (id) => {
    try {
      const response = await api.get(`/payments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get my payments (for logged-in user)
  getMyPayments: async (params = {}) => {
    try {
      const response = await api.get('/payments/my-payments', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create payment
  createPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Process payment with Razorpay
  processRazorpayPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments/razorpay/create-order', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Verify Razorpay payment
  verifyRazorpayPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments/razorpay/verify', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Process payment with Stripe
  processStripePayment: async (paymentData) => {
    try {
      const response = await api.post('/payments/stripe/create-payment-intent', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Verify Stripe payment
  verifyStripePayment: async (paymentData) => {
    try {
      const response = await api.post('/payments/stripe/verify', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Process payment with PayPal
  processPayPalPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments/paypal/create-order', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Verify PayPal payment
  verifyPayPalPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments/paypal/verify', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update payment
  updatePayment: async (id, paymentData) => {
    try {
      const response = await api.put(`/payments/${id}`, paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete payment
  deletePayment: async (id) => {
    try {
      const response = await api.delete(`/payments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Verify payment
  verifyPayment: async (id, verificationData) => {
    try {
      const response = await api.post(`/payments/${id}/verify`, verificationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Refund payment
  refundPayment: async (id, refundData) => {
    try {
      const response = await api.post(`/payments/${id}/refund`, refundData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get payment statistics
  getPaymentStats: async () => {
    try {
      const response = await api.get('/payments/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get payment analytics
  getPaymentAnalytics: async (params = {}) => {
    try {
      const response = await api.get('/payments/analytics', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Export payments
  exportPayments: async (params = {}) => {
    try {
      const response = await api.get('/payments/export', { 
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get payment methods
  getPaymentMethods: async () => {
    try {
      const response = await api.get('/payments/methods');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create payment receipt
  createPaymentReceipt: async (paymentId) => {
    try {
      const response = await api.get(`/payments/${paymentId}/receipt`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default paymentService;