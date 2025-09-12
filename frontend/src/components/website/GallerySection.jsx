import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import galleryService from '../../services/galleryService';
import { getGalleryImageUrl } from '../../utils/imageUtils';
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
      setError(null);
      console.log('GallerySection - Fetching featured gallery...');
      const response = await galleryService.getFeaturedGallery(8);
      console.log('GallerySection - Featured gallery response:', response);
      console.log('GallerySection - Gallery items:', response.data || []);
      
      // Ensure we have valid data
      if (response && response.data && Array.isArray(response.data)) {
        setGalleryItems(response.data);
      } else {
        console.log('No valid gallery data received');
        setGalleryItems([]);
      }
    } catch (err) {
      setError('Failed to load gallery');
      console.error('GallerySection - Error fetching gallery:', err);
      setGalleryItems([]);
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
          {galleryItems.length === 0 ? (
            <div className="no-gallery-items">
              <p>No gallery items found. Loading sample data...</p>
              <button onClick={() => window.open('http://localhost:5000/api/update-gallery-images', '_blank')} className="btn btn-primary">
                Update Gallery Images
              </button>
            </div>
          ) : (
            galleryItems.map((item) => {
              try {
                console.log('Rendering gallery item:', item);
                console.log('Item images:', item.images);
                
                // Parse images if it's a string
                let images = item.images;
                if (typeof images === 'string') {
                  try {
                    images = JSON.parse(images);
                  } catch (e) {
                    console.log('Failed to parse images string:', images);
                    images = [];
                  }
                }
                
                // Ensure images is an array
                if (!Array.isArray(images)) {
                  images = [];
                }
                
                const imageUrl = getGalleryImageUrl(images);
                console.log('Constructed image URL:', imageUrl);
              
              return (
                <div key={item.id || item._id} className="gallery-item">
                  <div className="gallery-item__image">
                    <img 
                      src={imageUrl || '/images/gallery-placeholder.jpg'} 
                      alt={item.title}
                      onError={(e) => {
                        console.log('Image failed to load:', e.target.src);
                        console.log('Available image data:', item.images);
                        e.target.src = '/images/gallery-placeholder.jpg';
                      }}
                      onLoad={(e) => {
                        console.log('Image loaded successfully:', e.target.src);
                      }}
                    />
                <div className="gallery-item__overlay">
                  <div className="gallery-item__actions">
                    <button 
                      className="gallery-action-btn" 
                      title="View"
                      onClick={() => {
                        console.log('View clicked for item:', item.title);
                        // Add view functionality here
                      }}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button 
                      className="gallery-action-btn" 
                      title="Like"
                      onClick={() => {
                        console.log('Like clicked for item:', item.title);
                        // Add like functionality here
                      }}
                    >
                      <i className="fas fa-heart"></i>
                    </button>
                    <button 
                      className="gallery-action-btn" 
                      title="Share"
                      onClick={() => {
                        console.log('Share clicked for item:', item.title);
                        // Add share functionality here
                      }}
                    >
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
                {Array.isArray(images) && images.length > 1 && (
                  <div className="gallery-item__count">
                    <i className="fas fa-images"></i>
                    {images.length}
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
              );
              } catch (error) {
                console.error('Error rendering gallery item:', error);
                return (
                  <div key={item.id || item._id} className="gallery-item">
                    <div className="gallery-item__content">
                      <h3>Error loading item</h3>
                      <p>Failed to load gallery item</p>
                    </div>
                  </div>
                );
              }
            })
          )}
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
