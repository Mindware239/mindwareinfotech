import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import './ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { forgotPassword } = useAuth();
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await forgotPassword(email);
      setMessage('Password reset instructions have been sent to your email address.');
      showNotification('Password reset email sent successfully!', 'success');
    } catch (error) {
      setMessage(error.message || 'Failed to send password reset email. Please try again.');
      showNotification('Failed to send password reset email', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-header">
          <h1>Forgot Password?</h1>
          <p>Enter your email address and we'll send you instructions to reset your password.</p>
        </div>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Sending...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i>
                Send Reset Instructions
              </>
            )}
          </button>
        </form>

        {message && (
          <div className={`message ${message.includes('sent') ? 'success' : 'error'}`}>
            <i className={`fas ${message.includes('sent') ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {message}
          </div>
        )}

        <div className="forgot-password-footer">
          <p>
            Remember your password?{' '}
            <Link to="/login" className="link">
              <i className="fas fa-sign-in-alt"></i>
              Back to Login
            </Link>
          </p>
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="link">
              <i className="fas fa-user-plus"></i>
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
