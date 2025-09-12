import React, { useState, useEffect } from 'react';
import galleryService from '../../services/galleryService';
import { getGalleryImageUrl } from '../../utils/imageUtils';
import './GalleryPage.css';

const GalleryPage = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or masonry
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'events', label: 'Events' },
    { value: 'training', label: 'Training' },
    { value: 'workshops', label: 'Workshops' },
    { value: 'team-building', label: 'Team Building' },
    { value: 'awards', label: 'Awards' },
    { value: 'office', label: 'Office' },
    { value: 'students', label: 'Students' },
    { value: 'projects', label: 'Projects' },
    { value: 'conferences', label: 'Conferences' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchGalleryItems();
  }, [currentPage, selectedCategory, searchTerm]);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: 12,
        status: 'active'
      };
      
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const response = await galleryService.getGalleryItems(params);
      
      if (response && response.data) {
        setGalleryItems(response.data);
        setTotalPages(response.pages || 1);
      } else {
        setGalleryItems([]);
      }
    } catch (err) {
      setError('Failed to load gallery items');
      console.error('Error fetching gallery:', err);
      setGalleryItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchGalleryItems();
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderGalleryItem = (item) => {
    let images = item.images;
    if (typeof images === 'string') {
      try {
        images = JSON.parse(images);
      } catch (e) {
        images = [];
      }
    }
    
    if (!Array.isArray(images)) {
      images = [];
    }
    
    const imageUrl = getGalleryImageUrl(images);

    return (
      <div key={item.id || item._id} className="gallery-item" onClick={() => handleItemClick(item)}>
        <div className="gallery-item__image">
          <img 
            src={imageUrl} 
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
          {item.is_featured && (
            <div className="gallery-item__badge">
              <i className="fas fa-star"></i>
              Featured
            </div>
          )}
          {images.length > 1 && (
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
            {item.event_date && (
              <div className="gallery-item__date">
                <i className="fas fa-calendar-alt"></i>
                <span>{formatDate(item.event_date)}</span>
              </div>
            )}
          </div>

          <div className="gallery-item__stats">
            <div className="gallery-stat">
              <i className="fas fa-eye"></i>
              <span>{item.views || 0}</span>
            </div>
            <div className="gallery-stat">
              <i className="fas fa-heart"></i>
              <span>{item.likes || 0}</span>
            </div>
          </div>

          {item.tags && Array.isArray(item.tags) && item.tags.length > 0 && (
            <div className="gallery-item__tags">
              {item.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="gallery-tag">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading && galleryItems.length === 0) {
    return (
      <div className="gallery-page">
        <div className="page-hero">
          <div className="container">
            <h1>Gallery</h1>
            <p>View our photos and events</p>
          </div>
        </div>
        
        <div className="page-content">
          <div className="container">
            <div className="gallery-filters">
              <div className="gallery-skeleton skeleton-filter"></div>
            </div>
            <div className="gallery-grid">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="gallery-item loading">
                  <div className="skeleton skeleton-image"></div>
                  <div className="skeleton skeleton-title"></div>
                  <div className="skeleton skeleton-text"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      <div className="page-hero">
        <div className="container">
          <h1>Gallery</h1>
          <p>View our photos and events</p>
        </div>
      </div>
      
      <div className="page-content">
        <div className="container">
          {/* Filters and Search */}
          <div className="gallery-filters">
            <div className="filters-row">
              <div className="category-filters">
                {categories.map(category => (
                  <button
                    key={category.value}
                    className={`filter-btn ${selectedCategory === category.value ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(category.value)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="search-row">
              <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-group">
                  <input
                    type="text"
                    placeholder="Search gallery items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <button type="submit" className="search-btn">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </form>
              
              <div className="view-controls">
                <button
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <i className="fas fa-th"></i>
                </button>
                <button
                  className={`view-btn ${viewMode === 'masonry' ? 'active' : ''}`}
                  onClick={() => setViewMode('masonry')}
                  title="Masonry View"
                >
                  <i className="fas fa-th-large"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          {error ? (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{error}</p>
              <button onClick={fetchGalleryItems} className="btn btn-primary">
                Try Again
              </button>
            </div>
          ) : galleryItems.length === 0 ? (
            <div className="no-items">
              <i className="fas fa-images"></i>
              <h3>No gallery items found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className={`gallery-grid ${viewMode}`}>
              {galleryItems.map(renderGalleryItem)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i>
                Previous
              </button>
              
              <div className="pagination-numbers">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    <span className="pagination-ellipsis">...</span>
                    <button
                      className={`pagination-number ${currentPage === totalPages ? 'active' : ''}`}
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal for viewing gallery item */}
      {showModal && selectedItem && (
        <div className="gallery-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <i className="fas fa-times"></i>
            </button>
            
            <div className="modal-image">
              {(() => {
                let images = selectedItem.images;
                if (typeof images === 'string') {
                  try {
                    images = JSON.parse(images);
                  } catch (e) {
                    images = [];
                  }
                }
                if (!Array.isArray(images)) images = [];
                
                const imageUrl = getGalleryImageUrl(images);
                return (
                  <img 
                    src={imageUrl} 
                    alt={selectedItem.title}
                    onError={(e) => {
                      e.target.src = '/images/gallery-placeholder.jpg';
                    }}
                  />
                );
              })()}
            </div>
            
            <div className="modal-info">
              <h2>{selectedItem.title}</h2>
              <p>{selectedItem.description}</p>
              
              <div className="modal-meta">
                <div className="meta-item">
                  <i className="fas fa-tag"></i>
                  <span>{selectedItem.category.replace('-', ' ').toUpperCase()}</span>
                </div>
                {selectedItem.event_date && (
                  <div className="meta-item">
                    <i className="fas fa-calendar-alt"></i>
                    <span>{formatDate(selectedItem.event_date)}</span>
                  </div>
                )}
                {selectedItem.location && (
                  <div className="meta-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{selectedItem.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
