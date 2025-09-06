import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import internshipService from '../../services/internshipService';
import './InternshipSection.css';

const InternshipSection = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedInternships();
  }, []);

  const fetchFeaturedInternships = async () => {
    try {
      setLoading(true);
      const response = await internshipService.getFeaturedInternships(6);
      setInternships(response.data || []);
    } catch (err) {
      setError('Failed to load internships');
      console.error('Error fetching internships:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRemainingDays = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'remote':
        return 'fas fa-home';
      case 'onsite':
        return 'fas fa-building';
      case 'hybrid':
        return 'fas fa-laptop-house';
      default:
        return 'fas fa-briefcase';
    }
  };

  if (loading) {
    return (
      <section className="internship-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Internships</h2>
            <p>Hand-picked opportunities to kickstart your career</p>
          </div>
          <div className="loading-grid">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="internship-card loading">
                <div className="skeleton skeleton-image"></div>
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-button"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="internship-section">
        <div className="container">
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{error}</p>
            <button onClick={fetchFeaturedInternships} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="internship-section">
      <div className="container">
        <div className="section-header">
          <h2>Featured Internships</h2>
          <p>Hand-picked opportunities to kickstart your career</p>
        </div>

        <div className="internships-grid">
          {internships.map((internship) => (
            <div key={internship._id} className="internship-card">
              <div className="internship-card__header">
                <div className="internship-card__badges">
                  <span className="badge badge--featured">Featured</span>
                  <span className={`badge badge--${internship.type}`}>
                    <i className={getTypeIcon(internship.type)}></i>
                    {internship.type.charAt(0).toUpperCase() + internship.type.slice(1)}
                  </span>
                </div>
                <div className="internship-card__company">
                  <span>{internship.company}</span>
                </div>
              </div>

              <div className="internship-card__content">
                <h3 className="internship-card__title">{internship.title}</h3>
                <p className="internship-card__description">{internship.shortDescription}</p>

                <div className="internship-card__details">
                  <div className="detail-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{internship.location}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-clock"></i>
                    <span>{internship.duration} {internship.durationUnit}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-rupee-sign"></i>
                    <span>
                      {internship.stipend?.amount 
                        ? `₹${internship.stipend.amount.toLocaleString()}/${internship.stipend.type === 'monthly' ? 'month' : 'project'}`
                        : 'Unpaid'
                      }
                    </span>
                  </div>
                </div>

                <div className="internship-card__skills">
                  {internship.requirements?.skills?.slice(0, 3).map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                  {internship.requirements?.skills?.length > 3 && (
                    <span className="skill-tag skill-tag--more">
                      +{internship.requirements.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="internship-card__footer">
                <div className="internship-card__deadline">
                  <i className="fas fa-calendar-alt"></i>
                  <span>
                    {getRemainingDays(internship.applicationDeadline) > 0
                      ? `${getRemainingDays(internship.applicationDeadline)} days left`
                      : 'Deadline passed'
                    }
                  </span>
                </div>
                <Link 
                  to={`/internships/${internship._id}`} 
                  className="btn btn-primary btn-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="internship-cta">
          <Link to="/internships" className="btn btn-primary btn-lg">
            View All Internships
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InternshipSection;
