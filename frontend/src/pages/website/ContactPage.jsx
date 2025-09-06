import React, { useState } from 'react';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    setSubmitted(true);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  if (submitted) {
    return (
      <div className="contact-page">
        <div className="page-hero">
          <div className="container">
            <h1>Thank You!</h1>
            <p>Your message has been sent successfully. We'll get back to you soon.</p>
          </div>
        </div>
        <div className="page-content">
          <div className="container">
            <div className="success-message">
              <i className="fas fa-check-circle"></i>
              <h2>Message Sent Successfully</h2>
              <p>We have received your message and will respond within 24 hours.</p>
              <button 
                className="btn btn-primary"
                onClick={() => setSubmitted(false)}
              >
                Send Another Message
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      {/* Social Media Sidebar */}
      <div className="social-sidebar">
        <a href="#" className="social-icon facebook">f</a>
        <a href="#" className="social-icon twitter">X</a>
        <a href="#" className="social-icon linkedin">in</a>
        <a href="#" className="social-icon email">e</a>
        <a href="#" className="social-icon share">&gt;</a>
      </div>

      {/* Main Hero Section */}
      <div className="page-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Get in touch with our expert team for software development services, internships, training programs, and career opportunities. We're here to help you succeed.</p>
        </div>
      </div>

      {/* Contact Cards Section */}
      <div className="contact-cards-section">
        <div className="container">
          <div className="contact-cards">
            <div className="contact-card">
              <div className="card-icon phone">📞</div>
              <h3>Phone</h3>
              <p>Call us for immediate assistance</p>
              <div className="contact-details">
                <a href="tel:+919717122688">+91-9717122688</a>
                <a href="tel:+919810822688">+91-9810822688</a>
              </div>
              <button className="card-btn">Call Now</button>
            </div>

            <div className="contact-card">
              <div className="card-icon email">✉️</div>
              <h3>Email</h3>
              <p>Send us an email anytime</p>
              <div className="contact-details">
                <a href="mailto:info@mindwareindia.com">info@mindwareindia.com</a>
                <a href="mailto:support@mindwareindia.com">support@mindwareindia.com</a>
              </div>
              <button className="card-btn">Email Now</button>
            </div>

            <div className="contact-card">
              <div className="card-icon address">📍</div>
              <h3>Address</h3>
              <p>Visit our office</p>
              <div className="contact-details">
                <p>MINDWARE S -4, Plot No-7, Pocket-7, Pankaj Plaza, Near Metro Station, Sector-12, Dwarka, New Delhi-110078, (India)</p>
                <a href="#" className="metro-link">Near Metro Station</a>
              </div>
              <button className="card-btn">Get Directions</button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="contact-form-section">
        <div className="container">
          <div className="form-container">
            <h2>Send us a Message</h2>
            <div className="title-underline"></div>
            
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select Subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="internship">Internship Program</option>
                  <option value="training">Training Programs</option>
                  <option value="career">Career Opportunities</option>
                  <option value="support">Technical Support</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  disabled={loading}
                  placeholder="Please describe your inquiry in detail..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="btn-spinner"></div>
                    Sending Message...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      <div className="chat-widget">
        <i className="fas fa-comments"></i>
      </div>
    </div>
  );
};

export default ContactPage;
