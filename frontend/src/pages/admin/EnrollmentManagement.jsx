import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DataTable from '../../components/admin/DataTable';
import EnrollmentForm from '../../components/forms/EnrollmentForm';
import EnrollmentPreview from '../../components/forms/EnrollmentPreview';
import enrollmentService from '../../services/enrollmentService';
import './EnrollmentManagement.css';

const EnrollmentManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const queryClient = useQueryClient();

  // Fetch enrollments
  const { data: enrollmentsData, isLoading, error } = useQuery({
    queryKey: ['enrollments', currentPage, pageSize, searchTerm, statusFilter],
    queryFn: () => enrollmentService.getEnrollments({
      page: currentPage,
      limit: pageSize,
      search: searchTerm,
      status: statusFilter !== 'all' ? statusFilter : undefined
    })
  });

  // Create enrollment mutation
  const createEnrollmentMutation = useMutation({
    mutationFn: enrollmentService.createEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries(['enrollments']);
      setShowForm(false);
      setEditingEnrollment(null);
    }
  });

  // Update enrollment mutation
  const updateEnrollmentMutation = useMutation({
    mutationFn: ({ id, data }) => enrollmentService.updateEnrollment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['enrollments']);
      setShowForm(false);
      setEditingEnrollment(null);
    }
  });

  // Delete enrollment mutation
  const deleteEnrollmentMutation = useMutation({
    mutationFn: enrollmentService.deleteEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries(['enrollments']);
    }
  });

  const handleCreateEnrollment = () => {
    setEditingEnrollment(null);
    setShowForm(true);
  };

  const handleEditEnrollment = (enrollment) => {
    setEditingEnrollment(enrollment);
    setShowForm(true);
  };

  const handleDeleteEnrollment = async (id) => {
    if (window.confirm('Are you sure you want to delete this enrollment?')) {
      await deleteEnrollmentMutation.mutateAsync(id);
    }
  };

  const handlePreviewEnrollment = (enrollment) => {
    setPreviewData(enrollment);
    setShowPreview(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingEnrollment) {
        await updateEnrollmentMutation.mutateAsync({
          id: editingEnrollment.id,
          data: formData
        });
      } else {
        await createEnrollmentMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error('Error saving enrollment:', error);
      alert('Failed to save enrollment');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateEnrollmentMutation.mutateAsync({
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
      key: 'student_info',
      title: 'Student Information',
      render: (enrollment) => (
        <div className="student-info-cell">
          <div className="student-avatar">
            {enrollment.profilePhoto ? (
              <img 
                src={enrollment.profilePhoto.url} 
                alt={enrollment.firstName}
                onError={(e) => {
                  e.target.src = '/images/avatars/default-avatar.jpg';
                }}
              />
            ) : (
              <div className="avatar-placeholder">
                <i className="fas fa-user"></i>
              </div>
            )}
          </div>
          <div className="student-details">
            <h4>{enrollment.firstName} {enrollment.lastName}</h4>
            <p>{enrollment.email}</p>
            <p>{enrollment.phone}</p>
          </div>
        </div>
      )
    },
    {
      key: 'course_info',
      title: 'Course Information',
      render: (enrollment) => (
        <div className="course-info-cell">
          <div className="course-name">
            <i className="fas fa-laptop-code"></i>
            <span>{enrollment.courseInterest || 'N/A'}</span>
          </div>
          <div className="course-details">
            <span className="training-mode">{enrollment.trainingMode || 'N/A'}</span>
            <span className="batch">{enrollment.preferredBatch || 'N/A'}</span>
          </div>
        </div>
      )
    },
    {
      key: 'education',
      title: 'Education',
      render: (enrollment) => (
        <div className="education-cell">
          <div className="qualification">
            <i className="fas fa-graduation-cap"></i>
            <span>{enrollment.highestQualification || 'N/A'}</span>
          </div>
          <div className="institution">{enrollment.institution || 'N/A'}</div>
        </div>
      )
    },
    {
      key: 'documents',
      title: 'Documents',
      render: (enrollment) => {
        const documentCount = [
          enrollment.profilePhoto,
          enrollment.resume,
          enrollment.idProof,
          enrollment.addressProof,
          ...(enrollment.certificates || [])
        ].filter(Boolean).length;
        
        return (
          <div className="documents-cell">
            <div className="document-count">
              <i className="fas fa-file"></i>
              <span>{documentCount} files</span>
            </div>
            <div className="document-status">
              {documentCount >= 3 ? (
                <span className="status-complete">Complete</span>
              ) : (
                <span className="status-incomplete">Incomplete</span>
              )}
            </div>
          </div>
        );
      }
    },
    {
      key: 'payment',
      title: 'Payment',
      render: (enrollment) => (
        <div className="payment-cell">
          <div className="payment-amount">
            {enrollment.paymentAmount ? `₹${enrollment.paymentAmount}` : 'N/A'}
          </div>
          <div className="payment-mode">{enrollment.paymentMode || 'N/A'}</div>
          <div className="payment-status">
            <span className={`status-badge status-${enrollment.paymentStatus || 'pending'}`}>
              {enrollment.paymentStatus || 'Pending'}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (enrollment) => (
        <select 
          value={enrollment.status || 'pending'}
          onChange={(e) => handleStatusChange(enrollment.id, e.target.value)}
          className={`status-select status-${enrollment.status || 'pending'}`}
        >
          <option value="pending">Pending</option>
          <option value="under-review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="enrolled">Enrolled</option>
          <option value="completed">Completed</option>
        </select>
      )
    },
    {
      key: 'created_at',
      title: 'Applied',
      render: (enrollment) => new Date(enrollment.created_at).toLocaleDateString()
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (enrollment) => (
        <div className="action-buttons">
          <button
            className="btn btn-sm btn-outline"
            onClick={() => handlePreviewEnrollment(enrollment)}
            title="Preview"
          >
            <i className="fas fa-eye"></i>
          </button>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => handleEditEnrollment(enrollment)}
            title="Edit"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDeleteEnrollment(enrollment.id)}
            title="Delete"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="enrollment-management loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading enrollments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="enrollment-management">
      <div className="page-header">
        <div className="page-title">
          <h1>Enrollment Management</h1>
          <p>Manage student enrollments and applications</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleCreateEnrollment}
        >
          <i className="fas fa-plus"></i>
          Add New Enrollment
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
                  placeholder="Search enrollments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="under-review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="enrolled">Enrolled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="card-body">
            {error ? (
              <div className="error-message">
                <i className="fas fa-exclamation-triangle"></i>
                <p>Failed to load enrollments</p>
                <button onClick={() => window.location.reload()} className="btn btn-primary">
                  Try Again
                </button>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={enrollmentsData?.data || []}
                loading={isLoading}
                currentPage={currentPage}
                totalPages={enrollmentsData?.pages || 0}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>

      {/* Enrollment Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>{editingEnrollment ? 'Edit Enrollment' : 'Add New Enrollment'}</h2>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowForm(false);
                  setEditingEnrollment(null);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <EnrollmentForm
                onSubmit={handleFormSubmit}
                initialData={editingEnrollment}
                isEdit={!!editingEnrollment}
              />
            </div>
          </div>
        </div>
      )}

      {/* Enrollment Preview Modal */}
      {showPreview && previewData && (
        <EnrollmentPreview
          formData={previewData}
          onClose={() => {
            setShowPreview(false);
            setPreviewData(null);
          }}
          onEdit={() => {
            setShowPreview(false);
            setPreviewData(null);
            setEditingEnrollment(previewData);
            setShowForm(true);
          }}
        />
      )}
    </div>
  );
};

export default EnrollmentManagement;
