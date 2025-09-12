import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import LoginPage from '../pages/admin/LoginPage';
import './AdminLayout.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAdmin, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Close sidebar on route change (mobile)
    setSidebarOpen(false);
  }, [location]);

  // Show loading spinner only during initial auth check
  if (authLoading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  // If not authenticated or not admin, show login page
  if (!user || !isAdmin) {
    return <LoginPage />;
  }

  // If authenticated and admin, show admin layout
  return (
    <NotificationProvider>
      <div className="admin-layout">
        <AdminSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        <div className="admin-main">
          <AdminHeader 
            onMenuClick={() => setSidebarOpen(true)}
            user={user}
          />
          
          <main className="admin-content">
            <div className="admin-content-inner">
              <Outlet />
            </div>
          </main>
        </div>
        
        {sidebarOpen && (
          <div 
            className="admin-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </NotificationProvider>
  );
};

export default AdminLayout;
