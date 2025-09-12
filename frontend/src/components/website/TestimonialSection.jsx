import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import testimonialService from '../../services/testimonialService';
import { getTestimonialImageUrl, handleTestimonialImageError } from '../../utils/imageUtils';
import './TestimonialSection.css';

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch active testimonials
  const { data: testimonialsData, isLoading, error } = useQuery({
    queryKey: ['testimonials', 'active'],
    queryFn: testimonialService.getActiveTestimonials
  });

  const testimonials = testimonialsData?.data || [];

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
  };

  if (isLoading) {
    return (
      <section className="testimonial-section">
        <div className="container">
          <div className="loading">Loading testimonials...</div>
        </div>
      </section>
    );
  }

  if (error || !testimonials.length) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="testimonial-section">
      <div className="container">
        <div className="section-header">
          <h2>
            <span className="quote-mark">"</span>
            Success Stories & Testimonials
          </h2>
          <p>Hear from our students, interns, and professionals who have transformed their careers with Mindware India.</p>
        </div>

        <div className="testimonial-carousel">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="testimonial-profile">
                {currentTestimonial.client_image ? (
                  <img
                    src={getTestimonialImageUrl(currentTestimonial.client_image)}
                    alt={currentTestimonial.client_name}
                    className="profile-image"
                    onError={handleTestimonialImageError}
                  />
                ) : null}
                <div 
                  className="profile-placeholder"
                  style={{ display: currentTestimonial.client_image ? 'none' : 'flex' }}
                >
                  {currentTestimonial.client_name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="profile-info">
                  <h3>{currentTestimonial.client_name || 'Anonymous'}</h3>
                  <p className="designation">{currentTestimonial.client_designation || 'Student'}</p>
                  {currentTestimonial.client_company && (
                    <p className="company">{currentTestimonial.client_company}</p>
                  )}
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`star ${i < (currentTestimonial.testimonial_rating || 0) ? 'filled' : ''}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="testimonial-text">
                {currentTestimonial.course && (
                  <div className="course-badge">
                    <span className="course-icon">🎓</span>
                    <span>{currentTestimonial.course}</span>
                  </div>
                )}
                <blockquote>
                  "{currentTestimonial.testimonial_text || 'No testimonial text available.'}"
                </blockquote>
                
                {currentTestimonial.success_metrics && (
                  <div className="success-metrics">
                    <div className="metrics-grid">
                      {Object.entries(currentTestimonial.success_metrics).map(([key, value]) => (
                        <div key={key} className="metric-item">
                          <span className="metric-value">{value}</span>
                          <span className="metric-label">{key}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          {testimonials.length > 1 && (
            <>
              <button
                className="carousel-nav prev"
                onClick={prevTestimonial}
                aria-label="Previous testimonial"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button
                className="carousel-nav next"
                onClick={nextTestimonial}
                aria-label="Next testimonial"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {testimonials.length > 1 && (
            <div className="carousel-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => goToTestimonial(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Statistics Section */}
        
      </div>
    </section>
  );
};

export default TestimonialSection;