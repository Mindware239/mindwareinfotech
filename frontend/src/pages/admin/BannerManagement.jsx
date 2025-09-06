import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';
import './BannerManagement.css';

const BannerManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [viewingBanner, setViewingBanner] = useState(null);
  const queryClient = useQueryClient();

  // Mock data for banners
  const bannersData = {
    data: [
      {
        id: 1,
        name: "Hero Banner 1",
        title: "Join Our Growing Team",
        subtitle: "Explore Exciting Career Opportunities",
        description: "Be part of our innovative team and work on cutting-edge projects.",
        button1Text: "View Jobs",
        button1Link: "/careers",
        button2Text: "Apply Now",
        button2Link: "/apply",
        image: "/images/banners/hero-1.jpg",
        position: "hero",
        order: 1,
        status: "active",
        createdAt: "2024-01-15"
      },
      {
        id: 2,
        name: "Internship Banner",
        title: "Internship Program – Mindware India",
        subtitle: "Kickstart Your Career with Our Internship Program",
        description: "Gain real-world experience in Software Development, Web Design, and IT Solutions.",
        button1Text: "Contact Us",
        button1Link: "/contact",
        button2Text: "Learn More",
        button2Link: "/internships",
        image: "/images/banners/internship.jpg",
        position: "hero",
        order: 2,
        status: "active",
        createdAt: "2024-01-20"
      }
    ]
  };

  const handleAdd = () => {
    setEditingBanner(null);
    setIsModalOpen(true);
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setIsModalOpen(true);
  };

  const handleView = (banner) => {
    setViewingBanner(banner);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      // Implement delete logic
      console.log('Delete banner:', id);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingBanner) {
        console.log('Update banner:', editingBanner.id, formData);
      } else {
        console.log('Create banner:', formData);
      }
      setIsModalOpen(false);
      setEditingBanner(null);
    } catch (error) {
      console.error('Error saving banner:', error);
    }
  };

  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: '60px'
    },
    {
      key: 'name',
      title: 'Banner Name',
      width: '200px'
    },
    {
      key: 'title',
      title: 'Title',
      width: '250px'
    },
    {
      key: 'position',
      title: 'Position',
      width: '120px',
      render: (banner) => {
        const position = banner.position || '';
        return (
          <span className={`position-badge ${position}`}>
            {position ? position.charAt(0).toUpperCase() + position.slice(1) : 'N/A'}
          </span>
        );
      }
    },
    {
      key: 'order',
      title: 'Order',
      width: '80px'
    },
    {
      key: 'status',
      title: 'Status',
      width: '100px',
      render: (status) => (
        <span className={`status-badge ${status === 'active' ? 'active' : 'inactive'}`}>
          {status === 'active' ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'createdAt',
      title: 'Created',
      width: '120px',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      key: 'actions',
      title: 'Actions',
      width: '120px',
      render: (_, banner) => (
        <div className="action-buttons">
          <button
            className="btn-action view"
            onClick={() => handleView(banner)}
            title="View"
          >
            👁️
          </button>
          <button
            className="btn-action edit"
            onClick={() => handleEdit(banner)}
            title="Edit"
          >
            ✏️
          </button>
          <button
            className="btn-action delete"
            onClick={() => handleDelete(banner.id)}
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
      name: 'name',
      label: 'Banner Name',
      type: 'text',
      required: true,
      placeholder: 'Enter banner name'
    },
    {
      name: 'title',
      label: 'Main Title',
      type: 'text',
      required: true,
      placeholder: 'Enter main title'
    },
    {
      name: 'subtitle',
      label: 'Subtitle',
      type: 'text',
      required: false,
      placeholder: 'Enter subtitle'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: false,
      placeholder: 'Enter description',
      rows: 3
    },
    {
      name: 'button1Text',
      label: 'Button 1 Text',
      type: 'text',
      required: false,
      placeholder: 'Enter button text'
    },
    {
      name: 'button1Link',
      label: 'Button 1 Link',
      type: 'text',
      required: false,
      placeholder: 'Enter button link'
    },
    {
      name: 'button2Text',
      label: 'Button 2 Text',
      type: 'text',
      required: false,
      placeholder: 'Enter button text'
    },
    {
      name: 'button2Link',
      label: 'Button 2 Link',
      type: 'text',
      required: false,
      placeholder: 'Enter button link'
    },
    {
      name: 'image',
      label: 'Banner Image URL',
      type: 'text',
      required: false,
      placeholder: 'Enter image URL'
    },
    {
      name: 'position',
      label: 'Position',
      type: 'select',
      required: true,
      options: [
        { value: 'hero', label: 'Hero Section' },
        { value: 'about', label: 'About Section' },
        { value: 'services', label: 'Services Section' },
        { value: 'footer', label: 'Footer Section' }
      ]
    },
    {
      name: 'order',
      label: 'Display Order',
      type: 'number',
      required: true,
      placeholder: 'Enter display order (0 = first)'
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  ];

  return (
    <div className="banner-management-page">
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Banner Management</h1>
            <p>Manage website banners and promotional content</p>
          </div>
          <div className="header-right">
            <button className="btn btn-primary" onClick={handleAdd}>
              <span className="btn-icon">+</span>
              Add Banner
            </button>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="content-section">
          <h2>All Banners</h2>
          <DataTable
            columns={columns}
            data={bannersData.data}
            loading={false}
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBanner(null);
        }}
        title={editingBanner ? 'Edit Banner' : 'Add Banner'}
        fields={formFields}
        initialData={editingBanner}
        onSubmit={handleSubmit}
        loading={false}
      />

      {/* View Modal */}
      {viewingBanner && (
        <div className="modal-overlay" onClick={() => setViewingBanner(null)}>
          <div className="modal-content view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>View Banner</h2>
              <button
                className="modal-close"
                onClick={() => setViewingBanner(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="banner-preview">
                <div className="banner-image">
                  {viewingBanner.image ? (
                    <img src={viewingBanner.image} alt={viewingBanner.name} />
                  ) : (
                    <div className="image-placeholder">No Image</div>
                  )}
                </div>
                <div className="banner-details">
                  <h3>{viewingBanner.title}</h3>
                  {viewingBanner.subtitle && <h4>{viewingBanner.subtitle}</h4>}
                  {viewingBanner.description && <p>{viewingBanner.description}</p>}
                  <div className="banner-buttons">
                    {viewingBanner.button1Text && (
                      <a href={viewingBanner.button1Link} className="btn btn-primary">
                        {viewingBanner.button1Text}
                      </a>
                    )}
                    {viewingBanner.button2Text && (
                      <a href={viewingBanner.button2Link} className="btn btn-secondary">
                        {viewingBanner.button2Text}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setViewingBanner(null)}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setViewingBanner(null);
                  handleEdit(viewingBanner);
                }}
              >
                Edit Banner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManagement;
