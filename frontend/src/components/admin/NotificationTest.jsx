import React, { useState } from 'react';
import './NotificationTest.css';

const NotificationTest = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    courseName: 'Test Course',
    message: 'Hello! This is a test message from Mindware Infotech.'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const testWhatsApp = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/notifications/test-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formData.phone,
          message: formData.message
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Error: ' + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const testEnrollment = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/notifications/test-enrollment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          courseName: formData.courseName
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Error: ' + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/notifications/status');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Error: ' + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notification-test">
      <div className="test-header">
        <h2>🔔 Notification Test Panel</h2>
        <p>Test WhatsApp and Email notifications for enrollments</p>
      </div>

      <div className="test-form">
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter student name"
            required
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            required
          />
        </div>

        <div className="form-group">
          <label>Phone * (with country code)</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+919876543210"
            required
          />
        </div>

        <div className="form-group">
          <label>Course Name</label>
          <input
            type="text"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            placeholder="Enter course name"
          />
        </div>

        <div className="form-group">
          <label>Test Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Enter test message"
            rows="3"
          />
        </div>

        <div className="test-buttons">
          <button 
            onClick={checkStatus} 
            disabled={loading}
            className="btn btn-info"
          >
            {loading ? 'Checking...' : 'Check Status'}
          </button>

          <button 
            onClick={testWhatsApp} 
            disabled={loading || !formData.phone || !formData.message}
            className="btn btn-whatsapp"
          >
            {loading ? 'Sending...' : 'Test WhatsApp'}
          </button>

          <button 
            onClick={testEnrollment} 
            disabled={loading || !formData.name || !formData.email || !formData.phone}
            className="btn btn-primary"
          >
            {loading ? 'Sending...' : 'Test Enrollment Notification'}
          </button>
        </div>
      </div>

      {result && (
        <div className={`result ${result.success ? 'success' : 'error'}`}>
          <h3>{result.success ? '✅ Success' : '❌ Error'}</h3>
          <p>{result.message}</p>
          {result.data && (
            <pre>{JSON.stringify(result.data, null, 2)}</pre>
          )}
        </div>
      )}

      <div className="setup-info">
        <h3>📋 Setup Instructions</h3>
        <ol>
          <li>Configure WhatsApp API credentials in backend/.env</li>
          <li>Set up email SMTP settings for Gmail</li>
          <li>Add your admin WhatsApp number</li>
          <li>Test the notifications using this panel</li>
        </ol>
        
        <div className="api-info">
          <h4>Free WhatsApp API Options:</h4>
          <ul>
            <li><strong>Green API:</strong> 100 messages/day free</li>
            <li><strong>Twilio:</strong> $15 free credit</li>
            <li><strong>WhatsApp Web:</strong> Completely free</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotificationTest;
