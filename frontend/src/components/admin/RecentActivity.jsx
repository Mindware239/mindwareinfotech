import React, { useState, useEffect } from 'react';
import './RecentActivity.css';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockActivities = [
        {
          id: 1,
          type: 'student_registration',
          title: 'New Student Registration',
          description: 'John Doe registered for Web Development course',
          time: '2 minutes ago',
          user: 'John Doe',
          avatar: '/images/avatars/john-doe.jpg',
          status: 'success'
        },
        {
          id: 2,
          type: 'payment_received',
          title: 'Payment Received',
          description: 'Payment of ₹15,000 received from Jane Smith',
          time: '15 minutes ago',
          user: 'Jane Smith',
          avatar: '/images/avatars/jane-smith.jpg',
          status: 'success'
        },
        {
          id: 3,
          type: 'course_completed',
          title: 'Course Completed',
          description: 'Mike Johnson completed React Development course',
          time: '1 hour ago',
          user: 'Mike Johnson',
          avatar: '/images/avatars/mike-johnson.jpg',
          status: 'info'
        },
        {
          id: 4,
          type: 'application_submitted',
          title: 'Internship Application',
          description: 'Sarah Wilson applied for Data Science internship',
          time: '2 hours ago',
          user: 'Sarah Wilson',
          avatar: '/images/avatars/sarah-wilson.jpg',
          status: 'warning'
        },
        {
          id: 5,
          type: 'blog_published',
          title: 'Blog Post Published',
          description: 'New blog post "Getting Started with React" published',
          time: '3 hours ago',
          user: 'Admin',
          avatar: '/images/avatars/admin.jpg',
          status: 'info'
        },
        {
          id: 6,
          type: 'system_alert',
          title: 'System Alert',
          description: 'High server load detected on main server',
          time: '4 hours ago',
          user: 'System',
          avatar: '/images/avatars/system.jpg',
          status: 'error'
        }
      ];
      
      setActivities(mockActivities);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      student_registration: 'fas fa-user-plus',
      payment_received: 'fas fa-credit-card',
      course_completed: 'fas fa-graduation-cap',
      application_submitted: 'fas fa-file-alt',
      blog_published: 'fas fa-blog',
      system_alert: 'fas fa-exclamation-triangle'
    };
    return icons[type] || 'fas fa-circle';
  };

  const getStatusColor = (status) => {
    const colors = {
      success: '#27ae60',
      info: '#3498db',
      warning: '#f39c12',
      error: '#e74c3c'
    };
    return colors[status] || '#6c757d';
  };

  if (loading) {
    return (
      <div className="recent-activity loading">
        <div className="activity-header">
          <h3>Recent Activity</h3>
        </div>
        <div className="activity-list">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="activity-item loading">
              <div className="skeleton-avatar"></div>
              <div className="skeleton-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-description"></div>
                <div className="skeleton-time"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="recent-activity">
      <div className="activity-header">
        <h3>Recent Activity</h3>
        <button className="view-all-btn">View All</button>
      </div>
      
      <div className="activity-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div className="activity-avatar">
              <img 
                src={activity.avatar} 
                alt={activity.user}
                onError={(e) => {
                  e.target.src = '/images/avatars/default-avatar.svg';
                }}
              />
              <div 
                className="activity-icon"
                style={{ backgroundColor: getStatusColor(activity.status) }}
              >
                <i className={getActivityIcon(activity.type)}></i>
              </div>
            </div>
            
            <div className="activity-content">
              <div className="activity-title">{activity.title}</div>
              <div className="activity-description">{activity.description}</div>
              <div className="activity-meta">
                <span className="activity-user">{activity.user}</span>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
