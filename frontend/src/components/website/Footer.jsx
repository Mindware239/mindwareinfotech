import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: '/about', label: 'About Us' },
    { path: '/training-internships', label: 'Training' },
    { path: '/careers', label: 'Careers' },
    { path: '/blog', label: 'Blog' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/contact', label: 'Contact' }
  ];

  const services = [
    { path: '/training-internships', label: 'Web Development' },
    { path: '/training-internships', label: 'Mobile App Development' },
    { path: '/training-internships', label: 'Data Science' },
    { path: '/training-internships', label: 'Machine Learning' },
    { path: '/training-internships', label: 'Python Programming' },
    { path: '/training-internships', label: 'React.js Training' }
  ];

  const supportLinks = [
    { path: '/faq', label: 'FAQ' },
    { path: '/privacy-policy', label: 'Privacy Policy' },
    { path: '/terms', label: 'Terms & Conditions' },
    { path: '/contact', label: 'Support' }
  ];

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-content">
            {/* Company Info */}
            <div className="footer-brand">
              <div className="footer-logo">
                <img src="/mindware-logo.png" alt="Mindware Infotech" className="footer-logo-img" />
                <div className="footer-logo-text">
                  <span className="footer-logo-main">MINDWARE</span>
                  <span className="footer-logo-sub">INFOTECH</span>
                </div>
              </div>
              <p className="footer-description">
                Redefining Technology with Human Touch. We provide comprehensive training 
                and internship programs in cutting-edge technologies to help you build 
                a successful career in IT.
              </p>
              <div className="social-links">
                <a href="https://facebook.com/mindwareinfotech" target="_blank" rel="noopener noreferrer" className="social-link">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://twitter.com/mindwareinfotech" target="_blank" rel="noopener noreferrer" className="social-link">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://linkedin.com/company/mindwareinfotech" target="_blank" rel="noopener noreferrer" className="social-link">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="https://instagram.com/mindwareinfotech" target="_blank" rel="noopener noreferrer" className="social-link">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://youtube.com/mindwareinfotech" target="_blank" rel="noopener noreferrer" className="social-link">
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

            {/* Contact Info */}
            <div className="footer-section">
              <h3 className="footer-title">Contact Info</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="contact-details">
                    <h4>Office Address</h4>
                    <p>Mindware, S-4, Pankaj Plaza, Pocket-7, Plot-7, Near Metro Station, Dwarka Sector-12, New Delhi-110078, India</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="contact-details">
                    <h4>Contact Numbers</h4>
                    <p>+91-9717122688 | +91-8527522688</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="contact-details">
                    <h4>Email Address</h4>
                    <p>info@mindwareinfotech.com</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="contact-details">
                    <h4>Working Hours</h4>
                    <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; {currentYear} Mindware Infotech. All rights reserved.</p>
            </div>
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