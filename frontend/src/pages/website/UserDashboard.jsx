import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import enrollmentService from '../../services/enrollmentService';
import courseService from '../../services/courseService';
import paymentService from '../../services/paymentService';
import UserProfile from '../../components/user/UserProfile';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  console.log('UserDashboard rendered, user:', user, 'loading:', loading);

  // Simple test to see if component renders
  console.log('UserDashboard component is rendering!');

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      console.log('Fetching user data...');
      setLoading(true);
      
      // Fetch user's enrollments
      const enrollmentsResponse = await enrollmentService.getMyEnrollments();
      setEnrollments(Array.isArray(enrollmentsResponse?.data) ? enrollmentsResponse.data : []);
      
      // Fetch user's payments
      const paymentsResponse = await paymentService.getMyPayments();
      setPayments(Array.isArray(paymentsResponse?.data) ? paymentsResponse.data : []);
      
      // Fetch all courses for reference
      const coursesResponse = await courseService.getCourses({ limit: 50 });
      setCourses(Array.isArray(coursesResponse) ? coursesResponse : []);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'status-pending', text: 'Pending' },
      approved: { class: 'status-approved', text: 'Approved' },
      rejected: { class: 'status-rejected', text: 'Rejected' },
      completed: { class: 'status-completed', text: 'Completed' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'payment-pending', text: 'Pending' },
      completed: { class: 'payment-completed', text: 'Completed' },
      failed: { class: 'payment-failed', text: 'Failed' },
      refunded: { class: 'payment-refunded', text: 'Refunded' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`payment-badge ${config.class}`}>{config.text}</span>;
  };

  if (!user) {
    return (
      <div className="user-dashboard">
        <div className="error-container">
          <h2>Please log in to access your dashboard</h2>
          <p>You need to be logged in to view your courses and progress.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="user-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">


      <div className="dashboard-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-overview">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-book"></i>
                </div>
                <div className="stat-content">
                  <h3>{enrollments.length}</h3>
                  <p>Total Enrollments</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="stat-content">
                  <h3>{enrollments.filter(e => e.status === 'approved').length}</h3>
                  <p>Approved Courses</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-credit-card"></i>
                </div>
                <div className="stat-content">
                  <h3>{payments.filter(p => p.status === 'completed').length}</h3>
                  <p>Completed Payments</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-certificate"></i>
                </div>
                <div className="stat-content">
                  <h3>{enrollments.filter(e => e.status === 'completed').length}</h3>
                  <p>Certificates Earned</p>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                {enrollments.slice(0, 5).map((enrollment) => (
                  <div key={enrollment.id} className="activity-item">
                    <div className="activity-icon">
                      <i className="fas fa-book"></i>
                    </div>
                    <div className="activity-content">
                      <h4>Enrolled in {enrollment.courseInterest}</h4>
                      <p>{new Date(enrollment.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="activity-status">
                      {getStatusBadge(enrollment.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="courses-section">
            <h2>My Courses</h2>
            <div className="courses-grid">
              {enrollments.map((enrollment) => (
                <div key={enrollment.id} className="course-card">
                  <div className="course-header">
                    <h3>{enrollment.courseInterest}</h3>
                    <div className="course-status">
                      {getStatusBadge(enrollment.status)}
                    </div>
                  </div>
                  
                  <div className="course-details">
                    <p><strong>Enrollment Date:</strong> {new Date(enrollment.createdAt).toLocaleDateString()}</p>
                    <p><strong>Payment Status:</strong> {getPaymentStatusBadge(enrollment.paymentStatus)}</p>
                    <p><strong>Course Fee:</strong> ₹{enrollment.courseFee || 'N/A'}</p>
                  </div>
                  
                  <div className="course-actions">
                    {enrollment.status === 'approved' && (
                      <button className="btn btn-primary">
                        <i className="fas fa-play"></i> Start Course
                      </button>
                    )}
                    {enrollment.status === 'completed' && (
                      <button className="btn btn-success">
                        <i className="fas fa-download"></i> Download Certificate
                      </button>
                    )}
                    <button className="btn btn-secondary">
                      <i className="fas fa-eye"></i> View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="payments-section">
            <h2>Payment History</h2>
            <div className="payments-table">
              <table>
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Course</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.transaction_id}</td>
                      <td>{payment.course_name || 'N/A'}</td>
                      <td>₹{payment.amount}</td>
                      <td>{getPaymentStatusBadge(payment.status)}</td>
                      <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-sm btn-primary">
                          <i className="fas fa-download"></i> Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'trainings' && (
          <div className="trainings-section">
            <h2>My Trainings</h2>
            <div className="trainings-grid">
              {enrollments.filter(e => e.type === 'training').map((enrollment) => (
                <div key={enrollment.id} className="training-card">
                  <div className="training-header">
                    <h3>{enrollment.courseInterest}</h3>
                    <div className="training-status">
                      {getStatusBadge(enrollment.status)}
                    </div>
                  </div>
                  
                  <div className="training-details">
                    <p><strong>Type:</strong> Training Program</p>
                    <p><strong>Duration:</strong> {enrollment.duration || 'N/A'}</p>
                    <p><strong>Enrollment Date:</strong> {new Date(enrollment.createdAt).toLocaleDateString()}</p>
                    <p><strong>Payment Status:</strong> {getPaymentStatusBadge(enrollment.paymentStatus)}</p>
                  </div>
                  
                  <div className="training-actions">
                    {enrollment.status === 'approved' && (
                      <button className="btn btn-primary">
                        <i className="fas fa-play"></i> Start Training
                      </button>
                    )}
                    <button className="btn btn-secondary">
                      <i className="fas fa-eye"></i> View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'internships' && (
          <div className="internships-section">
            <h2>My Internships</h2>
            <div className="internships-grid">
              {enrollments.filter(e => e.type === 'internship').map((enrollment) => (
                <div key={enrollment.id} className="internship-card">
                  <div className="internship-header">
                    <h3>{enrollment.courseInterest}</h3>
                    <div className="internship-status">
                      {getStatusBadge(enrollment.status)}
                    </div>
                  </div>
                  
                  <div className="internship-details">
                    <p><strong>Type:</strong> Internship Program</p>
                    <p><strong>Duration:</strong> {enrollment.duration || 'N/A'}</p>
                    <p><strong>Enrollment Date:</strong> {new Date(enrollment.createdAt).toLocaleDateString()}</p>
                    <p><strong>Payment Status:</strong> {getPaymentStatusBadge(enrollment.paymentStatus)}</p>
                  </div>
                  
                  <div className="internship-actions">
                    {enrollment.status === 'approved' && (
                      <button className="btn btn-primary">
                        <i className="fas fa-play"></i> Start Internship
                      </button>
                    )}
                    <button className="btn btn-secondary">
                      <i className="fas fa-eye"></i> View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="certificates-section">
            <h2>My Certificates</h2>
            <div className="certificates-grid">
              {enrollments.filter(e => e.status === 'completed').map((enrollment) => (
                <div key={enrollment.id} className="certificate-card">
                  <div className="certificate-icon">
                    <i className="fas fa-certificate"></i>
                  </div>
                  <div className="certificate-info">
                    <h3>{enrollment.courseInterest}</h3>
                    <p>Completed on {new Date(enrollment.updatedAt).toLocaleDateString()}</p>
                    <p className="certificate-id">Certificate ID: {enrollment.certificateId || 'N/A'}</p>
                  </div>
                  <div className="certificate-actions">
                    <button className="btn btn-primary">
                      <i className="fas fa-download"></i> Download
                    </button>
                    <button className="btn btn-secondary">
                      <i className="fas fa-share"></i> Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-section">
            <h2>Profile Management</h2>
            <p>Profile management will be available here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
