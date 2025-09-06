import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: '/about', label: 'About Us' },
    { path: '/internships', label: 'Internships' },
    { path: '/resume-services', label: 'Resume Services' },
    { path: '/careers', label: 'Careers' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/blog', label: 'Blog' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/contact', label: 'Contact' }
  ];

  const services = [
    { path: '/internships', label: 'Web Development Internship' },
    { path: '/internships', label: 'Mobile App Development' },
    { path: '/internships', label: 'Data Science Training' },
    { path: '/internships', label: 'Machine Learning Course' },
    { path: '/internships', label: 'Python Programming' },
    { path: '/internships', label: 'Java Development' },
    { path: '/internships', label: 'React.js Training' },
    { path: '/internships', label: 'Node.js Development' }
  ];

  const supportLinks = [
    { path: '/faq', label: 'FAQ' },
    { path: '/privacy-policy', label: 'Privacy Policy' },
    { path: '/terms', label: 'Terms & Conditions' },
    { path: '/contact', label: 'Support' },
    { path: '/video-lectures', label: 'Video Lectures' },
    { path: '/certificate', label: 'Certificate Verification' }
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-logo">
              <img src="/images/logo.png" alt="Mindware India" className="footer-logo-img" />
              <div className="footer-logo-text">
                <span className="footer-logo-main">MINDWARE</span>
                <span className="footer-logo-sub">INDIA</span>
              </div>
            </div>
            <p className="footer-description">
              Redefining Technology with Human Touch. We provide comprehensive training 
              and internship programs in cutting-edge technologies to help you build 
              a successful career in IT.
            </p>
            <div className="social-links">
              <a href="https://facebook.com/mindwareindia" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com/mindwareindia" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://linkedin.com/company/mindwareindia" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://instagram.com/mindwareindia" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://youtube.com/mindwareindia" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              {quickLinks.map((link) => (
                <li key={link.path} className="footer-link-item">
                  <Link to={link.path} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h3 className="footer-title">Our Services</h3>
            <ul className="footer-links">
              {services.map((service, index) => (
                <li key={index} className="footer-link-item">
                  <Link to={service.path} className="footer-link">
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h3 className="footer-title">Support</h3>
            <ul className="footer-links">
              {supportLinks.map((link) => (
                <li key={link.path} className="footer-link-item">
                  <Link to={link.path} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3 className="footer-title">Contact Info</h3>
            <div className="contact-info">
              <div className="contact-item address-item">
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="contact-details">
                  <h4>OFFICE ADDRESS</h4>
                  <p>Mindware, S-4, Pankaj Plaza, Pocket-7, Plot-7 ,Near Metro Station,
                  Dwarka Sector-12 Metro Pillar No-1030, New Delhi-110078, India</p>
                </div>
              </div>
              <div className="contact-item phone-item">
                <div className="contact-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <div className="contact-details">
                  <h4>CONTACT NUMBERS</h4>
                  <p>+91-9717122688 | +91-8527522688<br/>Landline: 011-28032434 | 011-46102688</p>
                </div>
              </div>
              <div className="contact-item email-item">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-details">
                  <h4>EMAIL ADDRESS</h4>
                  <p>info@mindwareindia.com<br/>training@mindwareindia.com</p>
                </div>
              </div>
              <div className="contact-item hours-item">
                <div className="contact-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="contact-details">
                  <h4>WORKING HOURS</h4>
                  <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3>Stay Updated</h3>
              <p>Subscribe to our newsletter for latest updates and offers</p>
            </div>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address"
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} Mindware India. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <Link to="/privacy-policy" className="footer-bottom-link">Privacy Policy</Link>
              <Link to="/terms" className="footer-bottom-link">Terms of Service</Link>
              <Link to="/contact" className="footer-bottom-link">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
