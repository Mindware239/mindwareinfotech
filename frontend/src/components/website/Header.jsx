import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const handleMegaMenuHover = (menuType) => {
    setActiveMegaMenu(menuType);
  };

  const handleMegaMenuLeave = () => {
    setActiveMegaMenu(null);
  };

  const navItems = [
    { path: '/software-services', label: 'SOFTWARE SERVICES', icon: '</>', hasDropdown: true },
    { path: '/training-internships', label: 'TRAINING & INTERNSHIPS', icon: '🎓', hasDropdown: true, active: true },
    { path: '/careers', label: 'CAREERS', icon: '👥' },
    { path: '/blog', label: 'BLOG & NEWS', icon: '📰' },
    { path: '/about', label: 'ABOUT US', icon: 'ℹ️' },
    { path: '/contact', label: 'CONTACT US', icon: '📞' }
  ];

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      {/* Top Contact Bar */}
      <div className="top-contact-bar">
        <div className="container">
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-label">Software Development</span>
              <span className="contact-phone">+91-9717122688</span>
              <span className="contact-email">info@mindwareindia.com</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Training & Internships</span>
              <span className="contact-phone">+91-8527522688</span>
              <span className="contact-email">training@mindwareindia.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="main-header">
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            <Link to="/" className="logo" onClick={closeMenu}>
              <div className="logo-image">
                <img src="/mindware-logo.png" alt="Mindware India" className="logo-img" />
              </div>
             
            </Link>

            {/* Desktop Navigation */}
            <nav className="nav-desktop">
              <ul className="nav-list">
                {/* Software Services with Mega Menu */}
                <li 
                  className="nav-item mega-menu-item"
                  onMouseEnter={() => handleMegaMenuHover('services')}
                  onMouseLeave={handleMegaMenuLeave}
                >
                  <Link to="/software-services" className="nav-link">
                    <span className="nav-icon"></span>
                    <span className="nav-text">SOFTWARE SERVICES</span>
                    <span className="nav-arrow">▼</span>
                  </Link>
                  
                  {/* Services Mega Menu */}
                  {activeMegaMenu === 'services' && (
                    <div className="mega-menu">
                      <div className="mega-menu-content">
                        <div className="mega-menu-column">
                          <h3>Web Development</h3>
                          <ul>
                            <li><Link to="/web-development">Custom Web Applications</Link></li>
                            <li><Link to="/ecommerce">E-commerce Solutions</Link></li>
                            <li><Link to="/cms">Content Management Systems</Link></li>
                            <li><Link to="/api">API Development</Link></li>
                          </ul>
                        </div>
                        <div className="mega-menu-column">
                          <h3>Mobile Development</h3>
                          <ul>
                            <li><Link to="/ios">iOS Applications</Link></li>
                            <li><Link to="/android">Android Applications</Link></li>
                            <li><Link to="/hybrid">Hybrid Apps</Link></li>
                            <li><Link to="/pwa">Progressive Web Apps</Link></li>
                          </ul>
                        </div>
                        <div className="mega-menu-column">
                          <h3>Enterprise Solutions</h3>
                          <ul>
                            <li><Link to="/erp">ERP Systems</Link></li>
                            <li><Link to="/crm">CRM Solutions</Link></li>
                            <li><Link to="/cloud">Cloud Migration</Link></li>
                            <li><Link to="/integration">System Integration</Link></li>
                          </ul>
                        </div>
                        <div className="mega-menu-column">
                          <h3>Technologies</h3>
                          <ul>
                            <li><Link to="/react">React & Node.js</Link></li>
                            <li><Link to="/python">Python & Django</Link></li>
                            <li><Link to="/php">PHP & Laravel</Link></li>
                            <li><Link to="/dotnet">.NET & C#</Link></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </li>

                {/* Training & Internships with Mega Menu */}
                <li 
                  className="nav-item mega-menu-item"
                  onMouseEnter={() => handleMegaMenuHover('training')}
                  onMouseLeave={handleMegaMenuLeave}
                >
                  <Link to="/training-internships" className="nav-link highlighted">
                    <span className="nav-icon">🎓</span>
                    <span className="nav-text">TRAINING & INTERNSHIPS</span>
                    <span className="nav-arrow">▼</span>
                  </Link>
                  
                  {/* Training Mega Menu */}
                  {activeMegaMenu === 'training' && (
                    <div className="mega-menu">
                      <div className="mega-menu-content">
                        <div className="mega-menu-column">
                          <h3>Training Programs</h3>
                          <ul>
                            <li><Link to="/web-training">Web Development</Link></li>
                            <li><Link to="/mobile-training">Mobile App Development</Link></li>
                            <li><Link to="/data-science">Data Science & AI</Link></li>
                            <li><Link to="/cloud-training">Cloud Computing</Link></li>
                          </ul>
                        </div>
                        <div className="mega-menu-column">
                          <h3>Internship Programs</h3>
                          <ul>
                            <li><Link to="/summer-internship">Summer Internship</Link></li>
                            <li><Link to="/winter-internship">Winter Internship</Link></li>
                            <li><Link to="/project-internship">Project-based Internship</Link></li>
                            <li><Link to="/research-internship">Research Internship</Link></li>
                          </ul>
                        </div>
                        <div className="mega-menu-column">
                          <h3>Certifications</h3>
                          <ul>
                            <li><Link to="/microsoft">Microsoft Certifications</Link></li>
                            <li><Link to="/aws">AWS Certifications</Link></li>
                            <li><Link to="/google">Google Certifications</Link></li>
                            <li><Link to="/oracle">Oracle Certifications</Link></li>
                          </ul>
                        </div>
                        <div className="mega-menu-column">
                          <h3>Career Support</h3>
                          <ul>
                            <li><Link to="/resume-building">Resume Building</Link></li>
                            <li><Link to="/interview-prep">Interview Preparation</Link></li>
                            <li><Link to="/job-placement">Job Placement</Link></li>
                            <li><Link to="/mentorship">Mentorship Program</Link></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </li>

                {/* Other Navigation Items */}
                <li className="nav-item">
                  <Link to="/careers" className="nav-link">
                    <span className="nav-icon">👥</span>
                    <span className="nav-text">CAREERS</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/blog" className="nav-link">
                    <span className="nav-icon">📰</span>
                    <span className="nav-text">BLOG & NEWS</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/about" className="nav-link">
                    <span className="nav-icon">ℹ️</span>
                    <span className="nav-text">ABOUT US</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/contact" className="nav-link">
                    <span className="nav-icon">📞</span>
                    <span className="nav-text">CONTACT US</span>
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className={`nav-mobile ${isMenuOpen ? 'active' : ''}`}>
        <ul className="nav-list-mobile">
          {navItems.map((item) => (
            <li key={item.path} className="nav-item-mobile">
              <Link
                to={item.path}
                className={`nav-link-mobile ${location.pathname === item.path ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
                {item.hasDropdown && <span className="nav-arrow">▼</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
