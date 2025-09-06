import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState({});

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: 'fas fa-tachometer-alt',
      exact: true
    },
    {
      title: 'Students',
      path: '/admin/students',
      icon: 'fas fa-user-graduate',
      submenu: [
        { title: 'All Students', path: '/admin/students' },
        { title: 'Enrollments', path: '/admin/enrollments' },
        { title: 'Applications', path: '/admin/students/applications' }
      ]
    },
    {
      title: 'Internships',
      path: '/admin/internships',
      icon: 'fas fa-briefcase',
      submenu: [
        { title: 'All Internships', path: '/admin/internships' },
        { title: 'Applications', path: '/admin/internships/applications' },
        { title: 'Categories', path: '/admin/internships/categories' }
      ]
    },
    {
      title: 'Content Management',
      path: '/admin/content',
      icon: 'fas fa-edit',
      submenu: [
        { title: 'Blog Posts', path: '/admin/blogs' },
        { title: 'Gallery', path: '/admin/gallery' },
        { title: 'Banners', path: '/admin/banners' },
        { title: 'Testimonials', path: '/admin/testimonials' },
        { title: 'FAQs', path: '/admin/faq' }
      ]
    },
    {
      title: 'Courses & Videos',
      path: '/admin/courses',
      icon: 'fas fa-play-circle',
      submenu: [
        { title: 'All Courses', path: '/admin/courses' },
        { title: 'Video Lectures', path: '/admin/video-lectures' },
        { title: 'Categories', path: '/admin/courses/categories' }
      ]
    },
    {
      title: 'Payments',
      path: '/admin/payments',
      icon: 'fas fa-credit-card',
      submenu: [
        { title: 'All Payments', path: '/admin/payments' },
        { title: 'Refunds', path: '/admin/payments/refunds' },
        { title: 'Reports', path: '/admin/payments/reports' }
      ]
    },
    {
      title: 'Certificates',
      path: '/admin/certificates',
      icon: 'fas fa-certificate',
      submenu: [
        { title: 'All Certificates', path: '/admin/certificates' },
        { title: 'Templates', path: '/admin/certificates/templates' },
        { title: 'Generate', path: '/admin/certificates/generate' }
      ]
    },
    {
      title: 'Users',
      path: '/admin/users',
      icon: 'fas fa-users',
      submenu: [
        { title: 'All Users', path: '/admin/users' },
        { title: 'Instructors', path: '/admin/users/instructors' },
        { title: 'Admins', path: '/admin/users/admins' }
      ]
    },
    {
      title: 'Settings',
      path: '/admin/settings',
      icon: 'fas fa-cog',
      submenu: [
        { title: 'General', path: '/admin/settings' },
        { title: 'Email', path: '/admin/settings/email' },
        { title: 'Payment', path: '/admin/settings/payment' },
        { title: 'System', path: '/admin/settings/system' }
      ]
    }
  ];

  const isActivePath = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const hasActiveSubmenu = (submenu) => {
    return submenu.some(item => location.pathname === item.path);
  };

  const toggleDropdown = (index) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <i className="fas fa-graduation-cap"></i>
          <span>Mindware Admin</span>
        </div>
        <button className="sidebar-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item, index) => (
            <li key={index} className="nav-item">
              {item.submenu ? (
                <div className={`nav-group ${hasActiveSubmenu(item.submenu) || openDropdowns[index] ? 'active' : ''}`}>
                  <div 
                    className="nav-group-header"
                    onClick={() => toggleDropdown(index)}
                  >
                    <i className={item.icon}></i>
                    <span>{item.title}</span>
                    <i className={`fas fa-chevron-down nav-arrow ${openDropdowns[index] ? 'rotated' : ''}`}></i>
                  </div>
                  <ul className={`nav-submenu ${openDropdowns[index] ? 'open' : ''}`}>
                    {item.submenu.map((subItem, subIndex) => (
                      <li key={subIndex} className="nav-subitem">
                        <NavLink
                          to={subItem.path}
                          className={({ isActive }) => 
                            `nav-sublink ${isActive ? 'active' : ''}`
                          }
                          onClick={onClose}
                        >
                          {subItem.title}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  onClick={onClose}
                >
                  <i className={item.icon}></i>
                  <span>{item.title}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">
            <i className="fas fa-user"></i>
          </div>
          <div className="user-info">
            <div className="user-name">Admin User</div>
            <div className="user-role">Administrator</div>
          </div>
        </div>
        <button className="logout-btn" onClick={() => window.location.href = '/'}>
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
