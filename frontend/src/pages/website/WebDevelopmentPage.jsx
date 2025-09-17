import React, { useState, useEffect } from 'react';
import trainingService from '../../services/trainingService';
import './WebDevelopmentPage.css';

const WebDevelopmentPage = () => {
  const [trainingPrograms, setTrainingPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrainingPrograms();
  }, []);

  const fetchTrainingPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch from API only - NO MOCK DATA
      const response = await trainingService.getTrainingProgramsByCategory('web-development', { limit: 20 });
      
      // Parse JSON strings from database
      const programs = Array.isArray(response.data) ? response.data.map(program => ({
        ...program,
        skills: typeof program.skills === 'string' ? JSON.parse(program.skills) : (program.skills || []),
        learning_outcomes: typeof program.learning_outcomes === 'string' ? JSON.parse(program.learning_outcomes) : (program.learning_outcomes || []),
        prerequisites: typeof program.prerequisites === 'string' ? JSON.parse(program.prerequisites) : (program.prerequisites || []),
        tags: typeof program.tags === 'string' ? JSON.parse(program.tags) : (program.tags || []),
        instructor: typeof program.instructor === 'string' ? JSON.parse(program.instructor) : (program.instructor || {}),
        curriculum: typeof program.curriculum === 'string' ? JSON.parse(program.curriculum) : (program.curriculum || []),
        reviews: typeof program.reviews === 'string' ? JSON.parse(program.reviews) : (program.reviews || []),
        metadata: typeof program.metadata === 'string' ? JSON.parse(program.metadata) : (program.metadata || {}),
        price: parseFloat(program.price) || 0,
        original_price: program.original_price ? parseFloat(program.original_price) : null,
        rating: parseFloat(program.rating) || 0
      })) : [];
      
      setTrainingPrograms(programs);
      
    } catch (err) {
      setError('Failed to load training programs. Please check if the server is running.');
      console.error('Error fetching training programs:', err);
      setTrainingPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = (program) => {
    // Store program info in localStorage for enrollment form
    const pricing = trainingService.getPricing(program);
    localStorage.setItem('selectedCourse', JSON.stringify({
      id: program.id,
      title: program.title,
      price: pricing.currentPrice,
      currency: program.currency || 'INR',
      originalPrice: pricing.originalPrice,
      hasDiscount: pricing.hasDiscount,
      discountPercentage: pricing.discountPercentage
    }));
    
    // Redirect to enrollment page
    window.location.href = '/enroll';
  };

  const technologies = [
    { name: 'HTML5', icon: '🌐', color: '#e34f26' },
    { name: 'CSS3', icon: '🎨', color: '#1572b6' },
    { name: 'JavaScript', icon: '⚡', color: '#f7df1e' },
    { name: 'React', icon: '⚛️', color: '#61dafb' },
    { name: 'Node.js', icon: '🟢', color: '#339933' },
    { name: 'Python', icon: '🐍', color: '#3776ab' },
    { name: 'MongoDB', icon: '🍃', color: '#47a248' },
    { name: 'MySQL', icon: '🗄️', color: '#4479a1' }
  ];

  return (
    <div className="web-development-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Web Development Training</h1>
            <p>Master modern web development technologies and build real-world projects</p>
            <div className="hero-stats">
              <div className="stat">
                <span className="number">500+</span>
                <span className="label">Students Trained</span>
              </div>
              <div className="stat">
                <span className="number">95%</span>
                <span className="label">Placement Rate</span>
              </div>
              <div className="stat">
                <span className="number">50+</span>
                <span className="label">Projects Built</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Overview */}
      <section className="course-overview">
        <div className="container">
          <h2>Our Web Development Courses</h2>
          <p>Choose the perfect program for your career goals</p>
          
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading training programs...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{error}</p>
              <button onClick={fetchTrainingPrograms} className="retry-btn">Try Again</button>
            </div>
          ) : trainingPrograms.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-graduation-cap"></i>
              <p>No training programs available at the moment. Please check back later.</p>
            </div>
          ) : (
            <div className="courses-grid">
              {Array.isArray(trainingPrograms) && trainingPrograms.map(program => {
                const pricing = trainingService.getPricing(program);
                return (
                  <div key={program.id} className="course-card">
                    <div className="course-header">
                      <h3>{program.title}</h3>
                      <div className="course-meta">
                        <span className="duration">⏱️ {trainingService.getDuration(program)}</span>
                        <span className="level">📊 {trainingService.getLevel(program.level)}</span>
                      </div>
                    </div>
                    <p className="course-description">{program.short_description || program.description}</p>
                    <ul className="course-features">
                      {(program.skills || program.learning_outcomes || []).slice(0, 6).map((feature, index) => (
                        <li key={index}>✓ {feature}</li>
                      ))}
                    </ul>
                    <div className="course-footer">
                      <div className="price">
                        {pricing.isFree ? (
                          <span className="amount free">Free</span>
                        ) : (
                          <>
                            {pricing.hasDiscount && (
                              <span className="original-price">
                                {trainingService.formatPrice(pricing.originalPrice, pricing.currency)}
                              </span>
                            )}
                            <span className="amount">
                              {trainingService.formatPrice(pricing.currentPrice, pricing.currency)}
                            </span>
                            {pricing.hasDiscount && (
                              <span className="discount">
                                {pricing.discountPercentage}% OFF
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      <button 
                        className="enroll-btn"
                        onClick={() => handleEnroll(program)}
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Technologies Section */}
      <section className="technologies-section">
        <div className="container">
          <h2>Technologies You'll Master</h2>
          <div className="tech-grid">
            {technologies.map((tech, index) => (
              <div key={index} className="tech-item">
                <div className="tech-icon" style={{ backgroundColor: tech.color }}>
                  {tech.icon}
                </div>
                <span className="tech-name">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose">
        <div className="container">
          <h2>Why Choose Our Web Development Program?</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">👨‍💻</div>
              <h3>Expert Instructors</h3>
              <p>Learn from industry professionals with 10+ years of experience</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🏗️</div>
              <h3>Hands-on Projects</h3>
              <p>Build real-world applications and add them to your portfolio</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💼</div>
              <h3>Job Placement</h3>
              <p>Get assistance with resume building and job placement</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📜</div>
              <h3>Certification</h3>
              <p>Receive industry-recognized certificates upon completion</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Start Your Web Development Journey?</h2>
          <p>Join thousands of students who have transformed their careers with our programs</p>
          <div className="cta-buttons">
            <button className="btn btn-primary">Start Learning Today</button>
            <button className="btn btn-outline">Download Syllabus</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WebDevelopmentPage;
