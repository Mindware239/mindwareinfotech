import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import galleryService from '../../services/galleryService';
import './GallerySection.css';

const GallerySection = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedGallery();
  }, []);

  const fetchFeaturedGallery = async () => {
    try {
      setLoading(true);
      const response = await galleryService.getFeaturedGallery(8);
      setGalleryItems(response.data || []);
    } catch (err) {
      setError('Failed to load gallery');
      console.error('Error fetching gallery:', err);
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

  if (loading) {
    return (
      <section className="gallery-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Gallery</h2>
            <p>Moments from our events, training sessions, and celebrations</p>
          </div>
          <div className="gallery-grid">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="gallery-item loading">
                <div className="skeleton skeleton-image"></div>
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-text"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="gallery-section">
        <div className="container">
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{error}</p>
            <button onClick={fetchFeaturedGallery} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="gallery-section">
      <div className="container">
        <div className="section-header">
          <h2>Our Gallery</h2>
          <p>Moments from our events, training sessions, and celebrations</p>
        </div>

        <div className="gallery-grid">
          {galleryItems.map((item) => (
            <div key={item._id} className="gallery-item">
              <div className="gallery-item__image">
                <img 
                  src={item.images?.[0]?.url || '/images/gallery-placeholder.jpg'} 
                  alt={item.title}
                  onError={(e) => {
                    e.target.src = '/images/gallery-placeholder.jpg';
                  }}
                />
                <div className="gallery-item__overlay">
                  <div className="gallery-item__actions">
                    <button className="gallery-action-btn" title="View">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="gallery-action-btn" title="Like">
                      <i className="fas fa-heart"></i>
                    </button>
                    <button className="gallery-action-btn" title="Share">
                      <i className="fas fa-share"></i>
                    </button>
                  </div>
                </div>
                {item.isFeatured && (
                  <div className="gallery-item__badge">
                    <i className="fas fa-star"></i>
                    Featured
                  </div>
                )}
                {item.images && item.images.length > 1 && (
                  <div className="gallery-item__count">
                    <i className="fas fa-images"></i>
                    {item.images.length}
                  </div>
                )}
              </div>

              <div className="gallery-item__content">
                <h3 className="gallery-item__title">{item.title}</h3>
                <p className="gallery-item__description">{item.description}</p>
                
                <div className="gallery-item__meta">
                  <div className="gallery-item__category">
                    <i className="fas fa-tag"></i>
                    <span>{item.category.replace('-', ' ').toUpperCase()}</span>
                  </div>
                  {item.eventDate && (
                    <div className="gallery-item__date">
                      <i className="fas fa-calendar-alt"></i>
                      <span>{formatDate(item.eventDate)}</span>
                    </div>
                  )}
                </div>

                <div className="gallery-item__stats">
                  <div className="gallery-stat">
                    <i className="fas fa-eye"></i>
                    <span>{item.views}</span>
                  </div>
                  <div className="gallery-stat">
                    <i className="fas fa-heart"></i>
                    <span>{item.likes}</span>
                  </div>
                </div>

                <div className="gallery-item__tags">
                  {item.tags && Array.isArray(item.tags) && item.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="gallery-tag">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="gallery-cta">
          <Link to="/gallery" className="btn btn-primary btn-lg">
            View Full Gallery
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
