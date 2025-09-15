import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import trainingService from '../../services/trainingService';
import './TrainingProgramsPage.css';

const TrainingProgramsPage = () => {
  const [trainingPrograms, setTrainingPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchTrainingPrograms();
  }, [selectedCategory, levelFilter, searchQuery]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API first
      try {
        const [programsResponse, categoriesResponse] = await Promise.all([
          trainingService.getTrainingPrograms({ limit: 50 }),
          trainingService.getTrainingCategories()
        ]);
        
        setTrainingPrograms(programsResponse.data || []);
        setCategories(categoriesResponse.data || []);
        
        // If we got data, return early
        if (programsResponse.data && programsResponse.data.length > 0) {
          return;
        }
      } catch (apiError) {
        console.log('API not available, using mock data:', apiError.message);
      }
      
      // Fallback to mock data if API fails
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
          start_date: new Date('2024-02-01'),
          end_date: new Date('2024-08-01'),
          location: 'Online + Delhi',
          max_students: 50,
          enrolled_students: 35,
          rating: 4.8,
          total_reviews: 120,
          tags: ['web-development', 'react', 'nodejs', 'mongodb', 'full-stack'],
          created_by: 1
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
          start_date: new Date('2024-03-01'),
          end_date: new Date('2024-06-01'),
          location: 'Online',
          max_students: 30,
          enrolled_students: 22,
          rating: 4.7,
          total_reviews: 85,
          tags: ['react', 'redux', 'typescript', 'testing'],
          created_by: 1
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
          start_date: new Date('2024-02-15'),
          end_date: new Date('2024-06-15'),
          location: 'Online + Mumbai',
          max_students: 40,
          enrolled_students: 28,
          rating: 4.8,
          total_reviews: 150,
          tags: ['python', 'data-science', 'machine-learning', 'ai'],
          created_by: 1
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
          start_date: new Date('2024-01-01'),
          end_date: new Date('2024-12-31'),
          location: 'Online',
          max_students: 1000,
          enrolled_students: 450,
          rating: 4.5,
          total_reviews: 200,
          tags: ['html', 'css', 'beginner', 'free'],
          created_by: 1
        }
      ];
      
      const mockCategories = [
        { category: 'web-development', count: 3 },
        { category: 'data-science', count: 1 }
      ];
      
      setTrainingPrograms(mockPrograms);
      setCategories(mockCategories);
      
    } catch (err) {
      setError('Failed to load training programs');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainingPrograms = async () => {
    try {
      setLoading(true);
      const params = { limit: 50 };
      
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      
      if (levelFilter !== 'all') {
        params.level = levelFilter;
      }
      
      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await trainingService.getTrainingPrograms(params);
      setTrainingPrograms(response.data || []);
    } catch (err) {
      setError('Failed to load training programs');
      console.error('Error fetching training programs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = (program) => {
    const pricing = trainingService.getPricing(program);
    localStorage.setItem('selectedCourse', JSON.stringify({
      id: program.id,
      title: program.title,
      price: pricing.currentPrice,
      currency: program.currency || 'INR',
      originalPrice: pricing.originalPrice,
      hasDiscount: pricing.hasDiscount,
      discountPercentage: pricing.discountPercentage
    }));
    
    window.location.href = '/enroll';
  };

  const filteredPrograms = trainingPrograms.filter(program => {
    if (selectedCategory !== 'all' && program.category !== selectedCategory) {
      return false;
    }
    if (levelFilter !== 'all' && program.level !== levelFilter) {
      return false;
    }
    if (searchQuery && !program.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !program.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getCategoryStats = () => {
    const stats = {};
    trainingPrograms.forEach(program => {
      if (!stats[program.category]) {
        stats[program.category] = { total: 0, featured: 0, free: 0 };
      }
      stats[program.category].total++;
      if (program.is_featured) stats[program.category].featured++;
      if (program.is_free) stats[program.category].free++;
    });
    return stats;
  };

  const categoryStats = getCategoryStats();

  return (
    <div className="training-programs-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Training Programs</h1>
            <p>Master in-demand skills with our comprehensive training programs designed by industry experts</p>
            
            {/* Search Bar */}
            <div className="search-container">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search training programs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="filters-section">
        <div className="container">
          <div className="filters">
            {/* Category Filter */}
            <div className="filter-group">
              <label>Category:</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.category} value={category.category}>
                    {trainingService.getCategoryDisplayName(category.category)} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div className="filter-group">
              <label>Level:</label>
              <select 
                value={levelFilter} 
                onChange={(e) => setLevelFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="results-count">
              {filteredPrograms.length} program{filteredPrograms.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </section>

      {/* Categories Overview */}
      <section className="categories-overview">
        <div className="container">
          <h2>Browse by Category</h2>
          <div className="categories-grid">
            {Object.entries(categoryStats).map(([category, stats]) => (
              <div 
                key={category} 
                className={`category-card ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                <div className="category-icon">
                  {category === 'web-development' && '🌐'}
                  {category === 'mobile-development' && '📱'}
                  {category === 'data-science' && '📊'}
                  {category === 'cloud-computing' && '☁️'}
                  {category === 'cybersecurity' && '🔒'}
                  {category === 'devops' && '⚙️'}
                  {category === 'ui-ux' && '🎨'}
                  {category === 'digital-marketing' && '📈'}
                </div>
                <h3>{trainingService.getCategoryDisplayName(category)}</h3>
                <div className="category-stats">
                  <span className="stat">{stats.total} Programs</span>
                  {stats.featured > 0 && <span className="stat featured">{stats.featured} Featured</span>}
                  {stats.free > 0 && <span className="stat free">{stats.free} Free</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Programs Grid */}
      <section className="programs-section">
        <div className="container">
          <h2>All Training Programs</h2>
          
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading training programs...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{error}</p>
              <button onClick={fetchData} className="retry-btn">Try Again</button>
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-graduation-cap"></i>
              <p>No training programs found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSelectedCategory('all');
                  setLevelFilter('all');
                  setSearchQuery('');
                }}
                className="btn btn-primary"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="programs-grid">
              {filteredPrograms.map(program => {
                const pricing = trainingService.getPricing(program);
                return (
                  <div key={program.id} className="program-card">
                    {program.is_featured && (
                      <div className="featured-badge">Featured</div>
                    )}
                    
                    <div className="program-image">
                      {program.image ? (
                        <img src={program.image} alt={program.title} />
                      ) : (
                        <div className="image-placeholder">
                          <i className="fas fa-graduation-cap"></i>
                        </div>
                      )}
                    </div>

                    <div className="program-content">
                      <div className="program-header">
                        <div className="program-category">
                          {trainingService.getCategoryDisplayName(program.category)}
                        </div>
                        <div className="program-level">
                          {trainingService.getLevel(program.level)}
                        </div>
                      </div>

                      <h3 className="program-title">{program.title}</h3>
                      <p className="program-description">
                        {program.short_description || program.description}
                      </p>

                      <div className="program-meta">
                        <div className="meta-item">
                          <i className="fas fa-clock"></i>
                          <span>{trainingService.getDuration(program)}</span>
                        </div>
                        <div className="meta-item">
                          <i className="fas fa-users"></i>
                          <span>{program.enrolled_students || 0} enrolled</span>
                        </div>
                        <div className="meta-item">
                          <i className="fas fa-star"></i>
                          <span>{program.rating || 0}/5</span>
                        </div>
                      </div>

                      <div className="program-skills">
                        {program.skills?.slice(0, 3).map((skill, index) => (
                          <span key={index} className="skill-tag">{skill}</span>
                        ))}
                        {program.skills?.length > 3 && (
                          <span className="skill-tag more">+{program.skills.length - 3} more</span>
                        )}
                      </div>

                      <div className="program-footer">
                        <div className="program-price">
                          {pricing.isFree ? (
                            <span className="price free">Free</span>
                          ) : (
                            <div className="price-container">
                              {pricing.hasDiscount && (
                                <span className="original-price">
                                  {trainingService.formatPrice(pricing.originalPrice, pricing.currency)}
                                </span>
                              )}
                              <span className="current-price">
                                {trainingService.formatPrice(pricing.currentPrice, pricing.currency)}
                              </span>
                              {pricing.hasDiscount && (
                                <span className="discount">
                                  {pricing.discountPercentage}% OFF
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="program-actions">
                          <Link 
                            to={`/training/${program.id}`}
                            className="btn btn-outline"
                          >
                            View Details
                          </Link>
                          <button 
                            className="btn btn-primary"
                            onClick={() => handleEnroll(program)}
                          >
                            Enroll Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Start Learning?</h2>
          <p>Join thousands of students who have transformed their careers with our training programs</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-primary">Get in Touch</Link>
            <Link to="/web-training" className="btn btn-outline">View Web Development</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrainingProgramsPage;
