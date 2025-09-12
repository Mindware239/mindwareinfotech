import React, { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';
import faqService from '../../services/faqService';
import { useNotification } from '../../context/NotificationContext';
import './FAQManagement.css';

const FAQManagement = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    fetchFAQs();
    fetchCategories();
  }, [currentPage, searchTerm, filterCategory, filterStatus]);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        category: filterCategory !== 'all' ? filterCategory : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined
      };
      
      const response = await faqService.getFAQs(params);
      setFaqs(response.data || []);
      setTotalPages(response.pages || 1);
    } catch (err) {
      setError('Failed to load FAQs');
      console.error('Error fetching FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await faqService.getFAQCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleCreateFAQ = () => {
    setEditingFaq(null);
    setShowModal(true);
  };

  const handleEditFAQ = (faq) => {
    setEditingFaq(faq);
    setShowModal(true);
  };

  const handleSaveFAQ = async (faqData) => {
    try {
      if (editingFaq) {
        await faqService.updateFAQ(editingFaq.id, faqData);
        showSuccess('FAQ updated successfully!');
      } else {
        await faqService.createFAQ(faqData);
        showSuccess('FAQ created successfully!');
      }
      setShowModal(false);
      setEditingFaq(null);
      fetchFAQs();
    } catch (err) {
      showError('Failed to save FAQ: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDeleteFAQ = async (faqId) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        await faqService.deleteFAQ(faqId);
        showSuccess('FAQ deleted successfully!');
        fetchFAQs();
      } catch (err) {
        showError('Failed to delete FAQ: ' + (err.message || 'Unknown error'));
      }
    }
  };

  const handleStatusChange = async (faqId, newStatus) => {
    try {
      await faqService.updateFAQ(faqId, { status: newStatus });
      showSuccess('FAQ status updated successfully!');
      fetchFAQs();
    } catch (err) {
      showError('Failed to update FAQ status: ' + (err.message || 'Unknown error'));
    }
  };

  const columns = [
    {
      key: 'question',
      label: 'Question',
      render: (faq) => (
        <div className="faq-question-cell">
          <h4>{faq.question}</h4>
          <p className="faq-answer-preview">{faq.answer.substring(0, 100)}...</p>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (faq) => (
        <span className={`category-badge category-${faq.category}`}>
          {faq.category}
        </span>
      )
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (faq) => (
        <span className="priority-badge">
          {faq.priority}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (faq) => (
        <select
          value={faq.status}
          onChange={(e) => handleStatusChange(faq.id, e.target.value)}
          className={`status-select status-${faq.status}`}
        >
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      )
    },
    {
      key: 'is_featured',
      label: 'Featured',
      render: (faq) => (
        <span className={`featured-badge ${faq.is_featured ? 'featured' : ''}`}>
          {faq.is_featured ? 'Yes' : 'No'}
        </span>
      )
    },
    {
      key: 'views',
      label: 'Views',
      render: (faq) => (
        <span className="views-count">{faq.views}</span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (faq) => (
        <div className="action-buttons">
          <button
            onClick={() => handleEditFAQ(faq)}
            className="btn btn-sm btn-primary"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteFAQ(faq.id)}
            className="btn btn-sm btn-danger"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  const faqFormFields = [
    {
      name: 'question',
      label: 'Question',
      type: 'textarea',
      required: true,
      placeholder: 'Enter the FAQ question...'
    },
    {
      name: 'answer',
      label: 'Answer',
      type: 'textarea',
      required: true,
      placeholder: 'Enter the FAQ answer...',
      rows: 4
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      options: [
        { value: 'general', label: 'General' },
        { value: 'courses', label: 'Courses' },
        { value: 'enrollment', label: 'Enrollment' },
        { value: 'payment', label: 'Payment' },
        { value: 'technical', label: 'Technical' },
        { value: 'support', label: 'Support' },
        { value: 'billing', label: 'Billing' },
        { value: 'refund', label: 'Refund' },
        { value: 'certificate', label: 'Certificate' },
        { value: 'internship', label: 'Internship' }
      ]
    },
    {
      name: 'priority',
      label: 'Priority',
      type: 'number',
      min: 0,
      max: 100,
      placeholder: '0-100 (higher = more important)'
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    },
    {
      name: 'is_featured',
      label: 'Featured FAQ',
      type: 'checkbox',
      description: 'Show this FAQ prominently on the website'
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'text',
      placeholder: 'Enter tags separated by commas',
      description: 'Tags will be auto-generated if left empty'
    }
  ];

  return (
    <div className="faq-management-page">
      <div className="page-header">
        <h1>FAQ Management</h1>
        <p>Manage frequently asked questions</p>
      </div>
      
      <div className="page-content">
        <div className="content-card">
          <div className="card-header">
            <div className="header-actions">
              <button
                onClick={handleCreateFAQ}
                className="btn btn-primary"
              >
                <i className="fas fa-plus"></i>
                Add New FAQ
              </button>
            </div>
          </div>

          <div className="filters-section">
            <div className="filter-group">
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-group">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.category} value={cat.category}>
                    {cat.category} ({cat.count})
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="table-container">
            {error ? (
              <div className="error-message">
                <p>{error}</p>
                <button
                  onClick={fetchFAQs}
                  className="btn btn-secondary"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={faqs}
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
          title={editingFaq ? 'Edit FAQ' : 'Create New FAQ'}
          fields={faqFormFields}
          initialData={editingFaq}
          onSubmit={handleSaveFAQ}
          onClose={() => {
            setShowModal(false);
            setEditingFaq(null);
          }}
        />
      )}
    </div>
  );
};

export default FAQManagement;
