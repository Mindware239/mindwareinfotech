import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Info Column */}
          <div className="footer-column">
            <div className="footer-logo">
              <div className="logo-icon">
                <span className="logo-text">M</span>
              </div>
              <h3 className="company-name">MINDWARE INFOTECH</h3>
            </div>
            <p className="company-tagline">
              Redefining Technology with Human Touch. We provide comprehensive training and internship programs in cutting-edge technologies to help you build a successful career in IT.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="footer-column">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/about" className="footer-link">About Us</a></li>
              <li><a href="/services" className="footer-link">Services</a></li>
              <li><a href="/training" className="footer-link">Training</a></li>
              <li><a href="/blog" className="footer-link">Blog</a></li>
              <li><a href="/careers" className="footer-link">Careers</a></li>
              <li><a href="/contact" className="footer-link">Contact</a></li>
            </ul>
          </div>

          {/* Our Services Column */}
          <div className="footer-column">
            <h4 className="footer-heading">Our Services</h4>
            <ul className="footer-links">
              <li><a href="/web-development" className="footer-link">Web Development</a></li>
              <li><a href="/mobile-development" className="footer-link">Mobile App Development</a></li>
              <li><a href="/data-science" className="footer-link">Data Science</a></li>
              <li><a href="/machine-learning" className="footer-link">Machine Learning</a></li>
              <li><a href="/python-programming" className="footer-link">Python Programming</a></li>
              <li><a href="/react-training" className="footer-link">React.js Training</a></li>
            </ul>
          </div>

          {/* Contact Info Column */}
          <div className="footer-column">
            <h4 className="footer-heading">Contact Info</h4>
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="contact-details">
                  <span className="contact-label">OFFICE ADDRESS</span>
                  <p className="contact-text">
                    Mindware, S-4, Pankaj Plaza, Pocket-7, Plot-7, Near Metro Station, Dwarka Sector-12, New Delhi-110078, India
                  </p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <div className="contact-details">
                  <span className="contact-label">CONTACT NUMBERS</span>
                  <p className="contact-text">+91-9717122688 | +91-8527522688</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-details">
                  <span className="contact-label">EMAIL ADDRESS</span>
                  <p className="contact-text">gm@mindwareinfotech.com</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="contact-details">
                  <span className="contact-label">WORKING HOURS</span>
                  <p className="contact-text">Mon - Fri: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">© 2025 Mindware Infotech. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="/privacy-policy" className="bottom-link">Privacy Policy</a>
              <a href="/terms" className="bottom-link">Terms of Service</a>
              <a href="/contact" className="bottom-link">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;