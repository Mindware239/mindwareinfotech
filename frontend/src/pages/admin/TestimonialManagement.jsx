import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';
import testimonialService from '../../services/testimonialService';
import { getTestimonialImageUrl } from '../../utils/imageUtils';
import './TestimonialManagement.css';

const TestimonialManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [viewingTestimonial, setViewingTestimonial] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const queryClient = useQueryClient();

  // Fetch testimonials
  const { data: testimonialsData, isLoading, error } = useQuery({
    queryKey: ['testimonials', currentPage, pageSize, searchTerm, courseFilter, statusFilter],
    queryFn: () => testimonialService.getTestimonials({
      page: currentPage,
      limit: pageSize,
      search: searchTerm,
      course: courseFilter !== 'all' ? courseFilter : undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined
    })
  });

  // Create testimonial mutation
  const createTestimonialMutation = useMutation({
    mutationFn: testimonialService.createTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries(['testimonials']);
      setShowModal(false);
      setEditingTestimonial(null);
    }
  });

  // Update testimonial mutation
  const updateTestimonialMutation = useMutation({
    mutationFn: ({ id, data }) => testimonialService.updateTestimonial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['testimonials']);
      setShowModal(false);
      setEditingTestimonial(null);
    }
  });

  // Delete testimonial mutation
  const deleteTestimonialMutation = useMutation({
    mutationFn: testimonialService.deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries(['testimonials']);
    }
  });

  const handleCreateTestimonial = () => {
    setEditingTestimonial(null);
    setShowModal(true);
  };

  const handleEditTestimonial = (testimonial) => {
    setEditingTestimonial(testimonial);
    setShowModal(true);
  };

  const handleViewTestimonial = (testimonial) => {
    setViewingTestimonial(testimonial);
  };

  const handleDeleteTestimonial = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      await deleteTestimonialMutation.mutateAsync(id);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingTestimonial) {
        await updateTestimonialMutation.mutateAsync({
          id: editingTestimonial.testimonial_id,
          data: formData
        });
      } else {
        await createTestimonialMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert('Failed to save testimonial');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTestimonialMutation.mutateAsync({
        id,
        data: { testimonial_status: newStatus }
      });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const columns = [
    {
      key: 'client_info',
      title: 'Client Information',
      render: (testimonial) => (
        <div className="client-info-cell">
          <div className="client-avatar">
            {testimonial.client_image ? (
              <img 
                src={getTestimonialImageUrl(testimonial.client_image)} 
                alt={testimonial.client_name}
                onError={(e) => {
                  e.target.src = '/images/avatars/default-avatar.svg';
                }}
              />
            ) : (
              <div className="avatar-placeholder">
                <i className="fas fa-user"></i>
              </div>
            )}
          </div>
          <div className="client-details">
            <h4>{testimonial.client_name}</h4>
            <p className="client-designation">{testimonial.client_designation || 'N/A'}</p>
            <p className="client-company">{testimonial.client_company || 'N/A'}</p>
          </div>
        </div>
      )
    },
    {
      key: 'testimonial_text',
      title: 'Testimonial',
      render: (testimonial) => (
        <div className="testimonial-text-cell">
          <p className="testimonial-preview">
            {testimonial.testimonial_text.length > 100 
              ? testimonial.testimonial_text.substring(0, 100) + '...'
              : testimonial.testimonial_text
            }
          </p>
          <div className="testimonial-rating">
            {[...Array(5)].map((_, index) => (
              <i 
                key={index}
                className={`fas fa-star ${index < testimonial.testimonial_rating ? 'filled' : ''}`}
              ></i>
            ))}
          </div>
        </div>
      )
    },
    {
      key: 'course',
      title: 'Course',
      render: (testimonial) => (
        <div className="course-cell">
          <span className="course-badge">{testimonial.course || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'success_metrics',
      title: 'Success Metrics',
      render: (testimonial) => {
        const metrics = testimonial.success_metrics || {};
        return (
          <div className="metrics-cell">
            {metrics.projects && (
              <div className="metric-item">
                <i className="fas fa-project-diagram"></i>
                <span>{metrics.projects} projects</span>
              </div>
            )}
            {metrics.duration && (
              <div className="metric-item">
                <i className="fas fa-clock"></i>
                <span>{metrics.duration}</span>
              </div>
            )}
            {metrics.outcome && (
              <div className="metric-item">
                <i className="fas fa-trophy"></i>
                <span>{metrics.outcome}</span>
              </div>
            )}
          </div>
        );
      }
    },
    {
      key: 'order',
      title: 'Order',
      render: (testimonial) => (
        <div className="order-cell">
          <span className="order-number">{testimonial.testimonial_order || 0}</span>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (testimonial) => (
        <select 
          value={testimonial.testimonial_status || '1'}
          onChange={(e) => handleStatusChange(testimonial.testimonial_id, e.target.value)}
          className={`status-select status-${testimonial.testimonial_status || '1'}`}
        >
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
      )
    },
    {
      key: 'created_at',
      title: 'Created',
      render: (testimonial) => new Date(testimonial.created_at).toLocaleDateString()
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (testimonial) => (
        <div className="action-buttons">
          <button
            className="btn btn-sm btn-outline"
            onClick={() => handleViewTestimonial(testimonial)}
            title="View"
          >
            <i className="fas fa-eye"></i>
          </button>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => handleEditTestimonial(testimonial)}
            title="Edit"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDeleteTestimonial(testimonial.testimonial_id)}
            title="Delete"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )
    }
  ];

  const testimonialFormFields = [
    {
      name: 'client_name',
      label: 'Client Name',
      type: 'text',
      required: true,
      placeholder: 'Enter client name'
    },
    {
      name: 'client_designation',
      label: 'Designation',
      type: 'text',
      required: false,
      placeholder: 'Enter client designation'
    },
    {
      name: 'client_company',
      label: 'Company',
      type: 'text',
      required: false,
      placeholder: 'Enter company name'
    },
    {
      name: 'course',
      label: 'Course',
      type: 'text',
      required: false,
      placeholder: 'Enter course name'
    },
    {
      name: 'testimonial_text',
      label: 'Testimonial Text',
      type: 'textarea',
      required: true,
      placeholder: 'Enter testimonial text',
      rows: 4
    },
    {
      name: 'client_image',
      label: 'Client Photo',
      type: 'file',
      accept: 'image/*',
      required: false
    },
    {
      name: 'testimonial_rating',
      label: 'Rating',
      type: 'select',
      required: true,
      options: [
        { value: 1, label: '1 Star' },
        { value: 2, label: '2 Stars' },
        { value: 3, label: '3 Stars' },
        { value: 4, label: '4 Stars' },
        { value: 5, label: '5 Stars' }
      ]
    },
    {
      name: 'testimonial_order',
      label: 'Display Order',
      type: 'number',
      required: false,
      placeholder: 'Enter display order (0 = first)'
    },
    {
      name: 'success_metrics',
      label: 'Success Metrics (JSON)',
      type: 'textarea',
      required: false,
      placeholder: 'Enter success metrics as JSON: {"projects": "5", "duration": "6 months", "outcome": "Got job"}',
      rows: 3
    },
    {
      name: 'testimonial_status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: '1', label: 'Active' },
        { value: '0', label: 'Inactive' }
      ]
    }
  ];

  if (isLoading) {
    return (
      <div className="testimonial-management loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="testimonial-management">
      <div className="page-header">
        <div className="page-title">
          <h1>Testimonial Management</h1>
          <p>Manage client testimonials and success stories</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleCreateTestimonial}
        >
          <i className="fas fa-plus"></i>
          Add New Testimonial
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
                  placeholder="Search testimonials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Courses</option>
                <option value="web-development">Web Development</option>
                <option value="data-science">Data Science</option>
                <option value="mobile-development">Mobile Development</option>
                <option value="cybersecurity">Cybersecurity</option>
                <option value="cloud-computing">Cloud Computing</option>
                <option value="other">Other</option>
              </select>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          </div>

          <div className="card-body">
            {error ? (
              <div className="error-message">
                <i className="fas fa-exclamation-triangle"></i>
                <p>Failed to load testimonials</p>
                <button onClick={() => window.location.reload()} className="btn btn-primary">
                  Try Again
                </button>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={testimonialsData?.data || []}
                loading={isLoading}
                currentPage={currentPage}
                totalPages={testimonialsData?.pages || 0}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>

      {/* Testimonial Form Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>{editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowModal(false);
                  setEditingTestimonial(null);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <FormModal
                title={editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                fields={testimonialFormFields || []}
                initialData={editingTestimonial || {}}
                onSubmit={handleFormSubmit}
                onClose={() => {
                  setShowModal(false);
                  setEditingTestimonial(null);
                }}
                loading={createTestimonialMutation.isPending || updateTestimonialMutation.isPending}
              />
            </div>
          </div>
        </div>
      )}

      {/* Testimonial View Modal */}
      {viewingTestimonial && (
        <div className="modal-overlay">
          <div className="modal-container large">
            <div className="modal-header">
              <h2>{viewingTestimonial.client_name}'s Testimonial</h2>
              <button 
                className="modal-close"
                onClick={() => setViewingTestimonial(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="testimonial-view">
                <div className="testimonial-header">
                  <div className="client-info">
                    <div className="client-avatar-large">
                      {viewingTestimonial.client_image ? (
                        <img 
                          src={viewingTestimonial.client_image} 
                          alt={viewingTestimonial.client_name}
                        />
                      ) : (
                        <div className="avatar-placeholder-large">
                          <i className="fas fa-user"></i>
                        </div>
                      )}
                    </div>
                    <div className="client-details-large">
                      <h3>{viewingTestimonial.client_name}</h3>
                      <p className="client-designation">{viewingTestimonial.client_designation || 'N/A'}</p>
                      <p className="client-company">{viewingTestimonial.client_company || 'N/A'}</p>
                      {viewingTestimonial.course && (
                        <span className="course-badge">{viewingTestimonial.course}</span>
                      )}
                    </div>
                  </div>
                  <div className="testimonial-rating-large">
                    {[...Array(5)].map((_, index) => (
                      <i 
                        key={index}
                        className={`fas fa-star ${index < viewingTestimonial.testimonial_rating ? 'filled' : ''}`}
                      ></i>
                    ))}
                  </div>
                </div>
                <div className="testimonial-content">
                  <blockquote>
                    "{viewingTestimonial.testimonial_text}"
                  </blockquote>
                </div>
                {viewingTestimonial.success_metrics && Object.keys(viewingTestimonial.success_metrics).length > 0 && (
                  <div className="success-metrics">
                    <h4>Success Metrics</h4>
                    <div className="metrics-grid">
                      {Object.entries(viewingTestimonial.success_metrics).map(([key, value]) => (
                        <div key={key} className="metric-item-large">
                          <strong>{key.replace('_', ' ').toUpperCase()}:</strong>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
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

export default TestimonialManagement;