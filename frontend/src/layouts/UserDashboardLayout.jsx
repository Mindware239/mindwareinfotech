import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './UserDashboardLayout.css';

const UserDashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="user-dashboard-layout">
      {/* Sidebar */}
      <aside className="user-sidebar">
        <div className="user-logo">
          <i className="fas fa-graduation-cap"></i>
          <h2>Mindware User</h2>
        </div>
        
        <nav className="user-nav-menu">
          <Link to="/user-dashboard" className="nav-item">
            <i className="fas fa-tachometer-alt"></i>
            Dashboard
          </Link>
          <Link to="/user-dashboard/courses" className="nav-item">
            <i className="fas fa-book"></i>
            My Courses
          </Link>
          <Link to="/user-dashboard/trainings" className="nav-item">
            <i className="fas fa-graduation-cap"></i>
            Trainings
          </Link>
          <Link to="/user-dashboard/internships" className="nav-item">
            <i className="fas fa-briefcase"></i>
            Internships
          </Link>
          <Link to="/user-dashboard/payments" className="nav-item">
            <i className="fas fa-credit-card"></i>
            Payments
          </Link>
          <Link to="/user-dashboard/certificates" className="nav-item">
            <i className="fas fa-certificate"></i>
            Certificates
          </Link>
          <Link to="/user-dashboard/profile" className="nav-item">
            <i className="fas fa-user"></i>
            Profile
          </Link>
        </nav>

        <div className="user-profile-section">
          <div className="user-info">
            <i className="fas fa-user-circle"></i>
            <div>
              <div className="user-name">{user?.firstName || user?.name || 'User'}</div>
              <div className="user-role">Student</div>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="user-main-content">
        <header className="user-top-header">
          <h1>User Dashboard</h1>
          <div className="user-welcome">
            Welcome back, {user?.firstName || user?.name || 'Student'}!
          </div>
        </header>
        
        <main className="user-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
