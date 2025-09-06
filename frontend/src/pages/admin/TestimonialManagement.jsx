import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import testimonialService from '../../services/testimonialService';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';
import './TestimonialManagement.css';

const TestimonialManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [viewingTestimonial, setViewingTestimonial] = useState(null);
  const queryClient = useQueryClient();

  // Fetch testimonials
  const { data: testimonialsData, isLoading, error } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => testimonialService.getTestimonials({ limit: 50 })
  });

  // Create testimonial mutation
  const createMutation = useMutation({
    mutationFn: testimonialService.createTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries(['testimonials']);
      setIsModalOpen(false);
      setEditingTestimonial(null);
    }
  });

  // Update testimonial mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => testimonialService.updateTestimonial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['testimonials']);
      setIsModalOpen(false);
      setEditingTestimonial(null);
    }
  });

  // Delete testimonial mutation
  const deleteMutation = useMutation({
    mutationFn: testimonialService.deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries(['testimonials']);
    }
  });

  const handleAdd = () => {
    setEditingTestimonial(null);
    setIsModalOpen(true);
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setIsModalOpen(true);
  };

  const handleView = (testimonial) => {
    setViewingTestimonial(testimonial);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingTestimonial) {
        await updateMutation.mutateAsync({
          id: editingTestimonial.testimonial_id,
          data: formData
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
    }
  };

  const columns = [
    {
      key: 'testimonial_id',
      title: 'ID',
      width: '60px'
    },
    {
      key: 'client_name',
      title: 'Name',
      width: '150px'
    },
    {
      key: 'client_designation',
      title: 'Designation',
      width: '150px'
    },
    {
      key: 'course',
      title: 'Course',
      width: '150px'
    },
    {
      key: 'testimonial_rating',
      title: 'Rating',
      width: '100px',
      render: (rating) => (
        <div className="rating-display">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`star ${i < rating ? 'filled' : ''}`}
            >
              ★
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'testimonial_status',
      title: 'Status',
      width: '100px',
      render: (status) => (
        <span className={`status-badge ${status === '1' ? 'active' : 'inactive'}`}>
          {status === '1' ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'created_at',
      title: 'Created',
      width: '120px',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      key: 'actions',
      title: 'Actions',
      width: '120px',
      render: (_, testimonial) => (
        <div className="action-buttons">
          <button
            className="btn-action view"
            onClick={() => handleView(testimonial)}
            title="View"
          >
            👁️
          </button>
          <button
            className="btn-action edit"
            onClick={() => handleEdit(testimonial)}
            title="Edit"
          >
            ✏️
          </button>
          <button
            className="btn-action delete"
            onClick={() => handleDelete(testimonial.testimonial_id)}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      )
    }
  ];

  const formFields = [
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
      placeholder: 'Enter designation'
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
      label: 'Course/Program',
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
      label: 'Profile Image URL',
      type: 'text',
      required: false,
      placeholder: 'Enter image URL'
    },
    {
      name: 'testimonial_rating',
      label: 'Rating',
      type: 'select',
      required: true,
      options: [
        { value: 1, label: '1 Star - Poor' },
        { value: 2, label: '2 Stars - Fair' },
        { value: 3, label: '3 Stars - Good' },
        { value: 4, label: '4 Stars - Very Good' },
        { value: 5, label: '5 Stars - Excellent' }
      ]
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
    },
    {
      name: 'testimonial_order',
      label: 'Display Order',
      type: 'number',
      required: false,
      placeholder: 'Enter display order (0 = first)'
    }
  ];

  if (isLoading) return <div className="loading">Loading testimonials...</div>;
  if (error) return <div className="error">Error loading testimonials: {error.message}</div>;

  return (
    <div className="testimonial-management-page">
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Testimonials & Reviews</h1>
            <p>Manage student testimonials and reviews</p>
          </div>
          <div className="header-right">
            <button className="btn btn-primary" onClick={handleAdd}>
              <span className="btn-icon">+</span>
              Add Testimonial
            </button>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="content-section">
          <h2>All Testimonials</h2>
          <DataTable
            columns={columns}
            data={testimonialsData?.data || []}
            loading={isLoading}
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTestimonial(null);
        }}
        title={editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
        fields={formFields}
        initialData={editingTestimonial}
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      {/* View Modal */}
      {viewingTestimonial && (
        <div className="modal-overlay" onClick={() => setViewingTestimonial(null)}>
          <div className="modal-content view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>View Testimonial</h2>
              <button
                className="modal-close"
                onClick={() => setViewingTestimonial(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="testimonial-view">
                <div className="testimonial-profile">
                  {viewingTestimonial.client_image && (
                    <img
                      src={viewingTestimonial.client_image}
                      alt={viewingTestimonial.client_name}
                      className="profile-image"
                    />
                  )}
                  <div className="profile-info">
                    <h3>{viewingTestimonial.client_name}</h3>
                    <p className="designation">{viewingTestimonial.client_designation}</p>
                    {viewingTestimonial.client_company && (
                      <p className="company">{viewingTestimonial.client_company}</p>
                    )}
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`star ${i < viewingTestimonial.testimonial_rating ? 'filled' : ''}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="testimonial-content">
                  {viewingTestimonial.course && (
                    <div className="course-info">
                      <span className="course-icon">🎓</span>
                      <span>{viewingTestimonial.course}</span>
                    </div>
                  )}
                  <blockquote className="testimonial-text">
                    "{viewingTestimonial.testimonial_text}"
                  </blockquote>
                  {viewingTestimonial.success_metrics && (
                    <div className="success-metrics">
                      <h4>Success Metrics</h4>
                      <div className="metrics-grid">
                        {Object.entries(viewingTestimonial.success_metrics).map(([key, value]) => (
                          <div key={key} className="metric-item">
                            <span className="metric-label">{key}:</span>
                            <span className="metric-value">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setViewingTestimonial(null)}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setViewingTestimonial(null);
                  handleEdit(viewingTestimonial);
                }}
              >
                Edit Testimonial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialManagement;
