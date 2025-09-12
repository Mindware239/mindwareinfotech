import React, { useState, useEffect } from 'react';
import courseService from '../../services/courseService';
import SEOForm from './SEOForm';
import { useNotification } from '../../context/NotificationContext';
import './CourseManagement.css';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const { showSuccess, showError } = useNotification();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    category: '',
    level: 'beginner',
    duration: 0,
    price: 0,
    is_free: false,
    status: 'draft',
    language: 'English',
    requirements: [],
    learning_outcomes: [],
    skills: [],
    seo: {}
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseService.getCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
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

  const handleArrayInputChange = (field, value) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const courseData = {
        ...formData,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price)
      };
      
      if (editingCourse) {
        await courseService.updateCourse(editingCourse.id, courseData);
        showSuccess('Course updated successfully!');
      } else {
        await courseService.createCourse(courseData);
        showSuccess('Course created successfully!');
      }
      
      setShowForm(false);
      setEditingCourse(null);
      resetForm();
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      showError('Failed to save course: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    
    // Helper function to safely parse array fields
    const parseArrayField = (field) => {
      if (!field) return [];
      if (Array.isArray(field)) return field;
      if (typeof field === 'string') {
        try {
          const parsed = JSON.parse(field);
          return Array.isArray(parsed) ? parsed : field.split(',').map(s => s.trim()).filter(s => s);
        } catch (e) {
          return field.split(',').map(s => s.trim()).filter(s => s);
        }
      }
      return [];
    };
    
    setFormData({
      title: course.title,
      description: course.description || '',
      short_description: course.short_description || '',
      category: course.category || '',
      level: course.level || 'beginner',
      duration: course.duration || 0,
      price: course.price || 0,
      is_free: course.is_free || false,
      status: course.status || 'draft',
      language: course.language || 'English',
      requirements: parseArrayField(course.requirements),
      learning_outcomes: parseArrayField(course.learning_outcomes),
      skills: parseArrayField(course.skills)
    });
    setShowForm(true);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.deleteCourse(courseId);
        showSuccess('Course deleted successfully!');
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
        showError('Failed to delete course: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      short_description: '',
      category: '',
      level: 'beginner',
      duration: 0,
      price: 0,
      is_free: false,
      status: 'draft',
      language: 'English',
      requirements: [],
      learning_outcomes: [],
      skills: []
    });
  };

  const categories = [
    { value: 'web-development', label: 'Web Development' },
    { value: 'mobile-development', label: 'Mobile Development' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'ai-ml', label: 'AI & Machine Learning' },
    { value: 'programming', label: 'Programming' },
    { value: 'database', label: 'Database' },
    { value: 'devops', label: 'DevOps' },
    { value: 'cybersecurity', label: 'Cybersecurity' },
    { value: 'design', label: 'Design' },
    { value: 'other', label: 'Other' }
  ];

  const levels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  return (
    <div className="course-management">
      <div className="course-header">
        <h2>Course Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setEditingCourse(null);
            resetForm();
            setShowForm(true);
          }}
        >
          Add New Course
        </button>
      </div>

      {/* Course Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content course-form-modal">
            <div className="modal-header">
              <h3>{editingCourse ? 'Edit Course' : 'Add New Course'}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="course-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="form-control"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Short Description *</label>
                <textarea
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleInputChange}
                  required
                  rows="2"
                  className="form-control"
                  placeholder="Brief description of the course"
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="form-control"
                  placeholder="Detailed description of the course"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Level *</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    required
                    className="form-control"
                  >
                    {levels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Duration (hours) *</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Language</label>
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Requirements (comma-separated)</label>
                <input
                  type="text"
                  value={formData.requirements.join(', ')}
                  onChange={(e) => handleArrayInputChange('requirements', e.target.value)}
                  className="form-control"
                  placeholder="e.g., Basic HTML, JavaScript knowledge"
                />
              </div>

              <div className="form-group">
                <label>Learning Outcomes (comma-separated)</label>
                <input
                  type="text"
                  value={formData.learning_outcomes.join(', ')}
                  onChange={(e) => handleArrayInputChange('learning_outcomes', e.target.value)}
                  className="form-control"
                  placeholder="e.g., Build responsive websites, Master React components"
                />
              </div>

              <div className="form-group">
                <label>Skills (comma-separated)</label>
                <input
                  type="text"
                  value={formData.skills.join(', ')}
                  onChange={(e) => handleArrayInputChange('skills', e.target.value)}
                  className="form-control"
                  placeholder="e.g., React, Node.js, MongoDB"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="is_free"
                      checked={formData.is_free}
                      onChange={handleInputChange}
                    />
                    Free Course
                  </label>
                </div>
              </div>

              {/* SEO Section */}
              <div className="seo-section">
                <h4>SEO Settings</h4>
                <SEOForm
                  data={formData.seo || {}}
                  onChange={(seoData) => setFormData(prev => ({ ...prev, seo: seoData }))}
                  title={formData.title}
                  description={formData.short_description}
                  excerpt={formData.short_description}
                  featuredImage={formData.thumbnail}
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editingCourse ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Courses List */}
      <div className="courses-list">
        {loading ? (
          <div className="loading">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="no-courses">No courses found</div>
        ) : (
          <div className="courses-grid">
            {courses.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-header">
                  <h4>{course.title}</h4>
                  <span className={`status-badge ${course.status}`}>
                    {course.status}
                  </span>
                </div>
                
                <div className="course-info">
                  <p className="course-description">{course.short_description}</p>
                  
                  <div className="course-meta">
                    <span className="meta-item">
                      <i className="fas fa-tag"></i>
                      {course.category}
                    </span>
                    <span className="meta-item">
                      <i className="fas fa-signal"></i>
                      {course.level}
                    </span>
                    <span className="meta-item">
                      <i className="fas fa-clock"></i>
                      {course.duration}h
                    </span>
                    <span className="meta-item">
                      <i className="fas fa-rupee-sign"></i>
                      {course.is_free ? 'Free' : `₹${course.price}`}
                    </span>
                  </div>
                  
                  {course.skills && course.skills.length > 0 && (
                    <div className="course-skills">
                      {(() => {
                        // Ensure skills is an array
                        let skillsArray = course.skills;
                        if (typeof skillsArray === 'string') {
                          try {
                            skillsArray = JSON.parse(skillsArray);
                          } catch (e) {
                            skillsArray = skillsArray.split(',').map(s => s.trim()).filter(s => s);
                          }
                        }
                        if (!Array.isArray(skillsArray)) {
                          skillsArray = [];
                        }
                        return skillsArray.slice(0, 3).map((skill, index) => (
                          <span key={index} className="skill-tag">
                            {skill}
                          </span>
                        ));
                      })()}
                    </div>
                  )}
                </div>
                
                <div className="course-actions">
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => handleEdit(course)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(course.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManagement;
