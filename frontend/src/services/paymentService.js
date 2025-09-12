import api from './api';

const paymentService = {
  // Create payment order
  createPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error.response?.data || error;
    }
  },

  // Verify payment
  verifyPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments/verify', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error.response?.data || error;
    }
  },

  // Get payment details
  getPayment: async (paymentId) => {
    try {
      const response = await api.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw error.response?.data || error;
    }
  },

  // Get user's payments
  getMyPayments: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.status) queryParams.append('status', params.status);
      
      const response = await api.get(`/payments/my?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error.response?.data || error;
    }
  },

  // Process Razorpay payment (mock implementation)
  processRazorpayPayment: async (paymentData) => {
    try {
      // This would integrate with Razorpay SDK
      // For now, we'll simulate a successful payment
      console.log('Processing Razorpay payment:', paymentData);
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful payment response
      return {
        success: true,
        data: {
          payment_id: `pay_${Date.now()}`,
          order_id: paymentData.order_id,
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: 'completed',
          signature: 'mock_signature_' + Date.now()
        }
      };
    } catch (error) {
      console.error('Error processing Razorpay payment:', error);
      throw error;
    }
  },

  // Process Stripe payment (mock implementation)
  processStripePayment: async (paymentData) => {
    try {
      // This would integrate with Stripe SDK
      // For now, we'll simulate a successful payment
      console.log('Processing Stripe payment:', paymentData);
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful payment response
      return {
        success: true,
        data: {
          payment_intent_id: `pi_${Date.now()}`,
          client_secret: 'mock_client_secret_' + Date.now(),
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: 'succeeded'
        }
      };
    } catch (error) {
      console.error('Error processing Stripe payment:', error);
      throw error;
    }
  }
};

export default paymentService;