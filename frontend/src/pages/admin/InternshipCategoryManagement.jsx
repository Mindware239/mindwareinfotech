import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './InternshipCategoryManagement.css';

const InternshipCategoryManagement = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    color: '#3B82F6',
    sort_order: 0,
    is_active: true
  });

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/course-categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch categories');
      }
      
      const data = await response.json();
      console.log('Categories data:', data); // Debug log
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    setError(null); // Clear any previous errors when component mounts
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingCategory 
        ? `http://localhost:5000/api/admin/course-categories/${editingCategory.id}`
        : 'http://localhost:5000/api/admin/course-categories';
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Failed to save category');
      
      await fetchCategories();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle edit
  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || '',
      color: category.color || '#3B82F6',
      sort_order: category.sort_order || 0,
      is_active: category.is_active
    });
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    if (deletingId === categoryId) return; // Prevent multiple delete attempts
    
    setDeletingId(categoryId);
    
    try {
      const response = await fetch(`http://localhost:5000/api/admin/course-categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        // Successfully deleted, refresh the list
        await fetchCategories();
        setError(null); // Clear any previous errors
      } else if (response.status === 404) {
        // Category already deleted, just refresh the list
        await fetchCategories();
        setError(null); // Clear any previous errors
      } else {
        // Other error
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete category');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon: '',
      color: '#3B82F6',
      sort_order: 0,
      is_active: true
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  if (loading) {
    return (
      <div className="internship-category-management">
        <div className="loading">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="internship-category-management">
      <div className="page-header">
        <h1>Internship Categories</h1>
        <p>Manage internship categories and pricing</p>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add New Category
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Debug Info */}
      <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
        <p><strong>Debug Info:</strong></p>
        <p>Categories count: {categories.length}</p>
        <p>Loading: {loading.toString()}</p>
        <p>Error: {error || 'None'}</p>
      </div>

      {/* Categories List */}
      <div className="categories-grid">
        {categories.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            <p>No categories found. Add your first category using the button above.</p>
          </div>
        ) : (
          categories.map(category => (
          <div key={category.id} className="category-card">
            <div className="category-header">
              <div 
                className="category-icon"
                style={{ backgroundColor: category.color }}
              >
                {category.icon || '📁'}
              </div>
              <div className="category-info">
                <h3>{category.name}</h3>
                <p className="category-slug">/{category.slug}</p>
              </div>
            </div>
            
            {category.description && (
              <p className="category-description">{category.description}</p>
            )}
            
            <div className="category-meta">
              <span className={`status ${category.is_active ? 'active' : 'inactive'}`}>
                {category.is_active ? 'Active' : 'Inactive'}
              </span>
              <span className="sort-order">Order: {category.sort_order}</span>
            </div>
            
            <div className="category-actions">
              <button 
                className="btn btn-sm btn-secondary"
                onClick={() => handleEdit(category)}
              >
                Edit
              </button>
              <button 
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(category.id)}
                disabled={deletingId === category.id}
              >
                {deletingId === category.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
          ))
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-group">
                <label htmlFor="name">Category Name *</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  required
                  placeholder="e.g., Web Development"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="slug">Slug *</label>
                <input
                  type="text"
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  required
                  placeholder="web-development"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this category"
                  rows="3"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="icon">Icon</label>
                  <input
                    type="text"
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="💻"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="color">Color</label>
                  <input
                    type="color"
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="sort_order">Sort Order</label>
                  <input
                    type="number"
                    id="sort_order"
                    value={formData.sort_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    />
                    Active
                  </label>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipCategoryManagement;
