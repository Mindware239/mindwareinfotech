import React, { useState, useEffect } from 'react';
import trainingService from '../../services/trainingService';
import './WebDevelopmentPage.css';

const WebDevelopmentPage = () => {
  const [trainingPrograms, setTrainingPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrainingPrograms();
  }, []);

  const fetchTrainingPrograms = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API first
      try {
        const response = await trainingService.getTrainingProgramsByCategory('web-development', { limit: 20 });
        if (response.data && response.data.length > 0) {
          setTrainingPrograms(Array.isArray(response.data) ? response.data : []);
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
      
      setTrainingPrograms(mockPrograms);
      
    } catch (err) {
      setError('Failed to load training programs');
      console.error('Error fetching training programs:', err);
      setTrainingPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = (program) => {
    // Store program info in localStorage for enrollment form
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
    
    // Redirect to enrollment page
    window.location.href = '/enroll';
  };

  const technologies = [
    { name: 'HTML5', icon: '🌐', color: '#e34f26' },
    { name: 'CSS3', icon: '🎨', color: '#1572b6' },
    { name: 'JavaScript', icon: '⚡', color: '#f7df1e' },
    { name: 'React', icon: '⚛️', color: '#61dafb' },
    { name: 'Node.js', icon: '🟢', color: '#339933' },
    { name: 'Python', icon: '🐍', color: '#3776ab' },
    { name: 'MongoDB', icon: '🍃', color: '#47a248' },
    { name: 'MySQL', icon: '🗄️', color: '#4479a1' }
  ];

  return (
    <div className="web-development-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Web Development Training</h1>
            <p>Master modern web development technologies and build real-world projects</p>
            <div className="hero-stats">
              <div className="stat">
                <span className="number">500+</span>
                <span className="label">Students Trained</span>
              </div>
              <div className="stat">
                <span className="number">95%</span>
                <span className="label">Placement Rate</span>
              </div>
              <div className="stat">
                <span className="number">50+</span>
                <span className="label">Projects Built</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Overview */}
      <section className="course-overview">
        <div className="container">
          <h2>Our Web Development Courses</h2>
          <p>Choose the perfect program for your career goals</p>
          
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading training programs...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{error}</p>
              <button onClick={fetchTrainingPrograms} className="retry-btn">Try Again</button>
            </div>
          ) : trainingPrograms.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-graduation-cap"></i>
              <p>No training programs available at the moment. Please check back later.</p>
            </div>
          ) : (
            <div className="courses-grid">
              {Array.isArray(trainingPrograms) && trainingPrograms.map(program => {
                const pricing = trainingService.getPricing(program);
                return (
                  <div key={program.id} className="course-card">
                    <div className="course-header">
                      <h3>{program.title}</h3>
                      <div className="course-meta">
                        <span className="duration">⏱️ {trainingService.getDuration(program)}</span>
                        <span className="level">📊 {trainingService.getLevel(program.level)}</span>
                      </div>
                    </div>
                    <p className="course-description">{program.short_description || program.description}</p>
                    <ul className="course-features">
                      {(program.skills || program.learning_outcomes || []).slice(0, 6).map((feature, index) => (
                        <li key={index}>✓ {feature}</li>
                      ))}
                    </ul>
                    <div className="course-footer">
                      <div className="price">
                        {pricing.isFree ? (
                          <span className="amount free">Free</span>
                        ) : (
                          <>
                            {pricing.hasDiscount && (
                              <span className="original-price">
                                {trainingService.formatPrice(pricing.originalPrice, pricing.currency)}
                              </span>
                            )}
                            <span className="amount">
                              {trainingService.formatPrice(pricing.currentPrice, pricing.currency)}
                            </span>
                            {pricing.hasDiscount && (
                              <span className="discount">
                                {pricing.discountPercentage}% OFF
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      <button 
                        className="enroll-btn"
                        onClick={() => handleEnroll(program)}
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Technologies Section */}
      <section className="technologies-section">
        <div className="container">
          <h2>Technologies You'll Master</h2>
          <div className="tech-grid">
            {technologies.map((tech, index) => (
              <div key={index} className="tech-item">
                <div className="tech-icon" style={{ backgroundColor: tech.color }}>
                  {tech.icon}
                </div>
                <span className="tech-name">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose">
        <div className="container">
          <h2>Why Choose Our Web Development Program?</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">👨‍💻</div>
              <h3>Expert Instructors</h3>
              <p>Learn from industry professionals with 10+ years of experience</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🏗️</div>
              <h3>Hands-on Projects</h3>
              <p>Build real-world applications and add them to your portfolio</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💼</div>
              <h3>Job Placement</h3>
              <p>Get assistance with resume building and job placement</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📜</div>
              <h3>Certification</h3>
              <p>Receive industry-recognized certificates upon completion</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Start Your Web Development Journey?</h2>
          <p>Join thousands of students who have transformed their careers with our programs</p>
          <div className="cta-buttons">
            <button className="btn btn-primary">Start Learning Today</button>
            <button className="btn btn-outline">Download Syllabus</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WebDevelopmentPage;
