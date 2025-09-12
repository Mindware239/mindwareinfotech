import React, { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import './CategoryManagement.css';

const CategoryManagement = () => {
  const { showSuccess, showError } = useNotification();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#4f46e5',
    icon: 'fas fa-folder',
    isActive: true
  });

  const predefinedCategories = [
    { name: 'Web Development', description: 'Frontend and backend web technologies', color: '#4f46e5', icon: 'fas fa-code' },
    { name: 'Mobile Development', description: 'iOS and Android app development', color: '#059669', icon: 'fas fa-mobile-alt' },
    { name: 'Data Science', description: 'Data analysis and machine learning', color: '#dc2626', icon: 'fas fa-chart-bar' },
    { name: 'AI & Machine Learning', description: 'Artificial intelligence and ML algorithms', color: '#7c3aed', icon: 'fas fa-robot' },
    { name: 'Programming', description: 'General programming languages and concepts', color: '#f59e0b', icon: 'fas fa-terminal' },
    { name: 'Database', description: 'Database design and management', color: '#10b981', icon: 'fas fa-database' },
    { name: 'DevOps', description: 'Development operations and deployment', color: '#ef4444', icon: 'fas fa-server' },
    { name: 'Cybersecurity', description: 'Security and ethical hacking', color: '#8b5cf6', icon: 'fas fa-shield-alt' },
    { name: 'Design', description: 'UI/UX and graphic design', color: '#f97316', icon: 'fas fa-palette' },
    { name: 'Other', description: 'Miscellaneous categories', color: '#6b7280', icon: 'fas fa-ellipsis-h' }
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // For now, use predefined categories
      // In a real app, you'd fetch from API
      setCategories(predefinedCategories);
    } catch (error) {
      showError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showError('Category name is required');
      return;
    }

    if (editingCategory) {
      // Update existing category
      setCategories(prev => 
        prev.map(cat => 
          cat.name === editingCategory.name 
            ? { ...cat, ...formData }
            : cat
        )
      );
      showSuccess('Category updated successfully');
    } else {
      // Add new category
      setCategories(prev => [...prev, { ...formData, id: Date.now() }]);
      showSuccess('Category added successfully');
    }

    resetForm();
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData(category);
    setShowForm(true);
  };

  const handleDelete = (categoryName) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(cat => cat.name !== categoryName));
      showSuccess('Category deleted successfully');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#4f46e5',
      icon: 'fas fa-folder',
      isActive: true
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  const toggleCategoryStatus = (categoryName) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.name === categoryName 
          ? { ...cat, isActive: !cat.isActive }
          : cat
      )
    );
  };

  if (loading) {
    return (
      <div className="category-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-management">
      <div className="page-header">
        <h1>Course Categories</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          <i className="fas fa-plus"></i>
          Add Category
        </button>
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <div className="form-header">
              <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
              <button 
                className="close-btn"
                onClick={resetForm}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-control"
                  rows="3"
                  placeholder="Enter category description"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="form-control color-input"
                  />
                </div>

                <div className="form-group">
                  <label>Icon</label>
                  <select
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="fas fa-folder">Folder</option>
                    <option value="fas fa-code">Code</option>
                    <option value="fas fa-mobile-alt">Mobile</option>
                    <option value="fas fa-chart-bar">Chart</option>
                    <option value="fas fa-robot">Robot</option>
                    <option value="fas fa-terminal">Terminal</option>
                    <option value="fas fa-database">Database</option>
                    <option value="fas fa-server">Server</option>
                    <option value="fas fa-shield-alt">Shield</option>
                    <option value="fas fa-palette">Palette</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  Active Category
                </label>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="categories-grid">
        {categories.map((category, index) => (
          <div 
            key={index}
            className={`category-card ${!category.isActive ? 'inactive' : ''}`}
          >
            <div className="category-header">
              <div 
                className="category-icon"
                style={{ backgroundColor: category.color }}
              >
                <i className={category.icon}></i>
              </div>
              <div className="category-actions">
                <button
                  className="action-btn edit-btn"
                  onClick={() => handleEdit(category)}
                  title="Edit Category"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(category.name)}
                  title="Delete Category"
                >
                  <i className="fas fa-trash"></i>
                </button>
                <button
                  className="action-btn toggle-btn"
                  onClick={() => toggleCategoryStatus(category.name)}
                  title={category.isActive ? 'Deactivate' : 'Activate'}
                >
                  <i className={`fas fa-${category.isActive ? 'eye-slash' : 'eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="category-content">
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <div className="category-stats">
                <span className="stat">
                  <i className="fas fa-book"></i>
                  0 Courses
                </span>
                <span className={`status ${category.isActive ? 'active' : 'inactive'}`}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManagement;
