import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import trainingService from '../../services/trainingService';
import '../../styles/design-system.css';
import './TrainingProgramsPage.css';

const TrainingProgramsPage = () => {
  const [trainingPrograms, setTrainingPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCourseType, setSelectedCourseType] = useState('live-online');
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [deliveryFilter, setDeliveryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedModule, setExpandedModule] = useState(null);

  useEffect(() => {
    fetchData();
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedCategory, levelFilter, searchQuery, selectedCourseType]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API first
      try {
      const [programsResponse, categoriesResponse] = await Promise.all([
        trainingService.getTrainingPrograms({ limit: 50 }),
        trainingService.getCourseCategories()
      ]);
      
      // Parse JSON strings from database
      const programs = Array.isArray(programsResponse.data) ? programsResponse.data.map(program => ({
        ...program,
        skills: typeof program.skills === 'string' ? (() => {
          try { return JSON.parse(program.skills); } catch (e) { console.error('Error parsing skills:', e); return []; }
        })() : (program.skills || []),
        learning_outcomes: typeof program.learning_outcomes === 'string' ? (() => {
          try { return JSON.parse(program.learning_outcomes); } catch (e) { console.error('Error parsing learning_outcomes:', e); return []; }
        })() : (program.learning_outcomes || []),
        prerequisites: typeof program.prerequisites === 'string' ? (() => {
          try { return JSON.parse(program.prerequisites); } catch (e) { console.error('Error parsing prerequisites:', e); return []; }
        })() : (program.prerequisites || []),
        tags: typeof program.tags === 'string' ? (() => {
          try { return JSON.parse(program.tags); } catch (e) { console.error('Error parsing tags:', e); return []; }
        })() : (program.tags || []),
        instructor: typeof program.instructor === 'string' ? (() => {
          try { return JSON.parse(program.instructor); } catch (e) { console.error('Error parsing instructor:', e); return {}; }
        })() : (program.instructor || {}),
        curriculum: typeof program.curriculum === 'string' ? (() => {
          try { return JSON.parse(program.curriculum); } catch (e) { console.error('Error parsing curriculum:', e); return []; }
        })() : (program.curriculum || []),
        reviews: typeof program.reviews === 'string' ? (() => {
          try { return JSON.parse(program.reviews); } catch (e) { console.error('Error parsing reviews:', e); return []; }
        })() : (program.reviews || []),
        metadata: typeof program.metadata === 'string' ? (() => {
          try { return JSON.parse(program.metadata); } catch (e) { console.error('Error parsing metadata:', e); return {}; }
        })() : (program.metadata || {}),
        price: parseFloat(program.price) || 0,
        original_price: program.original_price ? parseFloat(program.original_price) : null,
        rating: parseFloat(program.rating) || 0
      })) : [];
      
      setTrainingPrograms(programs);
      setCategories(categoriesResponse || []);
      
        // console.log('Programs data:', programs);
        
      } catch (apiError) {
        console.warn('API not available, using mock data:', apiError);
        
        // Fallback to mock data if API fails
        const mockPrograms = [
          {
            id: 1,
            title: "MERN Stack Development",
            short_description: "Master the complete MERN stack with hands-on projects and real-world applications",
            description: "Learn MongoDB, Express.js, React, and Node.js to build full-stack web applications. This comprehensive course covers frontend and backend development with modern JavaScript technologies.",
            category: "full-stack",
            duration: "6 months",
            price: 25000,
            original_price: 35000,
            rating: 4.8,
            enrolled_students: 150,
            skills: ["React", "Node.js", "MongoDB", "Express.js", "JavaScript", "HTML", "CSS"],
            slug: "mern-stack-development",
            delivery_method: "online",
            is_featured: true
          },
          {
            id: 2,
            title: "Java Full Stack Development",
            short_description: "Complete Java development course with Spring Boot and modern frameworks",
            description: "Master Java programming, Spring Boot, Spring Security, and frontend technologies to become a full-stack Java developer.",
            category: "full-stack",
            duration: "8 months",
            price: 30000,
            original_price: 40000,
            rating: 4.9,
            enrolled_students: 200,
            skills: ["Java", "Spring Boot", "MySQL", "React", "JavaScript", "HTML", "CSS"],
            slug: "java-full-stack-development",
            delivery_method: "online",
            is_featured: true
          },
          {
            id: 3,
            title: "Data Science & AI",
            short_description: "Comprehensive data science course with machine learning and AI applications",
            description: "Learn Python, machine learning, deep learning, and data analysis to become a data scientist.",
            category: "data-science",
            duration: "7 months",
            price: 35000,
            original_price: 45000,
            rating: 4.7,
            enrolled_students: 120,
            skills: ["Python", "Machine Learning", "TensorFlow", "Pandas", "NumPy", "Scikit-learn"],
            slug: "data-science-ai",
            delivery_method: "online",
            is_featured: true
          }
        ];
        
        const mockCategories = [
          { id: 1, name: "Full Stack Development", slug: "full-stack" },
          { id: 2, name: "Data Analytics", slug: "data-analytics" },
          { id: 3, name: "Data Science & AI", slug: "data-science" }
        ];
        
        setTrainingPrograms(mockPrograms);
        setCategories(mockCategories);
        
      }
      
    } catch (err) {
      setError('Failed to load training programs. Please check if the server is running.');
      console.error('Error fetching data:', err);
      setTrainingPrograms([]);
      setCategories([]);
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
      
      // Parse JSON strings from database
      const programs = Array.isArray(response.data) ? response.data.map(program => ({
        ...program,
        skills: typeof program.skills === 'string' ? (() => {
          try { return JSON.parse(program.skills); } catch (e) { console.error('Error parsing skills:', e); return []; }
        })() : (program.skills || []),
        learning_outcomes: typeof program.learning_outcomes === 'string' ? (() => {
          try { return JSON.parse(program.learning_outcomes); } catch (e) { console.error('Error parsing learning_outcomes:', e); return []; }
        })() : (program.learning_outcomes || []),
        prerequisites: typeof program.prerequisites === 'string' ? (() => {
          try { return JSON.parse(program.prerequisites); } catch (e) { console.error('Error parsing prerequisites:', e); return []; }
        })() : (program.prerequisites || []),
        tags: typeof program.tags === 'string' ? (() => {
          try { return JSON.parse(program.tags); } catch (e) { console.error('Error parsing tags:', e); return []; }
        })() : (program.tags || []),
        instructor: typeof program.instructor === 'string' ? (() => {
          try { return JSON.parse(program.instructor); } catch (e) { console.error('Error parsing instructor:', e); return {}; }
        })() : (program.instructor || {}),
        curriculum: typeof program.curriculum === 'string' ? (() => {
          try { return JSON.parse(program.curriculum); } catch (e) { console.error('Error parsing curriculum:', e); return []; }
        })() : (program.curriculum || []),
        reviews: typeof program.reviews === 'string' ? (() => {
          try { return JSON.parse(program.reviews); } catch (e) { console.error('Error parsing reviews:', e); return []; }
        })() : (program.reviews || []),
        metadata: typeof program.metadata === 'string' ? (() => {
          try { return JSON.parse(program.metadata); } catch (e) { console.error('Error parsing metadata:', e); return {}; }
        })() : (program.metadata || {}),
        price: parseFloat(program.price) || 0,
        original_price: program.original_price ? parseFloat(program.original_price) : null,
        rating: parseFloat(program.rating) || 0
      })) : [];
      
      setTrainingPrograms(programs);
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
    if (selectedCategory !== 'all') {
      // Check if program's category matches selected category ID or name
      const programCategoryId = program.category_id || program.category;
      const programCategoryName = program.category_name || program.category;
      
      // Find the selected category name from categories array
      const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);
      const selectedCategoryName = selectedCategoryData ? selectedCategoryData.name : selectedCategory;
      
      if (programCategoryId !== selectedCategory && 
          programCategoryName !== selectedCategory && 
          programCategoryName !== selectedCategoryName) {
        return false;
      }
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

  // If no programs match the filter, show all programs for better UX
  const displayPrograms = filteredPrograms.length > 0 ? filteredPrograms : trainingPrograms;

  // Debug logging (commented out for production)
  // console.log('Current trainingPrograms:', trainingPrograms);
  // console.log('Current filteredPrograms:', filteredPrograms);
  // console.log('Selected category:', selectedCategory);
  // console.log('Level filter:', levelFilter);
  // console.log('Delivery filter:', deliveryFilter);
  // console.log('Search query:', searchQuery);

  const getCategoryStats = () => {
    const stats = {};
    console.log('getCategoryStats - trainingPrograms:', trainingPrograms.length);
    
    trainingPrograms.forEach(program => {
      console.log('Processing program:', program.title, 'category:', program.category);
      if (!stats[program.category]) {
        stats[program.category] = { total: 0, featured: 0, free: 0 };
      }
      stats[program.category].total++;
      if (program.is_featured) stats[program.category].featured++;
      if (program.is_free) stats[program.category].free++;
    });
    
    // Add "All" category
    stats['all'] = {
      total: trainingPrograms.length,
      featured: trainingPrograms.filter(p => p.is_featured).length,
      free: trainingPrograms.filter(p => p.is_free).length
    };
    
    console.log('Category stats:', stats);
    return stats;
  };

  const categoryStats = getCategoryStats();

  // Course type options
  const courseTypes = [
    { id: 'live-online', name: 'Live Online Courses', icon: 'fas fa-video' },
    { id: 'offline', name: 'Offline Courses', icon: 'fas fa-building' },
    { id: 'self-paced', name: 'Self Paced Courses', icon: 'fas fa-clock' }
  ];

  // Function to get appropriate icon for category
  const getCategoryIcon = (categoryName) => {
    if (!categoryName || typeof categoryName !== 'string') {
      return 'fas fa-laptop-code';
    }
    const name = categoryName.toLowerCase();
    if (name.includes('full stack') || name.includes('web development')) return 'fas fa-code';
    if (name.includes('data analytics') || name.includes('analytics')) return 'fas fa-chart-bar';
    if (name.includes('data science') || name.includes('ai') || name.includes('machine learning')) return 'fas fa-brain';
    if (name.includes('mobile') || name.includes('android') || name.includes('ios')) return 'fas fa-mobile-alt';
    if (name.includes('ui') || name.includes('ux') || name.includes('design')) return 'fas fa-palette';
    if (name.includes('cyber') || name.includes('security')) return 'fas fa-shield-alt';
    return 'fas fa-laptop-code';
  };

  // Function to get CSS class for category
  const getCategoryClass = (categoryName) => {
    if (!categoryName || typeof categoryName !== 'string') return 'default';
    const name = categoryName.toLowerCase();
    if (name.includes('full stack') || name.includes('web development')) return 'web-development';
    if (name.includes('data analytics') || name.includes('analytics')) return 'data-science';
    if (name.includes('data science') || name.includes('ai') || name.includes('machine learning')) return 'data-science';
    if (name.includes('mobile') || name.includes('android') || name.includes('ios')) return 'mobile-development';
    if (name.includes('ui') || name.includes('ux') || name.includes('design')) return 'ui-ux';
    if (name.includes('cyber') || name.includes('security')) return 'cybersecurity';
    return 'default';
  };

  // Category options from database - limit to 6 most important categories
  const categoryOptions = categories.length > 0 ? categories
    .filter(category => category && category.name && category.id) // Filter out invalid categories
    .slice(0, 6) // Limit to first 6 categories
    .map(category => ({
      id: category.id,
      name: category.name,
      icon: getCategoryIcon(category.name)
    })) : [
    { id: 'full-stack', name: 'Full Stack Development', icon: 'fas fa-code' },
    { id: 'data-analytics', name: 'Data Analytics', icon: 'fas fa-chart-bar' },
    { id: 'data-science', name: 'Data Science & AI', icon: 'fas fa-brain' }
  ];


  // Curriculum data for MERN Stack Development
  const curriculumData = [
    {
      id: 1,
      title: "Fundamentals of Programming and Aptitude",
      duration: "1 Month",
      description: "This module is designed to introduce you to programming. You'll learn how to communicate with a computer.",
      weeks: [
        {
          week: 1,
          topics: ["Hello World", "Variables & Data Types", "Taking Input", "Conditional and Loops"]
        },
        {
          week: 2,
          topics: ["Loops", "Nested Loops", "Functions", "1D Array"]
        },
        {
          week: 3,
          topics: ["1D Array", "Subarray"]
        },
        {
          week: 4,
          topics: ["Time and Space Complexity", "2D Arrays"]
        }
      ]
    },
    {
      id: 2,
      title: "Elementary Data Structures and Algorithms",
      duration: "1 Month",
      description: "Master fundamental data structures and algorithms essential for software development.",
      weeks: [
        {
          week: 1,
          topics: ["Arrays & Strings", "Linked Lists", "Stacks & Queues"]
        },
        {
          week: 2,
          topics: ["Trees & Binary Trees", "Binary Search Trees", "Heaps"]
        },
        {
          week: 3,
          topics: ["Graphs", "BFS & DFS", "Shortest Path Algorithms"]
        },
        {
          week: 4,
          topics: ["Sorting Algorithms", "Searching Algorithms", "Dynamic Programming Basics"]
        }
      ]
    },
    {
      id: 3,
      title: "Intro to HTML & CSS",
      duration: "1 Month",
      description: "Learn the building blocks of web development with modern HTML5 and CSS3.",
      weeks: [
        {
          week: 1,
          topics: ["HTML5 Semantic Elements", "Forms & Input Types", "Accessibility"]
        },
        {
          week: 2,
          topics: ["CSS3 Selectors", "Box Model", "Flexbox Layout"]
        },
        {
          week: 3,
          topics: ["CSS Grid", "Responsive Design", "Media Queries"]
        },
        {
          week: 4,
          topics: ["CSS Animations", "Transitions", "CSS Preprocessors"]
        }
      ]
    },
    {
      id: 4,
      title: "Basic JavaScript",
      duration: "1 Month",
      description: "Master JavaScript fundamentals and modern ES6+ features.",
      weeks: [
        {
          week: 1,
          topics: ["Variables & Data Types", "Functions", "Objects & Arrays"]
        },
        {
          week: 2,
          topics: ["DOM Manipulation", "Event Handling", "Async Programming"]
        },
        {
          week: 3,
          topics: ["ES6+ Features", "Promises & Async/Await", "Modules"]
        },
        {
          week: 4,
          topics: ["Error Handling", "Testing", "Debugging Techniques"]
        }
      ]
    },
    {
      id: 5,
      title: "Advanced JavaScript",
      duration: "1 Month",
      description: "Deep dive into advanced JavaScript concepts and patterns.",
      weeks: [
        {
          week: 1,
          topics: ["Closures & Scope", "Prototypes", "Inheritance"]
        },
        {
          week: 2,
          topics: ["Design Patterns", "Functional Programming", "Higher-Order Functions"]
        },
        {
          week: 3,
          topics: ["Memory Management", "Performance Optimization", "Web APIs"]
        },
        {
          week: 4,
          topics: ["Security Best Practices", "Code Quality", "Build Tools"]
        }
      ]
    },
    {
      id: 6,
      title: "React & Redux",
      duration: "1 Month",
      description: "Build modern user interfaces with React and state management with Redux.",
      weeks: [
        {
          week: 1,
          topics: ["React Components", "JSX", "Props & State"]
        },
        {
          week: 2,
          topics: ["Hooks", "Context API", "Lifecycle Methods"]
        },
        {
          week: 3,
          topics: ["Redux Store", "Actions & Reducers", "Middleware"]
        },
        {
          week: 4,
          topics: ["React Router", "Testing", "Performance Optimization"]
        }
      ]
    },
    {
      id: 7,
      title: "Backend Development in Node.js",
      duration: "1 Month",
      description: "Create robust server-side applications with Node.js and Express.",
      weeks: [
        {
          week: 1,
          topics: ["Node.js Basics", "NPM & Package Management", "File System Operations"]
        },
        {
          week: 2,
          topics: ["Express.js Framework", "RESTful APIs", "Middleware"]
        },
        {
          week: 3,
          topics: ["Database Integration", "Authentication", "Security"]
        },
        {
          week: 4,
          topics: ["Deployment", "Performance Monitoring", "Testing"]
        }
      ]
    },
    {
      id: 8,
      title: "Project / Internship",
      duration: "1 Month",
      description: "Apply your skills in real-world projects and gain industry experience.",
      weeks: [
        {
          week: 1,
          topics: ["Project Planning", "Team Collaboration", "Version Control"]
        },
        {
          week: 2,
          topics: ["Frontend Development", "Backend Integration", "API Design"]
        },
        {
          week: 3,
          topics: ["Database Design", "Testing & Debugging", "Code Review"]
        },
        {
          week: 4,
          topics: ["Deployment", "Documentation", "Presentation"]
        }
      ]
    }
  ];

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };


  return (
    <div className="training-programs-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="hero-text"
            >
              <h1 className="hero-title">COURSES</h1>
              <div className="hero-underline"></div>
                      <p className="hero-description">
                        Transform your career with Mindware Infotech's comprehensive training programs! Expert-led courses in Full Stack Development, Data Science, and cutting-edge technologies with 100% placement assistance.
                      </p>
            </motion.div>
          </div>
        </div>
      </section>

        {/* Main Content */}
        <section className="main-content">
          <div className="main-content-header">
            <h2 className="main-content-title">
              <span className="highlight-text">Offline</span>, Live Online and Self Paced courses tailored for you!
            </h2>
            <p className="main-content-subtitle">
              Courses and placement assistance with 60+ hiring drives each month to help you land your dream tech job!
            </p>
          </div>
        <div className="content-container">
          {/* Left Sidebar - Course Types */}
          <div className="sidebar">
            <div className="sidebar-section">
              <h3 className="sidebar-title">Choose Your Preferred Course:</h3>
              <div className="course-type-list">
                {courseTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    className={`course-type-item ${selectedCourseType === type.id ? 'active' : ''}`}
                    onClick={() => setSelectedCourseType(type.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <i className={type.icon}></i>
                    <span>{type.name}</span>
                    {type.id === 'offline' && <i className="fas fa-chevron-down"></i>}
                  </motion.button>
                ))}
            </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="main-area">
            {/* Category Tabs */}
            <div className="category-tabs">
              {categoryOptions.map((category) => (
                <motion.button
                  key={category.id}
                  className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className={category.icon}></i>
                  <span>{category.name}</span>
                </motion.button>
            ))}
          </div>

            {/* Course Cards Grid */}
            <div className="courses-grid">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
                  <p>Loading courses...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{error}</p>
              <button onClick={fetchData} className="retry-btn">Try Again</button>
            </div>
              ) : displayPrograms.length > 0 ? (
                displayPrograms.map((program, index) => (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="course-card"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    {/* Course Illustration - SVG Image */}
                    <div className="course-illustration">
                      <div className="course-svg-container">
                        <img 
                          src="/mernCourseOnline.6d25ea54.svg" 
                          alt="Course Illustration" 
                          className="course-svg-image"
                          onError={(e) => {
                            console.error('SVG Image failed to load:', e.target.src);
                            e.target.style.display = 'none';
                          }}
                          onLoad={() => console.log('SVG Image loaded successfully')}
                        />
                        {/* Fallback text if image fails */}
                        <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#666', fontSize: '14px'}}>
                          MERN Course
                        </div>
                      </div>
                    </div>

                    {/* Course Content */}
                    <div className="course-content">
                      <h3 className="course-title">{program.title || 'Course Title'}</h3>
                      
                      <p className="course-description">
                        {program.short_description || program.description?.substring(0, 120) + '...' || 'Learn the latest technologies and advance your career with our comprehensive training program.'}
                      </p>
                      
                      <Link 
                        to={`/training/${program.slug}`}
                        className="view-program-btn"
                      >
                        View Program <i className="fas fa-arrow-right"></i>
                      </Link>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="no-courses">
                  <i className="fas fa-search"></i>
                  <h3>No courses found</h3>
                  <p>Try adjusting your filters or search terms</p>
                  <button onClick={() => setSelectedCategory('all')} className="retry-btn">
                    Show All Courses
                  </button>
                </div>
              )}
                        </div>
                        </div>
                      </div>
              </section>

              {/* Curriculum Section */}
              <section className="curriculum-section">
                <div className="curriculum-container">
                  <div className="curriculum-header">
                    <h2 className="curriculum-title">Course Curriculum</h2>
                    <p className="curriculum-subtitle">
                      In Depth Syllabus to make you Industry Ready with Hands on Implementation
                    </p>
                      </div>

                  <div className="curriculum-modules">
                    {curriculumData.map((module, index) => (
                      <motion.div
                        key={module.id}
                        className={`curriculum-module ${expandedModule === module.id ? 'expanded' : ''}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                      >
                        <div 
                          className="module-header"
                          onClick={() => toggleModule(module.id)}
                        >
                          <div className="module-info">
                            <h3 className="module-title">{module.title}</h3>
                            <p className="module-description">{module.description}</p>
                          </div>
                          <div className="module-meta">
                            <span className="module-duration">{module.duration}</span>
                            <i className={`fas fa-chevron-down ${expandedModule === module.id ? 'rotated' : ''}`}></i>
                            </div>
                        </div>

                        {expandedModule === module.id && (
                          <motion.div
                            className="module-content"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="weeks-container">
                              {module.weeks.map((week, weekIndex) => (
                                <div key={weekIndex} className="week-item">
                                  <h4 className="week-title">Week {week.week}</h4>
                                  <ul className="topics-list">
                                    {week.topics.map((topic, topicIndex) => (
                                      <li key={topicIndex} className="topic-item">
                                        <i className="fas fa-play"></i>
                                        <span>{topic}</span>
                                      </li>
                                    ))}
                                  </ul>
                        </div>
                              ))}
                      </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
        </div>
      </section>

    </div>
  );
};

export default TrainingProgramsPage;
