import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminHeader.css';

const AdminHeader = ({ onMenuClick, user }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { logout } = useAuth();

  const notifications = [
    {
      id: 1,
      title: 'New Student Application',
      message: 'John Doe applied for Web Development internship',
      time: '2 minutes ago',
      type: 'info',
      unread: true
    },
    {
      id: 2,
      title: 'Payment Received',
      message: 'Payment of ₹15,000 received from Jane Smith',
      time: '1 hour ago',
      type: 'success',
      unread: true
    },
    {
      id: 3,
      title: 'Course Completed',
      message: 'Mike Johnson completed React Development course',
      time: '3 hours ago',
      type: 'success',
      unread: false
    },
    {
      id: 4,
      title: 'System Update',
      message: 'System maintenance scheduled for tonight',
      time: '1 day ago',
      type: 'warning',
      unread: false
    }
  ];

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="admin-header">
      <div className="header-left">
        <button className="menu-btn" onClick={onMenuClick}>
          <i className="fas fa-bars"></i>
        </button>
        
        <div className="header-title">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user?.name || 'Admin'}!</p>
        </div>
      </div>

      <div className="header-right">
        {/* Search */}
        <div className="header-search">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Search..." 
            className="search-input"
          />
        </div>

        {/* Notifications */}
        <div className="header-notifications">
          <button 
            className="notification-btn"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <i className="fas fa-bell"></i>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          
          {notificationsOpen && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h3>Notifications</h3>
                <button 
                  className="mark-all-read"
                  onClick={() => setNotificationsOpen(false)}
                >
                  Mark all read
                </button>
              </div>
              <div className="notification-list">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.unread ? 'unread' : ''}`}
                  >
                    <div className={`notification-icon ${notification.type}`}>
                      <i className={`fas fa-${getNotificationIcon(notification.type)}`}></i>
                    </div>
                    <div className="notification-content">
                      <div className="notification-title">{notification.title}</div>
                      <div className="notification-message">{notification.message}</div>
                      <div className="notification-time">{notification.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="notification-footer">
                <a href="/admin/notifications" className="view-all">
                  View all notifications
                </a>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="header-user">
          <button 
            className="user-btn"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div className="user-avatar">
              <img 
                src={user?.avatar || '/images/avatars/default-avatar.jpg'} 
                alt={user?.name}
                onError={(e) => {
                  e.target.src = '/images/avatars/default-avatar.jpg';
                }}
              />
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name || 'Admin'}</span>
              <span className="user-role">Administrator</span>
            </div>
            <i className="fas fa-chevron-down"></i>
          </button>
          
          {userMenuOpen && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <div className="user-avatar-large">
                  <img 
                    src={user?.avatar || '/images/avatars/default-avatar.jpg'} 
                    alt={user?.name}
                    onError={(e) => {
                      e.target.src = '/images/avatars/default-avatar.jpg';
                    }}
                  />
                </div>
                <div className="user-details">
                  <div className="user-name">{user?.name || 'Admin'}</div>
                  <div className="user-email">{user?.email}</div>
                </div>
              </div>
              <div className="user-dropdown-menu">
                <a href="/admin/profile" className="dropdown-item">
                  <i className="fas fa-user"></i>
                  Profile
                </a>
                <a href="/admin/settings" className="dropdown-item">
                  <i className="fas fa-cog"></i>
                  Settings
                </a>
                <a href="/admin/help" className="dropdown-item">
                  <i className="fas fa-question-circle"></i>
                  Help & Support
                </a>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item logout">
                  <i className="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const getNotificationIcon = (type) => {
  switch (type) {
    case 'info': return 'info-circle';
    case 'success': return 'check-circle';
    case 'warning': return 'exclamation-triangle';
    case 'error': return 'times-circle';
    default: return 'bell';
  }
};

export default AdminHeader;
