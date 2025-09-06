import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';
import bannerService from '../../services/bannerService';
import './BannerManagement.css';

const BannerManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [viewingBanner, setViewingBanner] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const queryClient = useQueryClient();

  // Fetch banners
  const { data: bannersData, isLoading, error } = useQuery({
    queryKey: ['banners', currentPage, pageSize, searchTerm, typeFilter, statusFilter],
    queryFn: () => bannerService.getBanners({
      page: currentPage,
      limit: pageSize,
      search: searchTerm,
      type: typeFilter !== 'all' ? typeFilter : undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined
    })
  });

  // Create banner mutation
  const createBannerMutation = useMutation({
    mutationFn: bannerService.createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries(['banners']);
      setShowModal(false);
      setEditingBanner(null);
    }
  });

  // Update banner mutation
  const updateBannerMutation = useMutation({
    mutationFn: ({ id, data }) => bannerService.updateBanner(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['banners']);
      setShowModal(false);
      setEditingBanner(null);
    }
  });

  // Delete banner mutation
  const deleteBannerMutation = useMutation({
    mutationFn: bannerService.deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries(['banners']);
    }
  });

  const handleCreateBanner = () => {
    setEditingBanner(null);
    setShowModal(true);
  };

  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setShowModal(true);
  };

  const handleViewBanner = (banner) => {
    setViewingBanner(banner);
  };

  const handleDeleteBanner = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      await deleteBannerMutation.mutateAsync(id);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingBanner) {
        await updateBannerMutation.mutateAsync({
          id: editingBanner.banner_id,
          data: formData
        });
      } else {
        await createBannerMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('Failed to save banner');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateBannerMutation.mutateAsync({
        id,
        data: { is_active: newStatus === 'active' }
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
      render: (banner) => (
        <div className="banner-preview">
          <img 
            src={banner.image_url} 
            alt={banner.title}
            className="preview-image"
            onError={(e) => {
              e.target.src = '/images/banner-placeholder.jpg';
            }}
          />
        </div>
      )
    },
    {
      key: 'title',
      title: 'Banner Info',
      render: (banner) => (
        <div className="banner-info-cell">
          <h4>{banner.title}</h4>
          {banner.subtitle && (
            <p className="banner-subtitle">{banner.subtitle}</p>
          )}
          <div className="banner-meta">
            <span className={`type-badge type-${banner.banner_type}`}>
              {banner.banner_type.replace('-', ' ').toUpperCase()}
            </span>
            <span className="position-badge">
              Position: {banner.banner_position || 0}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'description',
      title: 'Description',
      render: (banner) => (
        <div className="description-cell">
          <p>{banner.description || 'No description'}</p>
        </div>
      )
    },
    {
      key: 'button_info',
      title: 'Button Info',
      render: (banner) => (
        <div className="button-info-cell">
          {banner.button_text && (
            <div className="button-text">
              <i className="fas fa-link"></i>
              <span>{banner.button_text}</span>
            </div>
          )}
          {banner.button_url && (
            <div className="button-url">
              <i className="fas fa-external-link-alt"></i>
              <a href={banner.button_url} target="_blank" rel="noopener noreferrer">
                {banner.button_url.length > 30 
                  ? banner.button_url.substring(0, 30) + '...' 
                  : banner.button_url
                }
              </a>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'dates',
      title: 'Schedule',
      render: (banner) => (
        <div className="dates-cell">
          {banner.start_date && (
            <div className="start-date">
              <i className="fas fa-play"></i>
              <span>Start: {new Date(banner.start_date).toLocaleDateString()}</span>
            </div>
          )}
          {banner.end_date && (
            <div className="end-date">
              <i className="fas fa-stop"></i>
              <span>End: {new Date(banner.end_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (banner) => (
        <select 
          value={banner.is_active ? 'active' : 'inactive'}
          onChange={(e) => handleStatusChange(banner.banner_id, e.target.value)}
          className={`status-select status-${banner.is_active ? 'active' : 'inactive'}`}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      )
    },
    {
      key: 'created_at',
      title: 'Created',
      render: (banner) => new Date(banner.created_at).toLocaleDateString()
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (banner) => (
        <div className="action-buttons">
          <button
            className="btn btn-sm btn-outline"
            onClick={() => handleViewBanner(banner)}
            title="View"
          >
            <i className="fas fa-eye"></i>
          </button>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => handleEditBanner(banner)}
            title="Edit"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDeleteBanner(banner.banner_id)}
            title="Delete"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )
    }
  ];

  const bannerFormFields = [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      placeholder: 'Enter banner title'
    },
    {
      name: 'subtitle',
      label: 'Subtitle',
      type: 'text',
      required: false,
      placeholder: 'Enter banner subtitle'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: false,
      placeholder: 'Enter banner description',
      rows: 3
    },
    {
      name: 'image_url',
      label: 'Banner Image',
      type: 'file',
      accept: 'image/*',
      required: true
    },
    {
      name: 'button_text',
      label: 'Button Text',
      type: 'text',
      required: false,
      placeholder: 'Enter button text'
    },
    {
      name: 'button_url',
      label: 'Button URL',
      type: 'url',
      required: false,
      placeholder: 'Enter button URL'
    },
    {
      name: 'banner_type',
      label: 'Banner Type',
      type: 'select',
      required: true,
      options: [
        { value: 'hero', label: 'Hero Banner' },
        { value: 'about', label: 'About Section' },
        { value: 'service', label: 'Service Section' },
        { value: 'testimonial', label: 'Testimonial Section' },
        { value: 'contact', label: 'Contact Section' }
      ]
    },
    {
      name: 'banner_position',
      label: 'Position Order',
      type: 'number',
      required: false,
      placeholder: 'Enter position order (0 = first)'
    },
    {
      name: 'start_date',
      label: 'Start Date',
      type: 'datetime-local'
    },
    {
      name: 'end_date',
      label: 'End Date',
      type: 'datetime-local'
    },
    {
      name: 'is_active',
      label: 'Active Banner',
      type: 'checkbox'
    }
  ];

  if (isLoading) {
    return (
      <div className="banner-management loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading banners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="banner-management">
      <div className="page-header">
        <div className="page-title">
          <h1>Banner Management</h1>
          <p>Manage your website banners and promotional content</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleCreateBanner}
        >
          <i className="fas fa-plus"></i>
          Add New Banner
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
                  placeholder="Search banners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Types</option>
                <option value="hero">Hero Banner</option>
                <option value="about">About Section</option>
                <option value="service">Service Section</option>
                <option value="testimonial">Testimonial Section</option>
                <option value="contact">Contact Section</option>
              </select>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="card-body">
            {error ? (
              <div className="error-message">
                <i className="fas fa-exclamation-triangle"></i>
                <p>Failed to load banners</p>
                <button onClick={() => window.location.reload()} className="btn btn-primary">
                  Try Again
                </button>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={bannersData?.data || []}
                loading={isLoading}
                currentPage={currentPage}
                totalPages={bannersData?.pages || 0}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>

      {/* Banner Form Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h2>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowModal(false);
                  setEditingBanner(null);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <FormModal
                title={editingBanner ? 'Edit Banner' : 'Add New Banner'}
                fields={bannerFormFields}
                initialData={editingBanner}
                onSubmit={handleFormSubmit}
                onClose={() => {
                  setShowModal(false);
                  setEditingBanner(null);
                }}
                loading={createBannerMutation.isPending || updateBannerMutation.isPending}
              />
            </div>
          </div>
        </div>
      )}

      {/* Banner View Modal */}
      {viewingBanner && (
        <div className="modal-overlay">
          <div className="modal-container large">
            <div className="modal-header">
              <h2>{viewingBanner.title}</h2>
              <button 
                className="modal-close"
                onClick={() => setViewingBanner(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="banner-view">
                <div className="banner-preview-large">
                  <img 
                    src={viewingBanner.image_url} 
                    alt={viewingBanner.title}
                    className="banner-image"
                  />
                </div>
                <div className="banner-details">
                  <h3>{viewingBanner.title}</h3>
                  {viewingBanner.subtitle && (
                    <h4 className="banner-subtitle">{viewingBanner.subtitle}</h4>
                  )}
                  {viewingBanner.description && (
                    <p className="banner-description">{viewingBanner.description}</p>
                  )}
                  <div className="banner-meta">
                    <div className="meta-item">
                      <strong>Type:</strong>
                      <span className={`type-badge type-${viewingBanner.banner_type}`}>
                        {viewingBanner.banner_type.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="meta-item">
                      <strong>Position:</strong>
                      <span>{viewingBanner.banner_position || 0}</span>
                    </div>
                    <div className="meta-item">
                      <strong>Status:</strong>
                      <span className={`status-badge ${viewingBanner.is_active ? 'active' : 'inactive'}`}>
                        {viewingBanner.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  {viewingBanner.button_text && (
                    <div className="button-info">
                      <strong>Button:</strong>
                      <a 
                        href={viewingBanner.button_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="button-link"
                      >
                        {viewingBanner.button_text}
                      </a>
                    </div>
                  )}
                  {(viewingBanner.start_date || viewingBanner.end_date) && (
                    <div className="schedule-info">
                      <strong>Schedule:</strong>
                      {viewingBanner.start_date && (
                        <div>Start: {new Date(viewingBanner.start_date).toLocaleString()}</div>
                      )}
                      {viewingBanner.end_date && (
                        <div>End: {new Date(viewingBanner.end_date).toLocaleString()}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManagement;