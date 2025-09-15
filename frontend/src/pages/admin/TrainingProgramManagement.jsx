import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import trainingService from '../../services/trainingService';
import DataTable from '../../components/admin/DataTable';
import './TrainingProgramManagement.css';

const TrainingProgramManagement = () => {
  const [trainingPrograms, setTrainingPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    category: 'web-development',
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
    skills: [],
    learning_outcomes: [],
    prerequisites: [],
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
    tags: [],
    meta_title: '',
    meta_description: ''
  });

  useEffect(() => {
    fetchTrainingPrograms();
  }, []);

  const fetchTrainingPrograms = async () => {
    try {
      setLoading(true);
      const response = await trainingService.getTrainingPrograms({ limit: 100 });
      setTrainingPrograms(response.data || []);
    } catch (err) {
      setError('Failed to load training programs');
      console.error('Error fetching training programs:', err);
      // Use mock data as fallback
      const mockPrograms = [
        {
          id: 1,
          title: 'Complete Web Development Bootcamp',
          slug: 'complete-web-development-bootcamp',
          description: 'Master full-stack web development from scratch. Learn HTML5, CSS3, JavaScript, React, Node.js, and MongoDB to build modern web applications.',
          short_description: 'Learn full-stack web development with hands-on projects and real-world applications.',
          category: 'web-development',
          subcategory: 'full-stack',
          level: 'beginner',
          duration: '6 months',
          duration_hours: 480,
          price: 25000,
          original_price: 35000,
          discount_percentage: 29,
          currency: 'INR',
          is_free: false,
          is_featured: true,
          status: 'published',
          skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
          learning_outcomes: [
            'Build responsive websites using HTML5 and CSS3',
            'Create interactive web applications with JavaScript',
            'Develop modern React applications with hooks and context',
            'Build RESTful APIs with Node.js and Express'
          ],
          prerequisites: [
            'Basic computer skills',
            'No prior programming experience required',
            'Willingness to learn and practice regularly'
          ],
          instructor: {
            name: 'Rajesh Kumar',
            title: 'Senior Full-Stack Developer',
            bio: '10+ years of experience in web development',
            rating: 4.9,
            students: 2500,
            courses: 15
          },
          start_date: '2024-02-01',
          end_date: '2024-08-01',
          location: 'Online + Delhi',
          max_students: 50,
          enrolled_students: 35,
          rating: 4.8,
          total_reviews: 120,
          tags: ['web-development', 'react', 'nodejs', 'mongodb', 'full-stack'],
          meta_title: 'Complete Web Development Bootcamp - Learn Full-Stack Development',
          meta_description: 'Master full-stack web development with our comprehensive bootcamp.',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          title: 'Advanced React & Redux Mastery',
          slug: 'advanced-react-redux-mastery',
          description: 'Deep dive into advanced React concepts, Redux state management, performance optimization, and modern React patterns.',
          short_description: 'Master advanced React concepts and Redux for building scalable applications.',
          category: 'web-development',
          subcategory: 'frontend',
          level: 'intermediate',
          duration: '3 months',
          duration_hours: 180,
          price: 15000,
          original_price: 20000,
          discount_percentage: 25,
          currency: 'INR',
          is_free: false,
          is_featured: true,
          status: 'published',
          skills: ['React', 'Redux', 'TypeScript', 'Testing', 'Performance'],
          learning_outcomes: [
            'Master advanced React patterns and hooks',
            'Implement complex state management with Redux',
            'Optimize React application performance',
            'Write comprehensive tests for React apps'
          ],
          prerequisites: [
            'Basic knowledge of JavaScript and React',
            'Understanding of ES6+ features',
            'Experience with HTML and CSS'
          ],
          instructor: {
            name: 'Priya Sharma',
            title: 'React Expert & Tech Lead',
            bio: '8+ years specializing in React ecosystem',
            rating: 4.9,
            students: 1800,
            courses: 12
          },
          start_date: '2024-03-01',
          end_date: '2024-06-01',
          location: 'Online',
          max_students: 30,
          enrolled_students: 22,
          rating: 4.7,
          total_reviews: 85,
          tags: ['react', 'redux', 'typescript', 'testing'],
          meta_title: 'Advanced React & Redux Mastery Course',
          meta_description: 'Master advanced React concepts and Redux state management.',
          created_at: '2024-01-20T10:00:00Z',
          updated_at: '2024-01-20T10:00:00Z'
        },
        {
          id: 3,
          title: 'Python for Data Science & AI',
          slug: 'python-data-science-ai',
          description: 'Comprehensive Python programming course focused on data science, machine learning, and artificial intelligence applications.',
          short_description: 'Learn Python programming for data science, machine learning, and AI applications.',
          category: 'data-science',
          subcategory: 'python',
          level: 'beginner',
          duration: '4 months',
          duration_hours: 320,
          price: 20000,
          original_price: 28000,
          discount_percentage: 29,
          currency: 'INR',
          is_free: false,
          is_featured: true,
          status: 'published',
          skills: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn', 'TensorFlow'],
          learning_outcomes: [
            'Master Python programming fundamentals',
            'Work with data using Pandas and NumPy',
            'Create data visualizations with Matplotlib',
            'Build machine learning models'
          ],
          prerequisites: [
            'Basic computer skills',
            'No prior programming experience required',
            'Mathematical aptitude helpful'
          ],
          instructor: {
            name: 'Dr. Amit Patel',
            title: 'Data Science Lead & AI Researcher',
            bio: 'PhD in Computer Science with 12+ years in data science',
            rating: 4.9,
            students: 3200,
            courses: 20
          },
          start_date: '2024-02-15',
          end_date: '2024-06-15',
          location: 'Online + Mumbai',
          max_students: 40,
          enrolled_students: 28,
          rating: 4.8,
          total_reviews: 150,
          tags: ['python', 'data-science', 'machine-learning', 'ai'],
          meta_title: 'Python for Data Science & AI - Complete Course',
          meta_description: 'Master Python for data science, machine learning, and AI.',
          created_at: '2024-01-25T10:00:00Z',
          updated_at: '2024-01-25T10:00:00Z'
        },
        {
          id: 4,
          title: 'Free HTML & CSS Basics',
          slug: 'free-html-css-basics',
          description: 'Learn the fundamentals of web development with HTML5 and CSS3. Perfect for beginners who want to start their web development journey.',
          short_description: 'Start your web development journey with HTML5 and CSS3 fundamentals.',
          category: 'web-development',
          subcategory: 'frontend',
          level: 'beginner',
          duration: '1 month',
          duration_hours: 40,
          price: 0,
          currency: 'INR',
          is_free: true,
          is_featured: false,
          status: 'published',
          skills: ['HTML5', 'CSS3', 'Responsive Design', 'Flexbox', 'Grid'],
          learning_outcomes: [
            'Create semantic HTML5 structure',
            'Style websites with CSS3',
            'Build responsive layouts',
            'Use Flexbox and Grid systems'
          ],
          prerequisites: [
            'Basic computer skills',
            'No prior programming experience required',
            'Access to a text editor'
          ],
          instructor: {
            name: 'Anita Singh',
            title: 'Frontend Development Instructor',
            bio: '5+ years teaching web development fundamentals',
            rating: 4.7,
            students: 5000,
            courses: 8
          },
          start_date: '2024-01-01',
          end_date: '2024-12-31',
          location: 'Online',
          max_students: 1000,
          enrolled_students: 450,
          rating: 4.5,
          total_reviews: 200,
          tags: ['html', 'css', 'beginner', 'free'],
          meta_title: 'Free HTML & CSS Basics Course',
          meta_description: 'Learn HTML5 and CSS3 fundamentals for free.',
          created_at: '2024-01-01T10:00:00Z',
          updated_at: '2024-01-01T10:00:00Z'
        }
      ];
      setTrainingPrograms(mockPrograms);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({
      title: '',
      description: '',
      short_description: '',
      category: 'web-development',
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
      skills: [],
      learning_outcomes: [],
      prerequisites: [],
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
      tags: [],
      meta_title: '',
      meta_description: ''
    });
    setShowAddModal(true);
  };

  const handleEdit = (program) => {
    setSelectedProgram(program);
    setFormData({
      ...program,
      skills: Array.isArray(program.skills) ? program.skills : [],
      learning_outcomes: Array.isArray(program.learning_outcomes) ? program.learning_outcomes : [],
      prerequisites: Array.isArray(program.prerequisites) ? program.prerequisites : [],
      tags: Array.isArray(program.tags) ? program.tags : [],
      instructor: program.instructor || {
        name: '',
        title: '',
        bio: '',
        rating: 0,
        students: 0,
        courses: 0
      }
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
      if (selectedProgram) {
        // Update existing program
        await trainingService.updateTrainingProgram(selectedProgram.id, formData);
        setTrainingPrograms(trainingPrograms.map(program => 
          program.id === selectedProgram.id ? { ...program, ...formData } : program
        ));
        setShowEditModal(false);
      } else {
        // Create new program
        const newProgram = await trainingService.createTrainingProgram(formData);
        setTrainingPrograms([...trainingPrograms, newProgram.data]);
        setShowAddModal(false);
      }
      setFormData({
        title: '',
        description: '',
        short_description: '',
        category: 'web-development',
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
        skills: [],
        learning_outcomes: [],
        prerequisites: [],
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
        tags: [],
        meta_title: '',
        meta_description: ''
      });
    } catch (err) {
      console.error('Error saving training program:', err);
      alert('Failed to save training program');
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
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="web-development">Web Development</option>
                    <option value="data-science">Data Science</option>
                    <option value="mobile-development">Mobile Development</option>
                    <option value="cloud-computing">Cloud Computing</option>
                    <option value="cybersecurity">Cybersecurity</option>
                  </select>
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
                  </select>
                </div>
                <div className="form-group">
                  <label>Duration *</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 6 months"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price (INR)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Original Price (INR)</label>
                  <input
                    type="number"
                    name="original_price"
                    value={formData.original_price}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Online, Delhi, Mumbai"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Short Description *</label>
                  <textarea
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleInputChange}
                    rows="3"
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="5"
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label>Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.skills.join(', ')}
                    onChange={(e) => handleArrayInputChange('skills', e.target.value)}
                    placeholder="e.g., React, Node.js, MongoDB"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Learning Outcomes (comma-separated)</label>
                  <textarea
                    value={formData.learning_outcomes.join(', ')}
                    onChange={(e) => handleArrayInputChange('learning_outcomes', e.target.value)}
                    rows="3"
                    placeholder="e.g., Build responsive websites, Create interactive applications"
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
