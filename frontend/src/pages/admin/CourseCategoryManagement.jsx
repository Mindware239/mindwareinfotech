import React, { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';
import { useNotification } from '../../context/NotificationContext';
import './CourseCategoryManagement.css';

const CourseCategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const { showSuccess, showError } = useNotification();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: 'fas fa-laptop-code',
    color: '#3B82F6',
    is_active: true,
    sort_order: 0,
    meta_title: '',
    meta_description: '',
    meta_keywords: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/course-categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories');
      showError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon: 'fas fa-laptop-code',
      color: '#3B82F6',
      is_active: true,
      sort_order: 0,
      meta_title: '',
      meta_description: '',
      meta_keywords: ''
    });
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || 'fas fa-laptop-code',
      color: category.color || '#3B82F6',
      is_active: category.is_active,
      sort_order: category.sort_order || 0,
      meta_title: category.meta_title || '',
      meta_description: category.meta_description || '',
      meta_keywords: category.meta_keywords || ''
    });
    setShowModal(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const response = await fetch(`/api/admin/course-categories/${categoryId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete category');
      
      setCategories(categories.filter(cat => cat.id !== categoryId));
      showSuccess('Category deleted successfully');
    } catch (err) {
      showError('Failed to delete category');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingCategory 
        ? `/api/admin/course-categories/${editingCategory.id}`
        : '/api/admin/course-categories';
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Failed to save category');
      
      const savedCategory = await response.json();
      
      if (editingCategory) {
        setCategories(categories.map(cat => 
          cat.id === editingCategory.id ? savedCategory : cat
        ));
        showSuccess('Category updated successfully');
      } else {
        setCategories([...categories, savedCategory]);
        showSuccess('Category created successfully');
      }
      
      setShowModal(false);
    } catch (err) {
      showError('Failed to save category');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleStatusToggle = async (categoryId, isActive) => {
    try {
      const response = await fetch(`/api/admin/course-categories/${categoryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: isActive })
      });
      
      if (!response.ok) throw new Error('Failed to update status');
      
      setCategories(categories.map(cat => 
        cat.id === categoryId ? { ...cat, is_active: isActive } : cat
      ));
      showSuccess('Status updated successfully');
    } catch (err) {
      showError('Failed to update status');
    }
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterActive === 'all' || 
                         (filterActive === 'active' && category.is_active) ||
                         (filterActive === 'inactive' && !category.is_active);
    return matchesSearch && matchesFilter;
  });

  const columns = [
    {
      key: 'name',
      label: 'Category',
      render: (category) => (
        <div className="category-cell">
          <div className="category-icon" style={{ color: category.color }}>
            <i className={category.icon}></i>
          </div>
          <div className="category-info">
            <h4>{category.name}</h4>
            <p>{category.slug}</p>
          </div>
        </div>
      )
    },
    {
      key: 'description',
      label: 'Description',
      render: (category) => (
        <div className="description-cell">
          {category.description ? (
            <p>{category.description.length > 100 
              ? `${category.description.substring(0, 100)}...` 
              : category.description}</p>
          ) : (
            <span className="no-description">No description</span>
          )}
        </div>
      )
    },
    {
      key: 'sort_order',
      label: 'Order',
      render: (category) => (
        <span className="sort-order">{category.sort_order}</span>
      )
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (category) => (
        <button
          className={`status-toggle ${category.is_active ? 'active' : 'inactive'}`}
          onClick={() => handleStatusToggle(category.id, !category.is_active)}
        >
          {category.is_active ? 'Active' : 'Inactive'}
        </button>
      )
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (category) => (
        <span>{new Date(category.createdAt).toLocaleDateString()}</span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (category) => (
        <div className="action-buttons">
          <button
            className="btn-edit"
            onClick={() => handleEditCategory(category)}
            title="Edit Category"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="btn-delete"
            onClick={() => handleDeleteCategory(category.id)}
            title="Delete Category"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="course-category-management">
      <div className="page-header">
        <h1>Course Categories</h1>
        <p>Manage course categories and their settings</p>
        <button className="btn-primary" onClick={handleCreateCategory}>
          <i className="fas fa-plus"></i>
          Add New Category
        </button>
      </div>

      <div className="filters">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <DataTable
        data={filteredCategories}
        columns={columns}
        loading={loading}
        error={error}
        emptyMessage="No categories found"
      />

      {showModal && (
        <FormModal
          title={editingCategory ? 'Edit Category' : 'Add New Category'}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        >
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Category Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Web Development"
              />
            </div>

            <div className="form-group">
              <label htmlFor="slug">Slug *</label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                placeholder="e.g., web-development"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="Brief description of the category"
              />
            </div>

            <div className="form-group">
              <label htmlFor="icon">Icon Class</label>
              <input
                type="text"
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                placeholder="e.g., fas fa-laptop-code"
              />
            </div>

            <div className="form-group">
              <label htmlFor="color">Color</label>
              <input
                type="color"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="sort_order">Sort Order</label>
              <input
                type="number"
                id="sort_order"
                name="sort_order"
                value={formData.sort_order}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                />
                Active
              </label>
            </div>

            <div className="form-group full-width">
              <label htmlFor="meta_title">Meta Title</label>
              <input
                type="text"
                id="meta_title"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleInputChange}
                placeholder="SEO title (max 60 characters)"
                maxLength="60"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="meta_description">Meta Description</label>
              <textarea
                id="meta_description"
                name="meta_description"
                value={formData.meta_description}
                onChange={handleInputChange}
                rows="2"
                placeholder="SEO description (max 160 characters)"
                maxLength="160"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="meta_keywords">Meta Keywords</label>
              <input
                type="text"
                id="meta_keywords"
                name="meta_keywords"
                value={formData.meta_keywords}
                onChange={handleInputChange}
                placeholder="SEO keywords (comma separated)"
              />
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
};

export default CourseCategoryManagement;
