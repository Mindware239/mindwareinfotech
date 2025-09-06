import React from 'react';
import { Link } from 'react-router-dom';
import './QuickActions.css';

const QuickActions = () => {
  const actions = [
    {
      title: 'Add New Student',
      description: 'Register a new student',
      icon: 'fas fa-user-plus',
      color: 'primary',
      link: '/admin/students/add'
    },
    {
      title: 'Create Internship',
      description: 'Post a new internship',
      icon: 'fas fa-briefcase',
      color: 'success',
      link: '/admin/internships/add'
    },
    {
      title: 'Add Course',
      description: 'Create a new course',
      icon: 'fas fa-play-circle',
      color: 'info',
      link: '/admin/courses/add'
    },
    {
      title: 'Write Blog Post',
      description: 'Publish new content',
      icon: 'fas fa-blog',
      color: 'warning',
      link: '/admin/blogs/add'
    },
    {
      title: 'Upload Gallery',
      description: 'Add gallery images',
      icon: 'fas fa-images',
      color: 'secondary',
      link: '/admin/gallery/add'
    },
    {
      title: 'Generate Certificate',
      description: 'Create certificates',
      icon: 'fas fa-certificate',
      color: 'danger',
      link: '/admin/certificates/generate'
    }
  ];

  return (
    <div className="quick-actions">
      <div className="actions-header">
        <h3>Quick Actions</h3>
        <p>Common administrative tasks</p>
      </div>
      
      <div className="actions-grid">
        {actions.map((action, index) => (
          <Link 
            key={index} 
            to={action.link} 
            className={`action-card action-card--${action.color}`}
          >
            <div className="action-icon">
              <i className={action.icon}></i>
            </div>
            <div className="action-content">
              <h4 className="action-title">{action.title}</h4>
              <p className="action-description">{action.description}</p>
            </div>
            <div className="action-arrow">
              <i className="fas fa-arrow-right"></i>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="actions-footer">
        <Link to="/admin/settings" className="settings-link">
          <i className="fas fa-cog"></i>
          System Settings
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;
