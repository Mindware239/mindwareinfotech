import React, { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';
import internshipService from '../../services/internshipService';
import './InternshipManagement.css';

const InternshipManagement = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingInternship, setEditingInternship] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchInternships();
  }, [currentPage, searchTerm, filterStatus]);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        status: filterStatus !== 'all' ? filterStatus : undefined
      };
      
      const response = await internshipService.getInternships(params);
      setInternships(response.data || []);
      setTotalPages(response.pages || 1);
    } catch (err) {
      setError('Failed to load internships');
      console.error('Error fetching internships:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInternship = () => {
    setEditingInternship(null);
    setShowModal(true);
  };

  const handleEditInternship = (internship) => {
    setEditingInternship(internship);
    setShowModal(true);
  };

  const handleDeleteInternship = async (internshipId) => {
    if (window.confirm('Are you sure you want to delete this internship?')) {
      try {
        await internshipService.deleteInternship(internshipId);
        fetchInternships();
      } catch (err) {
        console.error('Error deleting internship:', err);
        alert('Failed to delete internship');
      }
    }
  };

  const handleSaveInternship = async (internshipData) => {
    try {
      if (editingInternship) {
        await internshipService.updateInternship(editingInternship.id, internshipData);
      } else {
        await internshipService.createInternship(internshipData);
      }
      setShowModal(false);
      setEditingInternship(null);
      fetchInternships();
    } catch (err) {
      console.error('Error saving internship:', err);
      alert('Failed to save internship');
    }
  };

  const handleStatusChange = async (internshipId, newStatus) => {
    try {
      await internshipService.updateInternship(internshipId, { status: newStatus });
      fetchInternships();
    } catch (err) {
      console.error('Error updating internship status:', err);
      alert('Failed to update internship status');
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (internship) => (
        <div className="internship-title-cell">
          <h4>{internship.title}</h4>
          <p>{internship.company} • {internship.location}</p>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (internship) => {
        const type = internship.type || '';
        return (
          <span className={`type-badge type-${type}`}>
            {type ? type.toUpperCase() : 'N/A'}
          </span>
        );
      }
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (internship) => (
        <span>{internship.duration} {internship.duration_unit}</span>
      )
    },
    {
      key: 'stipend',
      label: 'Stipend',
      render: (internship) => (
        <span>
          {internship.stipend_amount > 0 
            ? `₹${internship.stipend_amount.toLocaleString()}` 
            : 'Unpaid'
          }
        </span>
      )
    },
    {
      key: 'applications',
      label: 'Applications',
      render: (internship) => (
        <span>
          {internship.current_applications}/{internship.max_applications}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (internship) => (
        <select 
          value={internship.status}
          onChange={(e) => handleStatusChange(internship.id, e.target.value)}
          className={`status-select status-${internship.status}`}
        >
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="closed">Closed</option>
          <option value="completed">Completed</option>
        </select>
      )
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (internship) => new Date(internship.created_at).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (internship) => (
        <div className="action-buttons">
          <button 
            className="btn btn-sm btn-outline"
            onClick={() => handleEditInternship(internship)}
            title="Edit"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button 
            className="btn btn-sm btn-danger"
            onClick={() => handleDeleteInternship(internship.id)}
            title="Delete"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )
    }
  ];

  const internshipFormFields = [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      placeholder: 'Enter internship title'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
      placeholder: 'Describe the internship role and responsibilities',
      rows: 5
    },
    {
      name: 'company',
      label: 'Company',
      type: 'text',
      required: true,
      placeholder: 'Company name'
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text',
      required: true,
      placeholder: 'Work location'
    },
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      required: true,
      options: [
        { value: 'remote', label: 'Remote' },
        { value: 'onsite', label: 'On-site' },
        { value: 'hybrid', label: 'Hybrid' }
      ]
    },
    {
      name: 'duration',
      label: 'Duration',
      type: 'number',
      required: true,
      placeholder: 'Duration in months'
    },
    {
      name: 'stipend_amount',
      label: 'Stipend Amount',
      type: 'number',
      placeholder: 'Monthly stipend amount'
    },
    {
      name: 'max_applications',
      label: 'Max Applications',
      type: 'number',
      required: true,
      placeholder: 'Maximum number of applications'
    },
    {
      name: 'application_deadline',
      label: 'Application Deadline',
      type: 'date',
      required: true
    },
    {
      name: 'start_date',
      label: 'Start Date',
      type: 'date',
      required: true
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      options: [
        { value: 'web-development', label: 'Web Development' },
        { value: 'mobile-development', label: 'Mobile Development' },
        { value: 'data-science', label: 'Data Science' },
        { value: 'ai-ml', label: 'AI/ML' },
        { value: 'design', label: 'Design' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'business', label: 'Business' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'active', label: 'Active' },
        { value: 'paused', label: 'Paused' },
        { value: 'closed', label: 'Closed' }
      ]
    }
  ];

  if (loading && internships.length === 0) {
    return (
      <div className="internship-management loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading internships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="internship-management">
      <div className="page-header">
        <div className="page-title">
          <h1>Internship Management</h1>
          <p>Manage internship postings and applications</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleCreateInternship}
        >
          <i className="fas fa-plus"></i>
          Add New Internship
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
                  placeholder="Search internships..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="card-body">
            {error ? (
              <div className="error-message">
                <i className="fas fa-exclamation-triangle"></i>
                <p>{error}</p>
                <button onClick={fetchInternships} className="btn btn-primary">
                  Try Again
                </button>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={internships}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <FormModal
          title={editingInternship ? 'Edit Internship' : 'Create New Internship'}
          fields={internshipFormFields}
          initialData={editingInternship}
          onSave={handleSaveInternship}
          onClose={() => {
            setShowModal(false);
            setEditingInternship(null);
          }}
        />
      )}
    </div>
  );
};

export default InternshipManagement;
