import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import trainingService from '../../services/trainingService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import PaymentModal from '../../components/payment/PaymentModal';
import './TrainingDetailPage.css';

const TrainingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const { user } = useAuth();
  
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState(null);

  useEffect(() => {
    fetchTrainingDetails();
  }, [id]);

  const fetchTrainingDetails = async () => {
    try {
      setLoading(true);
      const response = await trainingService.getTrainingProgram(id);
      if (response.success) {
        setTraining(response.data);
      } else {
        showError(response.message || 'Failed to fetch training details');
        navigate('/web-training');
      }
    } catch (error) {
      console.error('Error fetching training:', error);
      showError('Failed to fetch training details');
      navigate('/web-training');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = () => {
    if (!user) {
      showError('Please login to enroll in this training');
      navigate('/login');
      return;
    }

    if (training.price > 0) {
      setShowPaymentModal(true);
    } else {
      setShowEnrollmentModal(true);
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    setShowPaymentModal(false);
    setEnrollmentData({
      ...enrollmentData,
      paymentId: paymentData.id,
      paymentStatus: 'completed'
    });
    setShowEnrollmentModal(true);
  };

  const handlePaymentError = (error) => {
    showError(error || 'Payment failed. Please try again.');
  };

  const handleEnrollmentSuccess = () => {
    setShowEnrollmentModal(false);
    showSuccess('Successfully enrolled in the training!');
    navigate('/user-dashboard');
  };

  if (loading) {
    return (
      <div className="training-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading training details...</p>
        </div>
      </div>
    );
  }

  if (!training) {
    return (
      <div className="training-detail-page">
        <div className="error-container">
          <h2>Training not found</h2>
          <p>The training you're looking for doesn't exist.</p>
          <button className="btn btn-primary" onClick={() => navigate('/trainings')}>
            Back to Trainings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="training-detail-page">
      <div className="container">
        {/* Hero Section */}
        <div className="training-hero">
          <div className="hero-content">
            <div className="training-badge">
              <i className="fas fa-graduation-cap"></i>
              {training.category}
            </div>
            <h1>{training.title}</h1>
            <p className="training-description">{training.description}</p>
            
            <div className="training-meta">
              <div className="meta-item">
                <i className="fas fa-clock"></i>
                <span>{training.duration}</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-users"></i>
                <span>{training.level}</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-calendar"></i>
                <span>{new Date(training.startDate).toLocaleDateString()}</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>{training.location}</span>
              </div>
            </div>

            <div className="training-price">
              <span className="price">₹{training.price}</span>
              {training.originalPrice && training.originalPrice > training.price && (
                <span className="original-price">₹{training.originalPrice}</span>
              )}
              {training.discount && (
                <span className="discount">{training.discount}% OFF</span>
              )}
            </div>

            <div className="hero-actions">
              <button className="btn btn-primary btn-large" onClick={handleEnroll}>
                <i className="fas fa-credit-card"></i>
                {training.price > 0 ? 'Pay & Enroll' : 'Enroll Now'}
              </button>
              <button className="btn btn-secondary btn-large">
                <i className="fas fa-heart"></i>
                Add to Wishlist
              </button>
            </div>
          </div>
          
          <div className="hero-image">
            {training.image ? (
              <img src={training.image} alt={training.title} />
            ) : (
              <div className="image-placeholder">
                <i className="fas fa-graduation-cap"></i>
              </div>
            )}
          </div>
        </div>

        {/* Training Details */}
        <div className="training-details">
          <div className="details-grid">
            {/* What You'll Learn */}
            <div className="detail-section">
              <h3><i className="fas fa-lightbulb"></i> What You'll Learn</h3>
              <ul className="learning-list">
                {training.learningOutcomes?.map((outcome, index) => (
                  <li key={index}>
                    <i className="fas fa-check"></i>
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>

            {/* Prerequisites */}
            <div className="detail-section">
              <h3><i className="fas fa-list-check"></i> Prerequisites</h3>
              <ul className="prerequisites-list">
                {training.prerequisites?.map((prereq, index) => (
                  <li key={index}>
                    <i className="fas fa-arrow-right"></i>
                    {prereq}
                  </li>
                ))}
              </ul>
            </div>

            {/* Curriculum */}
            <div className="detail-section">
              <h3><i className="fas fa-book"></i> Curriculum</h3>
              <div className="curriculum-list">
                {training.curriculum?.map((module, index) => (
                  <div key={index} className="curriculum-item">
                    <div className="module-header">
                      <h4>Module {index + 1}: {module.title}</h4>
                      <span className="module-duration">{module.duration}</span>
                    </div>
                    <ul className="module-topics">
                      {module.topics?.map((topic, topicIndex) => (
                        <li key={topicIndex}>
                          <i className="fas fa-play"></i>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor */}
            <div className="detail-section">
              <h3><i className="fas fa-user-tie"></i> Instructor</h3>
              <div className="instructor-card">
                <div className="instructor-avatar">
                  {training.instructor?.profilePicture ? (
                    <img src={training.instructor.profilePicture} alt={training.instructor.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {training.instructor?.name?.charAt(0) || 'I'}
                    </div>
                  )}
                </div>
                <div className="instructor-info">
                  <h4>{training.instructor?.name}</h4>
                  <p className="instructor-title">{training.instructor?.title}</p>
                  <p className="instructor-bio">{training.instructor?.bio}</p>
                  <div className="instructor-stats">
                    <div className="stat">
                      <i className="fas fa-star"></i>
                      <span>{training.instructor?.rating || '4.8'}</span>
                    </div>
                    <div className="stat">
                      <i className="fas fa-users"></i>
                      <span>{training.instructor?.students || '1000+'} students</span>
                    </div>
                    <div className="stat">
                      <i className="fas fa-book"></i>
                      <span>{training.instructor?.courses || '10+'} courses</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="detail-section">
              <h3><i className="fas fa-star"></i> Student Reviews</h3>
              <div className="reviews-summary">
                <div className="rating-overview">
                  <div className="rating-number">4.8</div>
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fas fa-star ${i < 4 ? 'filled' : ''}`}></i>
                    ))}
                  </div>
                  <div className="rating-count">Based on {training.reviews?.length || 0} reviews</div>
                </div>
              </div>
              
              <div className="reviews-list">
                {training.reviews?.slice(0, 3).map((review, index) => (
                  <div key={index} className="review-item">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          {review.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <h5>{review.user?.name}</h5>
                          <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={`fas fa-star ${i < review.rating ? 'filled' : ''}`}></i>
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="review-text">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        paymentData={{
          amount: training.price,
          courseName: training.title,
          trainingId: training.id,
          studentName: user?.firstName ? `${user.firstName} ${user.lastName}` : '',
          studentEmail: user?.email || '',
          studentPhone: user?.phone || ''
        }}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  );
};

export default TrainingDetailPage;
