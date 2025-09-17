import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import trainingService from '../../services/trainingService';
import DataTable from '../../components/admin/DataTable';
import './TrainingProgramManagement.css';

const TrainingProgramManagement = () => {
  const [trainingPrograms, setTrainingPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    category: '',
    subcategory: '',
    level: 'beginner',
    duration: '',
    duration_hours: 0,
    price: 0,
    original_price: 0,
    discount_percentage: 0,
    currency: 'INR',
    is_free: false,
    is_featured: false,
    status: 'published',
    image: '',
    thumbnail: '',
    skills: [],
    learning_outcomes: [],
    prerequisites: [],
    curriculum: [],
    instructor_id: '',
    instructor: {
      name: '',
      title: '',
      bio: '',
      rating: 0,
      students: 0,
      courses: 0
    },
    start_date: '',
    end_date: '',
    location: '',
    max_students: 0,
    enrolled_students: 0,
    rating: 0,
    total_reviews: 0,
    reviews: [],
    tags: [],
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_title: '',
    og_description: '',
    og_image: '',
    twitter_title: '',
    twitter_description: '',
    twitter_image: '',
    canonical_url: '',
    robots_meta: '',
    focus_keyword: '',
    seo_score: 0,
    metadata: {}
  });

  useEffect(() => {
    fetchTrainingPrograms();
    fetchCategories();
  }, []);

  const fetchTrainingPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch from API only - NO MOCK DATA
      const response = await trainingService.getTrainingPrograms({ limit: 100 });
      
      // Parse JSON strings from database
      const programs = Array.isArray(response.data) ? response.data.map(program => ({
        ...program,
        skills: typeof program.skills === 'string' ? JSON.parse(program.skills) : (program.skills || []),
        learning_outcomes: typeof program.learning_outcomes === 'string' ? JSON.parse(program.learning_outcomes) : (program.learning_outcomes || []),
        prerequisites: typeof program.prerequisites === 'string' ? JSON.parse(program.prerequisites) : (program.prerequisites || []),
        tags: typeof program.tags === 'string' ? JSON.parse(program.tags) : (program.tags || []),
        instructor: typeof program.instructor === 'string' ? JSON.parse(program.instructor) : (program.instructor || {}),
        curriculum: typeof program.curriculum === 'string' ? JSON.parse(program.curriculum) : (program.curriculum || []),
        reviews: typeof program.reviews === 'string' ? JSON.parse(program.reviews) : (program.reviews || []),
        metadata: typeof program.metadata === 'string' ? JSON.parse(program.metadata) : (program.metadata || {}),
        price: parseFloat(program.price) || 0,
        original_price: program.original_price ? parseFloat(program.original_price) : null,
        rating: parseFloat(program.rating) || 0
      })) : [];
      
      setTrainingPrograms(programs);
      
    } catch (err) {
      setError('Failed to load training programs. Please check if the server is running.');
      console.error('Error fetching training programs:', err);
      setTrainingPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await trainingService.getCourseCategories();
      setCategories(response || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    }
  };

  const handleAdd = () => {
    setFormData({
      title: '',
      description: '',
      short_description: '',
      category: '',
      subcategory: '',
      level: 'beginner',
      duration: '',
      duration_hours: 0,
      price: 0,
      original_price: 0,
      discount_percentage: 0,
      currency: 'INR',
      is_free: false,
      is_featured: false,
      status: 'published',
      image: '',
      thumbnail: '',
      skills: [],
      learning_outcomes: [],
      prerequisites: [],
      curriculum: [],
      instructor_id: '',
      instructor: {
        name: '',
        title: '',
        bio: '',
        rating: 0,
        students: 0,
        courses: 0
      },
      start_date: '',
      end_date: '',
      location: '',
      max_students: 0,
      enrolled_students: 0,
      rating: 0,
      total_reviews: 0,
      reviews: [],
      tags: [],
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      og_title: '',
      og_description: '',
      og_image: '',
      twitter_title: '',
      twitter_description: '',
      twitter_image: '',
      canonical_url: '',
      robots_meta: '',
      focus_keyword: '',
      seo_score: 0,
      metadata: {}
    });
    setSelectedProgram(null);
    setShowAddModal(true);
  };

  const handleEdit = (program) => {
    setSelectedProgram(program);
    setFormData({
      ...program,
      skills: Array.isArray(program.skills) ? program.skills : [],
      learning_outcomes: Array.isArray(program.learning_outcomes) ? program.learning_outcomes : [],
      prerequisites: Array.isArray(program.prerequisites) ? program.prerequisites : [],
      curriculum: Array.isArray(program.curriculum) ? program.curriculum : [],
      reviews: Array.isArray(program.reviews) ? program.reviews : [],
      tags: Array.isArray(program.tags) ? program.tags : [],
      instructor: program.instructor || {
        name: '',
        title: '',
        bio: '',
        rating: 0,
        students: 0,
        courses: 0
      },
      metadata: program.metadata || {}
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this training program?')) {
      try {
        await trainingService.deleteTrainingProgram(id);
        setTrainingPrograms(trainingPrograms.filter(program => program.id !== id));
      } catch (err) {
        console.error('Error deleting training program:', err);
        alert('Failed to delete training program');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare form data for submission
      const submitData = {
        ...formData,
        skills: JSON.stringify(formData.skills),
        learning_outcomes: JSON.stringify(formData.learning_outcomes),
        prerequisites: JSON.stringify(formData.prerequisites),
        tags: JSON.stringify(formData.tags),
        instructor: JSON.stringify(formData.instructor),
        curriculum: JSON.stringify([]),
        reviews: JSON.stringify([]),
        metadata: JSON.stringify({}),
        created_by: 1
      };

      if (selectedProgram) {
        // Update existing program
        const response = await trainingService.updateTrainingProgram(selectedProgram.id, submitData);
        setTrainingPrograms(trainingPrograms.map(program => 
          program.id === selectedProgram.id ? { ...program, ...formData } : program
        ));
        setShowEditModal(false);
        alert('Training program updated successfully!');
      } else {
        // Create new program
        const response = await trainingService.createTrainingProgram(submitData);
        setTrainingPrograms([...trainingPrograms, response.data]);
        setShowAddModal(false);
        alert('Training program created successfully!');
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        short_description: '',
        category: '',
        subcategory: '',
        level: 'beginner',
        duration: '',
        duration_hours: 0,
        price: 0,
        original_price: 0,
        discount_percentage: 0,
        currency: 'INR',
        is_free: false,
        is_featured: false,
        status: 'published',
        image: '',
        thumbnail: '',
        skills: [],
        learning_outcomes: [],
        prerequisites: [],
        curriculum: [],
        instructor_id: '',
        instructor: {
          name: '',
          title: '',
          bio: '',
          rating: 0,
          students: 0,
          courses: 0
        },
        start_date: '',
        end_date: '',
        location: '',
        max_students: 0,
        enrolled_students: 0,
        rating: 0,
        total_reviews: 0,
        reviews: [],
        tags: [],
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        og_title: '',
        og_description: '',
        og_image: '',
        twitter_title: '',
        twitter_description: '',
        twitter_image: '',
        canonical_url: '',
        robots_meta: '',
        focus_keyword: '',
        seo_score: 0,
        metadata: {}
      });
      setSelectedProgram(null);
    } catch (err) {
      console.error('Error saving training program:', err);
      
      // Handle validation errors
      if (err.response?.data?.errors) {
        const errorMessages = err.response.data.errors.map(error => 
          `${error.field}: ${error.message}`
        ).join('\n');
        alert(`Validation failed:\n${errorMessages}`);
      } else {
        alert(`Failed to save training program: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleArrayInputChange = (field, value) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (program) => (
        <div className="program-title">
          <h4>{program.title}</h4>
          <p className="program-category">{program.category}</p>
        </div>
      )
    },
    {
      key: 'level',
      label: 'Level',
      render: (program) => (
        <span className={`level-badge level-${program.level}`}>
          {program.level}
        </span>
      )
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (program) => (
        <div>
          <div>{program.duration}</div>
          <small>{program.duration_hours} hours</small>
        </div>
      )
    },
    {
      key: 'price',
      label: 'Price',
      render: (program) => (
        <div className="price-info">
          {program.is_free ? (
            <span className="free-badge">Free</span>
          ) : (
            <div>
              <div className="current-price">₹{program.price?.toLocaleString()}</div>
              {program.original_price > program.price && (
                <div className="original-price">₹{program.original_price?.toLocaleString()}</div>
              )}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (program) => (
        <span className={`status-badge status-${program.status}`}>
          {program.status}
        </span>
      )
    },
    {
      key: 'enrolled_students',
      label: 'Enrolled',
      render: (program) => (
        <div>
          <div>{program.enrolled_students || 0}</div>
          <small>of {program.max_students || '∞'}</small>
        </div>
      )
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (program) => (
        <div className="rating-info">
          <div className="rating-stars">
            {'★'.repeat(Math.floor(program.rating || 0))}
            {'☆'.repeat(5 - Math.floor(program.rating || 0))}
          </div>
          <small>({program.total_reviews || 0} reviews)</small>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (program) => (
        <div className="action-buttons">
          <button
            onClick={() => handleEdit(program)}
            className="btn btn-sm btn-primary"
            title="Edit"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            onClick={() => handleDelete(program.id)}
            className="btn btn-sm btn-danger"
            title="Delete"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="training-program-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading training programs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="training-program-management">
      <div className="page-header">
        <div className="header-content">
          <h1>Training Program Management</h1>
          <p>Manage all training programs and courses</p>
        </div>
        <div className="header-actions">
          <button onClick={handleAdd} className="btn btn-primary">
            <i className="fas fa-plus"></i> Add New Program
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <div className="stat-content">
            <h3>{trainingPrograms.length}</h3>
            <p>Total Programs</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>{trainingPrograms.reduce((sum, program) => sum + (program.enrolled_students || 0), 0)}</h3>
            <p>Total Enrolled</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-content">
            <h3>{trainingPrograms.filter(p => p.is_featured).length}</h3>
            <p>Featured Programs</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-gift"></i>
          </div>
          <div className="stat-content">
            <h3>{trainingPrograms.filter(p => p.is_free).length}</h3>
            <p>Free Programs</p>
          </div>
        </div>
      </div>

      <div className="table-container">
        <DataTable
          data={trainingPrograms}
          columns={columns}
          searchFields={['title', 'description', 'category', 'level']}
          pagination={true}
          itemsPerPage={10}
        />
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedProgram ? 'Edit Training Program' : 'Add New Training Program'}</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setSelectedProgram(null);
                }}
                className="btn btn-close"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-grid">
                {/* Basic Information */}
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category || ''}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Subcategory</label>
                  <input
                    type="text"
                    name="subcategory"
                    value={formData.subcategory || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., frontend, backend, full-stack"
                  />
                </div>
                <div className="form-group">
                  <label>Level *</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Duration *</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., 6 months"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duration Hours</label>
                  <input
                    type="number"
                    name="duration_hours"
                    value={formData.duration_hours || 0}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="e.g., 480"
                  />
                </div>
                <div className="form-group">
                  <label>Price (INR)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price || 0}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Original Price (INR)</label>
                  <input
                    type="number"
                    name="original_price"
                    value={formData.original_price || 0}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Discount Percentage</label>
                  <input
                    type="number"
                    name="discount_percentage"
                    value={formData.discount_percentage || 0}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="form-group">
                  <label>Currency</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., Online, Delhi, Mumbai"
                  />
                </div>
                <div className="form-group">
                  <label>Max Students</label>
                  <input
                    type="number"
                    name="max_students"
                    value={formData.max_students || 0}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="0 for unlimited"
                  />
                </div>
                <div className="form-group">
                  <label>Enrolled Students</label>
                  <input
                    type="number"
                    name="enrolled_students"
                    value={formData.enrolled_students || 0}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Rating</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating || 0}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>
                <div className="form-group">
                  <label>Total Reviews</label>
                  <input
                    type="number"
                    name="total_reviews"
                    value={formData.total_reviews || 0}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>SEO Score</label>
                  <input
                    type="number"
                    name="seo_score"
                    value={formData.seo_score || 0}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image || ''}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="form-group">
                  <label>Thumbnail URL</label>
                  <input
                    type="url"
                    name="thumbnail"
                    value={formData.thumbnail || ''}
                    onChange={handleInputChange}
                    placeholder="https://example.com/thumb.jpg"
                  />
                </div>
                <div className="form-group">
                  <label>Instructor ID</label>
                  <input
                    type="number"
                    name="instructor_id"
                    value={formData.instructor_id || ''}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Focus Keyword</label>
                  <input
                    type="text"
                    name="focus_keyword"
                    value={formData.focus_keyword || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., web development course"
                  />
                </div>
                <div className="form-group">
                  <label>Canonical URL</label>
                  <input
                    type="url"
                    name="canonical_url"
                    value={formData.canonical_url || ''}
                    onChange={handleInputChange}
                    placeholder="https://example.com/course"
                  />
                </div>
                <div className="form-group">
                  <label>Robots Meta</label>
                  <select
                    name="robots_meta"
                    value={formData.robots_meta || ''}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Robots Meta</option>
                    <option value="index, follow">Index, Follow</option>
                    <option value="noindex, nofollow">No Index, No Follow</option>
                    <option value="index, nofollow">Index, No Follow</option>
                    <option value="noindex, follow">No Index, Follow</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Short Description *</label>
                  <textarea
                    name="short_description"
                    value={formData.short_description || ''}
                    onChange={handleInputChange}
                    rows="3"
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    rows="5"
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label>Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={(formData.skills || []).join(', ')}
                    onChange={(e) => handleArrayInputChange('skills', e.target.value)}
                    placeholder="e.g., React, Node.js, MongoDB"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Learning Outcomes (comma-separated)</label>
                  <textarea
                    value={(formData.learning_outcomes || []).join(', ')}
                    onChange={(e) => handleArrayInputChange('learning_outcomes', e.target.value)}
                    rows="3"
                    placeholder="e.g., Build responsive websites, Create interactive applications"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Prerequisites (comma-separated)</label>
                  <textarea
                    value={(formData.prerequisites || []).join(', ')}
                    onChange={(e) => handleArrayInputChange('prerequisites', e.target.value)}
                    rows="3"
                    placeholder="e.g., Basic HTML knowledge, JavaScript fundamentals"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={(formData.tags || []).join(', ')}
                    onChange={(e) => handleArrayInputChange('tags', e.target.value)}
                    placeholder="e.g., web-development, react, javascript"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Meta Title</label>
                  <input
                    type="text"
                    name="meta_title"
                    value={formData.meta_title || ''}
                    onChange={handleInputChange}
                    placeholder="SEO title for search engines"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Meta Description</label>
                  <textarea
                    name="meta_description"
                    value={formData.meta_description || ''}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="SEO description for search engines"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Meta Keywords</label>
                  <input
                    type="text"
                    name="meta_keywords"
                    value={formData.meta_keywords || ''}
                    onChange={handleInputChange}
                    placeholder="SEO keywords separated by commas"
                  />
                </div>
                <div className="form-group full-width">
                  <label>OG Title</label>
                  <input
                    type="text"
                    name="og_title"
                    value={formData.og_title || ''}
                    onChange={handleInputChange}
                    placeholder="Open Graph title for social sharing"
                  />
                </div>
                <div className="form-group full-width">
                  <label>OG Description</label>
                  <textarea
                    name="og_description"
                    value={formData.og_description || ''}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Open Graph description for social sharing"
                  />
                </div>
                <div className="form-group">
                  <label>OG Image URL</label>
                  <input
                    type="url"
                    name="og_image"
                    value={formData.og_image || ''}
                    onChange={handleInputChange}
                    placeholder="https://example.com/og-image.jpg"
                  />
                </div>
                <div className="form-group">
                  <label>Twitter Title</label>
                  <input
                    type="text"
                    name="twitter_title"
                    value={formData.twitter_title || ''}
                    onChange={handleInputChange}
                    placeholder="Twitter card title"
                  />
                </div>
                <div className="form-group">
                  <label>Twitter Description</label>
                  <textarea
                    name="twitter_description"
                    value={formData.twitter_description || ''}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Twitter card description"
                  />
                </div>
                <div className="form-group">
                  <label>Twitter Image URL</label>
                  <input
                    type="url"
                    name="twitter_image"
                    value={formData.twitter_image || ''}
                    onChange={handleInputChange}
                    placeholder="https://example.com/twitter-image.jpg"
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleInputChange}
                    />
                    Featured Program
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="is_free"
                      checked={formData.is_free}
                      onChange={handleInputChange}
                    />
                    Free Program
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedProgram(null);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {selectedProgram ? 'Update Program' : 'Create Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingProgramManagement;
