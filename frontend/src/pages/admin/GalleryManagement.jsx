import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';
import SEOForm from '../../components/admin/SEOForm';
import galleryService from '../../services/galleryService';
import { getGalleryImageUrl, getImageUrl } from '../../utils/imageUtils';
import './GalleryManagement.css';

const GalleryManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingGallery, setEditingGallery] = useState(null);
  const [viewingGallery, setViewingGallery] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [seoData, setSeoData] = useState({});

  const queryClient = useQueryClient();

  // Fetch gallery items
  const { data: galleryData, isLoading, error } = useQuery({
    queryKey: ['gallery', currentPage, pageSize, searchTerm, categoryFilter, statusFilter],
    queryFn: () => galleryService.getGalleryItems({
      page: currentPage,
      limit: pageSize,
      search: searchTerm,
      category: categoryFilter !== 'all' ? categoryFilter : undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined
    })
  });

  // Create gallery item mutation
  const createGalleryMutation = useMutation({
    mutationFn: galleryService.createGalleryItem,
    onSuccess: () => {
      queryClient.invalidateQueries(['gallery']);
      setShowModal(false);
      setEditingGallery(null);
    }
  });

  // Update gallery item mutation
  const updateGalleryMutation = useMutation({
    mutationFn: ({ id, data }) => galleryService.updateGalleryItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['gallery']);
      setShowModal(false);
      setEditingGallery(null);
    }
  });

  // Delete gallery item mutation
  const deleteGalleryMutation = useMutation({
    mutationFn: galleryService.deleteGalleryItem,
    onSuccess: () => {
      queryClient.invalidateQueries(['gallery']);
    }
  });

  const handleCreateGallery = () => {
    setEditingGallery(null);
    setShowModal(true);
  };

  const handleEditGallery = (gallery) => {
    setEditingGallery(gallery);
    setShowModal(true);
  };

  const handleViewGallery = (gallery) => {
    setViewingGallery(gallery);
  };

  const handleDeleteGallery = async (id) => {
    if (window.confirm('Are you sure you want to delete this gallery item?')) {
      await deleteGalleryMutation.mutateAsync(id);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      console.log('Submitting form data:', formData);
      console.log('Form data keys:', Object.keys(formData));
      console.log('Title value:', formData.title);
      console.log('Category value:', formData.category);
      
      // Validate required fields
      if (!formData.title || formData.title.trim() === '') {
        alert('Title is required');
        return;
      }
      
      if (editingGallery) {
        console.log('Updating gallery item:', editingGallery.id);
        await updateGalleryMutation.mutateAsync({
          id: editingGallery.id,
          data: formData
        });
      } else {
        console.log('Creating new gallery item');
        await createGalleryMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error('Error saving gallery item:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save gallery item';
      alert(errorMessage);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateGalleryMutation.mutateAsync({
        id,
        data: { status: newStatus }
      });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const columns = [
    {
      key: 'preview',
      title: 'Preview',
      render: (gallery) => {
        // Parse images if it's a JSON string
        let images = gallery.images;
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
          <div className="gallery-preview">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={gallery.title}
                className="preview-image"
                onError={(e) => {
                  e.target.src = '/images/gallery-placeholder.jpg';
                }}
              />
            ) : (
              <div className="preview-placeholder">
                <i className="fas fa-image"></i>
              </div>
            )}
            {images.length > 1 && (
              <div className="image-count">
                +{images.length - 1}
              </div>
            )}
          </div>
        );
      }
    },
    {
      key: 'title',
      title: 'Title',
      render: (gallery) => (
        <div className="gallery-title-cell">
          <h4>{gallery.title}</h4>
          <p className="gallery-description">{gallery.description}</p>
          <div className="gallery-meta">
            <span className="category-badge">{gallery.category}</span>
            {gallery.subcategory && (
              <span className="subcategory-badge">{gallery.subcategory}</span>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'event_info',
      title: 'Event Info',
      render: (gallery) => (
        <div className="event-info-cell">
          {gallery.event_date && (
            <div className="event-date">
              <i className="fas fa-calendar"></i>
              <span>{new Date(gallery.event_date).toLocaleDateString()}</span>
            </div>
          )}
          {gallery.location && (
            <div className="event-location">
              <i className="fas fa-map-marker-alt"></i>
              <span>{gallery.location}</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'stats',
      title: 'Stats',
      render: (gallery) => (
        <div className="stats-cell">
          <div className="stat-item">
            <i className="fas fa-eye"></i>
            <span>{gallery.views || 0}</span>
          </div>
          <div className="stat-item">
            <i className="fas fa-heart"></i>
            <span>{gallery.likes || 0}</span>
          </div>
          <div className="stat-item">
            <i className="fas fa-images"></i>
            <span>{Array.isArray(gallery.images) ? gallery.images.length : 0}</span>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (gallery) => (
        <select 
          value={gallery.status || 'active'}
          onChange={(e) => handleStatusChange(gallery.id, e.target.value)}
          className={`status-select status-${gallery.status || 'active'}`}
        >
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      )
    },
    {
      key: 'featured',
      title: 'Featured',
      render: (gallery) => (
        <div className="featured-toggle">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={gallery.is_featured || false}
              onChange={(e) => {
                updateGalleryMutation.mutateAsync({
                  id: gallery.id,
                  data: { is_featured: e.target.checked }
                });
              }}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      )
    },
    {
      key: 'created_at',
      title: 'Created',
      render: (gallery) => new Date(gallery.created_at).toLocaleDateString()
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (gallery) => (
        <div className="action-buttons">
          <button
            className="btn btn-sm btn-outline"
            onClick={() => handleViewGallery(gallery)}
            title="View"
          >
            <i className="fas fa-eye"></i>
          </button>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => handleEditGallery(gallery)}
            title="Edit"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDeleteGallery(gallery.id)}
            title="Delete"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )
    }
  ];

  const galleryFormFields = [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      placeholder: 'Enter gallery title'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: false,
      placeholder: 'Enter gallery description',
      rows: 3
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      options: [
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
      ]
    },
    {
      name: 'subcategory',
      label: 'Subcategory',
      type: 'text',
      required: false,
      placeholder: 'Enter subcategory (optional)'
    },
    {
      name: 'images',
      label: 'Images',
      type: 'file',
      accept: 'image/*',
      multiple: true,
      required: true
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'text',
      placeholder: 'Enter tags separated by commas'
    },
    {
      name: 'event_date',
      label: 'Event Date',
      type: 'datetime-local'
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text',
      placeholder: 'Enter event location'
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'active', label: 'Active' },
        { value: 'archived', label: 'Archived' }
      ]
    },
    {
      name: 'is_featured',
      label: 'Featured Gallery',
      type: 'checkbox'
    },
    {
      name: 'is_public',
      label: 'Public Gallery',
      type: 'checkbox'
    },
    {
      name: 'seo',
      label: 'SEO Settings',
      type: 'custom',
      component: ({ value, onChange }) => (
        <SEOForm
          data={value || {}}
          onChange={onChange}
          title={seoData.title}
          description={seoData.description}
          excerpt={seoData.description}
          featuredImage={seoData.images?.[0]}
        />
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="gallery-management loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading gallery items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-management">
      <div className="page-header">
        <div className="page-title">
          <h1>Gallery Management</h1>
          <p>Manage your gallery items and media content</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleCreateGallery}
        >
          <i className="fas fa-plus"></i>
          Add New Gallery Item
        </button>
      </div>

      <div className="page-content">
        <div className="content-card">
          <div className="card-header">
            <div className="filters">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input 
                  type="text"
                  placeholder="Search gallery items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                <option value="events">Events</option>
                <option value="training">Training</option>
                <option value="workshops">Workshops</option>
                <option value="team-building">Team Building</option>
                <option value="awards">Awards</option>
                <option value="office">Office</option>
                <option value="students">Students</option>
                <option value="projects">Projects</option>
                <option value="conferences">Conferences</option>
                <option value="other">Other</option>
              </select>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="card-body">
            {error ? (
              <div className="error-message">
                <i className="fas fa-exclamation-triangle"></i>
                <p>Failed to load gallery items</p>
                <button onClick={() => window.location.reload()} className="btn btn-primary">
                  Try Again
                </button>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={galleryData?.data || []}
                loading={isLoading}
                currentPage={currentPage}
                totalPages={galleryData?.pages || 0}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>

      {/* Gallery Form Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container large">
            <div className="modal-header">
              <h2>{editingGallery ? 'Edit Gallery Item' : 'Add New Gallery Item'}</h2>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowModal(false);
                  setEditingGallery(null);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <FormModal
                title={editingGallery ? 'Edit Gallery Item' : 'Add New Gallery Item'}
                fields={galleryFormFields || []}
                initialData={editingGallery || {}}
                onSubmit={handleFormSubmit}
                onClose={() => {
                  setShowModal(false);
                  setEditingGallery(null);
                  setSeoData({});
                }}
                onFormDataChange={(formData) => {
                  setSeoData({
                    title: formData.title,
                    description: formData.description,
                    images: formData.images
                  });
                }}
                loading={createGalleryMutation.isPending || updateGalleryMutation.isPending}
              />
            </div>
          </div>
        </div>
      )}

      {/* Gallery View Modal */}
      {viewingGallery && (
        <div className="modal-overlay">
          <div className="modal-container large">
            <div className="modal-header">
              <h2>{viewingGallery.title}</h2>
              <button 
                className="modal-close"
                onClick={() => setViewingGallery(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="gallery-view">
                <div className="gallery-info">
                  <h3>{viewingGallery.title}</h3>
                  <p className="gallery-description">{viewingGallery.description}</p>
                  <div className="gallery-meta">
                    <span className="category-badge">{viewingGallery.category}</span>
                    {viewingGallery.subcategory && (
                      <span className="subcategory-badge">{viewingGallery.subcategory}</span>
                    )}
                  </div>
                  {viewingGallery.event_date && (
                    <div className="event-date">
                      <i className="fas fa-calendar"></i>
                      <span>{new Date(viewingGallery.event_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {viewingGallery.location && (
                    <div className="event-location">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{viewingGallery.location}</span>
                    </div>
                  )}
                </div>
                <div className="gallery-images">
                  <h4>Images ({Array.isArray(viewingGallery.images) ? viewingGallery.images.length : 0})</h4>
                  <div className="images-grid">
                    {(() => {
                      let images = viewingGallery.images;
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
                      
                      return images.length > 0 ? images.map((image, index) => (
                        <div key={index} className="image-item">
                          <img 
                            src={getImageUrl(image.url || image)} 
                            alt={`${viewingGallery.title} - Image ${index + 1}`}
                            className="gallery-image"
                            onError={(e) => {
                              e.target.src = '/images/gallery-placeholder.jpg';
                            }}
                          />
                        </div>
                      )) : (
                        <div className="no-images">
                          <i className="fas fa-image"></i>
                          <p>No images available</p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;