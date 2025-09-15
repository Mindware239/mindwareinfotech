import React, { useState, useEffect } from 'react';
import paymentService from '../../services/paymentService';
import './PaymentModal.css';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  paymentData, 
  onSuccess, 
  onError 
}) => {
  const [selectedMethod, setSelectedMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchPaymentMethods();
    }
  }, [isOpen]);

  const fetchPaymentMethods = async () => {
    try {
      const response = await paymentService.getPaymentMethods();
      setPaymentMethods(response.data || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const handlePayment = async () => {
    if (!paymentData) {
      onError('Payment data is required');
      return;
    }

    setLoading(true);
    try {
      let response;
      
      switch (selectedMethod) {
        case 'razorpay':
          response = await processRazorpayPayment();
          break;
        case 'stripe':
          response = await processStripePayment();
          break;
        case 'paypal':
          response = await processPayPalPayment();
          break;
        default:
          throw new Error('Invalid payment method');
      }

      if (response.success) {
        onSuccess(response.data);
      } else {
        onError(response.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      onError(error.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  const processRazorpayPayment = async () => {
    // Create Razorpay order
    const orderResponse = await paymentService.processRazorpayPayment({
      amount: paymentData.amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        enrollment_id: paymentData.enrollmentId,
        course_name: paymentData.courseName
      }
    });

    if (!orderResponse.success) {
      throw new Error(orderResponse.message);
    }

    // Initialize Razorpay
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderResponse.data.amount,
      currency: orderResponse.data.currency,
      name: 'Mindware India',
      description: paymentData.courseName,
      order_id: orderResponse.data.id,
      handler: async (response) => {
        try {
          // Verify payment
          const verifyResponse = await paymentService.verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            enrollment_id: paymentData.enrollmentId
          });

          if (verifyResponse.success) {
            onSuccess(verifyResponse.data);
          } else {
            onError(verifyResponse.message);
          }
        } catch (error) {
          onError('Payment verification failed');
        }
      },
      prefill: {
        name: paymentData.studentName,
        email: paymentData.studentEmail,
        contact: paymentData.studentPhone
      },
      theme: {
        color: '#667eea'
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();

    return { success: true, data: orderResponse.data };
  };

  const processStripePayment = async () => {
    // Create Stripe payment intent
    const response = await paymentService.processStripePayment({
      amount: paymentData.amount * 100, // Convert to cents
      currency: 'inr',
      metadata: {
        enrollment_id: paymentData.enrollmentId,
        course_name: paymentData.courseName
      }
    });

    if (!response.success) {
      throw new Error(response.message);
    }

    // Initialize Stripe
    const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    
    const { error } = await stripe.confirmCardPayment(response.data.client_secret, {
      payment_method: {
        card: {
          number: '4242424242424242', // Test card
          exp_month: 12,
          exp_year: 2025,
          cvc: '123'
        },
        billing_details: {
          name: paymentData.studentName,
          email: paymentData.studentEmail
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    // Verify payment
    const verifyResponse = await paymentService.verifyStripePayment({
      payment_intent_id: response.data.id,
      enrollment_id: paymentData.enrollmentId
    });

    return verifyResponse;
  };

  const processPayPalPayment = async () => {
    // Create PayPal order
    const response = await paymentService.processPayPalPayment({
      amount: paymentData.amount,
      currency: 'INR',
      enrollment_id: paymentData.enrollmentId,
      course_name: paymentData.courseName
    });

    if (!response.success) {
      throw new Error(response.message);
    }

    // Initialize PayPal
    window.paypal.Buttons({
      createOrder: () => response.data.id,
      onApprove: async (data) => {
        try {
          const verifyResponse = await paymentService.verifyPayPalPayment({
            order_id: data.orderID,
            enrollment_id: paymentData.enrollmentId
          });

          if (verifyResponse.success) {
            onSuccess(verifyResponse.data);
          } else {
            onError(verifyResponse.message);
          }
        } catch (error) {
          onError('Payment verification failed');
        }
      },
      onError: (error) => {
        onError(error.message || 'PayPal payment failed');
      }
    }).render('#paypal-button-container');

    return { success: true, data: response.data };
  };

  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="payment-modal-header">
          <h2>Complete Payment</h2>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="payment-modal-content">
          <div className="payment-summary">
            <h3>Payment Summary</h3>
            <div className="summary-item">
              <span>Course:</span>
              <span>{paymentData?.courseName}</span>
            </div>
            <div className="summary-item">
              <span>Amount:</span>
              <span>₹{paymentData?.amount}</span>
            </div>
            <div className="summary-item total">
              <span>Total:</span>
              <span>₹{paymentData?.amount}</span>
            </div>
          </div>

          <div className="payment-methods">
            <h3>Select Payment Method</h3>
            <div className="method-options">
              {paymentMethods.map((method) => (
                <label key={method.id} className="method-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                  />
                  <div className="method-info">
                    <i className={`fab ${method.icon}`}></i>
                    <span>{method.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="payment-actions">
            <button 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-credit-card"></i>
                  Pay ₹{paymentData?.amount}
                </>
              )}
            </button>
          </div>

          {/* PayPal Button Container */}
          {selectedMethod === 'paypal' && (
            <div id="paypal-button-container" className="paypal-container"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
