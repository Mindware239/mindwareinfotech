import React, { useState, useEffect } from 'react';
import StatsCard from '../../components/admin/StatsCard';
import Chart from '../../components/admin/Chart';
import RecentActivity from '../../components/admin/RecentActivity';
import QuickActions from '../../components/admin/QuickActions';
import adminService from '../../services/adminService';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboardStats();
      setStats(response.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-content">
          <i className="fas fa-exclamation-triangle"></i>
          <h3>Error Loading Dashboard</h3>
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const statsData = stats ? {
    totalStudents: stats.stats?.totalUsers || 0,
    totalInternships: stats.stats?.totalInternships || 0,
    totalCourses: stats.stats?.totalBlogs || 0,
    totalRevenue: stats.stats?.totalTestimonials || 0,
    monthlyGrowth: {
      students: 12.5,
      revenue: 8.3,
      courses: 15.2,
      applications: 22.1
    }
  } : {
    totalStudents: 1250,
    totalInternships: 45,
    totalCourses: 28,
    totalRevenue: 1250000,
    monthlyGrowth: {
      students: 12.5,
      revenue: 8.3,
      courses: 15.2,
      applications: 22.1
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome to your admin dashboard. Here's what's happening with your platform.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          title="Total Students"
          value={statsData.totalStudents}
          change={statsData.monthlyGrowth.students}
          icon="fas fa-user-graduate"
          color="primary"
          format="number"
        />
        <StatsCard
          title="Active Internships"
          value={statsData.totalInternships}
          change={statsData.monthlyGrowth.applications}
          icon="fas fa-briefcase"
          color="success"
          format="number"
        />
        <StatsCard
          title="Total Courses"
          value={statsData.totalCourses}
          change={statsData.monthlyGrowth.courses}
          icon="fas fa-play-circle"
          color="info"
          format="number"
        />
        <StatsCard
          title="Total Revenue"
          value={statsData.totalRevenue}
          change={statsData.monthlyGrowth.revenue}
          icon="fas fa-rupee-sign"
          color="warning"
          format="currency"
        />
      </div>

      {/* Charts and Analytics */}
      <div className="dashboard-content">
        <div className="charts-section">
          <div className="chart-container">
            <Chart
              title="Student Growth"
              type="line"
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                  label: 'New Students',
                  data: [65, 78, 90, 81, 96, 105],
                  borderColor: '#667eea',
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  tension: 0.4
                }]
              }}
            />
          </div>
          <div className="chart-container">
            <Chart
              title="Revenue by Month"
              type="bar"
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                  label: 'Revenue (₹)',
                  data: [120000, 150000, 180000, 160000, 200000, 220000],
                  backgroundColor: '#43e97b',
                  borderColor: '#27ae60',
                  borderWidth: 1
                }]
              }}
            />
          </div>
        </div>

        <div className="dashboard-sidebar">
          <RecentActivity />
          <QuickActions />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="quick-stat">
          <div className="quick-stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="quick-stat-content">
            <h4>Pending Applications</h4>
            <p>23 applications need review</p>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat-icon">
            <i className="fas fa-envelope"></i>
          </div>
          <div className="quick-stat-content">
            <h4>Unread Messages</h4>
            <p>7 new messages from students</p>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="quick-stat-content">
            <h4>System Alerts</h4>
            <p>2 system maintenance alerts</p>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat-icon">
            <i className="fas fa-calendar"></i>
          </div>
          <div className="quick-stat-content">
            <h4>Upcoming Events</h4>
            <p>3 events scheduled this week</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
