import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import trainingService from '../../services/trainingService';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [trainingPrograms, setTrainingPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchTrainingData();
  }, []);

  const fetchTrainingData = async () => {
    try {
      const [programsResponse, categoriesResponse] = await Promise.all([
        trainingService.getTrainingPrograms({ limit: 20, status: 'published' }),
        trainingService.getCourseCategories()
      ]);
      
      setTrainingPrograms(programsResponse.data || []);
      setCategories(categoriesResponse || []);
    } catch (error) {
      console.error('Error fetching training data:', error);
    }
  };

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
    { path: '#', label: 'Services', icon: '💻', hasDropdown: true },
    { path: '/training-internships', label: 'Training', icon: '🎓', hasDropdown: true, active: true },
    { path: '/careers', label: 'Careers', icon: '👥' },
    { path: '/blog', label: 'Blog', icon: '📰' },
    { path: '/about', label: 'About', icon: 'ℹ️' },
    { path: '/contact', label: 'Contact', icon: '📞' }
  ];

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      {/* Main Header */}
      <div className="main-header">
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            <Link to="/" className="logo" onClick={closeMenu}>
              <div className="logo-container">
                <div className="logo-image">
                  <img src="/mindware-logo.png" alt="Mindware Infotech" className="logo-img" />
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
                  <Link to="#" className="nav-link">
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
                  <Link to="#" className="nav-link highlighted">
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
                            <li><Link to="/training-programs">All Programs ({trainingPrograms.length})</Link></li>
                            {categories.slice(0, 6).map(category => (
                              <li key={category.id}>
                                <Link to={`/training-programs?category=${category.slug}`}>
                                  {category.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mega-menu-column">
                          <h3>Featured Programs</h3>
                          <ul>
                            {trainingPrograms.filter(program => program.is_featured).slice(0, 5).map(program => (
                              <li key={program.id}>
                                <Link to={`/training/${program.slug}`}>
                                  {program.title}
                                </Link>
                              </li>
                            ))}
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

                {/* Regular Navigation Items */}
                <li className="nav-item">
                  <Link to="/careers" className="nav-link">
                    <span className="nav-icon">👥</span>
                    <span className="nav-text">Careers</span>
                  </Link>
                </li>

                
              </ul>
            </nav>

            {/* Login/Register Buttons */}
            <div className="header-actions">
              {user ? (
                <div className="user-menu">
                  <span className="user-name">Welcome, {user.firstName || user.name || 'User'}</span>
                  <div className="user-actions">
                    <Link to="/user-dashboard" className="btn btn-primary btn-sm">
                      <i className="fas fa-tachometer-alt"></i> Dashboard
                    </Link>
                    <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                      <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login" className="btn btn-outline btn-sm">
                    <i className="fas fa-sign-in-alt"></i> Login
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-sm">
                    <i className="fas fa-user-plus"></i> Register
                  </Link>
                </div>
              )}
            </div>

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
