import api from './api';

const paymentService = {
  // Create payment
  createPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments/create', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Verify payment
  verifyPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments/verify', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get my payments
  getMyPayments: async (params = {}) => {
    try {
      const response = await api.get('/payments/my-payments', { params });
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

  // Get all payments (Admin only)
  getPayments: async (params = {}) => {
    try {
      const response = await api.get('/payments', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Process refund (Admin only)
  refundPayment: async (id, refundData) => {
    try {
      const response = await api.post(`/payments/${id}/refund`, refundData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default paymentService;
