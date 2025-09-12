import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import bannerService from '../../services/bannerService';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Fetch active banner
  const { data: banner } = useQuery({
    queryKey: ['banner', 'header'],
    queryFn: () => bannerService.getBanners({ position: 'header', status: 'active', limit: 1 }),
    select: (data) => data?.banners?.[0] || null
  });

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
    { path: '/software-services', label: 'Services', icon: '💻', hasDropdown: true },
    { path: '/training-internships', label: 'Training', icon: '🎓', hasDropdown: true, active: true },
    { path: '/careers', label: 'Careers', icon: '👥' },
    { path: '/blog', label: 'Blog', icon: '📰' },
    { path: '/about', label: 'About', icon: 'ℹ️' },
    { path: '/contact', label: 'Contact', icon: '📞' }
  ];

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      {/* Top Contact Bar */}
      <div className="top-contact-bar">
        <div className="container">
          <div className="top-bar-content">
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div className="contact-details">
                  <span className="contact-label">Development</span>
                  <span className="contact-value">+91-9717122688</span>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">🎓</div>
                <div className="contact-details">
                  <span className="contact-label">Training</span>
                  <span className="contact-value">+91-8527522688</span>
                </div>
              </div>
            </div>
            <div className="top-bar-actions">
              <a href="mailto:info@mindwareindia.com" className="email-link">
                <span className="email-icon">✉️</span>
                <span className="email-text">info@mindwareindia.com</span>
              </a>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Banner */}
      {banner && (
        <div className="professional-banner">
          <div className="container">
            <div className="banner-content">
              <div className="banner-text">
                <h3>{banner.title}</h3>
                <p>{banner.description}</p>
              </div>
              {banner.button_text && banner.button_url && (
                <a href={banner.button_url} className="banner-button">
                  {banner.button_text}
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="main-header">
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            <Link to="/" className="logo" onClick={closeMenu}>
              <div className="logo-container">
                <div className="logo-image">
                  <img src="/mindware-logo.png" alt="Mindware India" className="logo-img" />
                </div>
                {/* <div className="logo-text">
                  <div className="logo-main">
                    MINDWARE<span className="logo-tm">™</span>
                  </div>
                  <div className="logo-tagline">Redefining Technology with Human Touch</div>
                </div> */}
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
                    <span className="nav-icon">💻</span>
                    <span className="nav-text">Services</span>
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
                    <span className="nav-text">Training</span>
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
                            <li><Link to="/video-lectures">Video Lectures</Link></li>
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
                    <span className="nav-text">Careers</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/blog" className="nav-link">
                    <span className="nav-icon">📰</span>
                    <span className="nav-text">Blog</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/about" className="nav-link">
                    <span className="nav-icon">ℹ️</span>
                    <span className="nav-text">About</span>
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
