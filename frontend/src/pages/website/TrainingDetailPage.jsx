import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import trainingService from '../../services/trainingService';
import faqService from '../../services/faqService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import PaymentModal from '../../components/payment/PaymentModal';
import '../../styles/design-system.css';
import './TrainingDetailPage.css';

const TrainingDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const { user } = useAuth();
  
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [faqLoading, setFaqLoading] = useState(true);
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const [expandedModule, setExpandedModule] = useState(null);

  useEffect(() => {
    fetchTrainingDetails();
    fetchFAQs();
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    });
  }, [slug]);

  const fetchTrainingDetails = async () => {
    try {
      setLoading(true);
      console.log('Fetching training details for slug:', slug);
      const response = await trainingService.getTrainingProgramBySlug(slug);
      console.log('API Response:', response);
      if (response.success) {
        // Parse JSON strings from database
        const trainingData = {
          ...response.data,
          skills: typeof response.data.skills === 'string' ? (() => {
            try { return JSON.parse(response.data.skills); } catch (e) { console.error('Error parsing skills:', e); return []; }
          })() : (Array.isArray(response.data.skills) ? response.data.skills : []),
          learning_outcomes: typeof response.data.learning_outcomes === 'string' ? (() => {
            try { return JSON.parse(response.data.learning_outcomes); } catch (e) { console.error('Error parsing learning_outcomes:', e); return []; }
          })() : (Array.isArray(response.data.learning_outcomes) ? response.data.learning_outcomes : []),
          prerequisites: typeof response.data.prerequisites === 'string' ? (() => {
            try { return JSON.parse(response.data.prerequisites); } catch (e) { console.error('Error parsing prerequisites:', e); return []; }
          })() : (Array.isArray(response.data.prerequisites) ? response.data.prerequisites : []),
          tags: typeof response.data.tags === 'string' ? (() => {
            try { return JSON.parse(response.data.tags); } catch (e) { console.error('Error parsing tags:', e); return []; }
          })() : (Array.isArray(response.data.tags) ? response.data.tags : []),
          instructor: typeof response.data.instructor === 'string' ? (() => {
            try { return JSON.parse(response.data.instructor); } catch (e) { console.error('Error parsing instructor:', e); return {}; }
          })() : (response.data.instructor || {}),
          curriculum: typeof response.data.curriculum === 'string' ? (() => {
            try { return JSON.parse(response.data.curriculum); } catch (e) { console.error('Error parsing curriculum:', e); return []; }
          })() : (Array.isArray(response.data.curriculum) ? response.data.curriculum : []),
          reviews: typeof response.data.reviews === 'string' ? (() => {
            try { return JSON.parse(response.data.reviews); } catch (e) { console.error('Error parsing reviews:', e); return []; }
          })() : (Array.isArray(response.data.reviews) ? response.data.reviews : []),
          metadata: typeof response.data.metadata === 'string' ? (() => {
            try { return JSON.parse(response.data.metadata); } catch (e) { console.error('Error parsing metadata:', e); return {}; }
          })() : (response.data.metadata || {}),
          price: parseFloat(response.data.price) || 0,
          original_price: response.data.original_price ? parseFloat(response.data.original_price) : null,
          rating: parseFloat(response.data.rating) || 0
        };
        
        console.log('Processed training data:', trainingData);
        setTraining(trainingData);
      } else {
        showError(response.message || 'Failed to fetch training details');
        navigate('/training-programs');
      }
    } catch (error) {
      console.error('Error fetching training:', error);
      showError('Failed to fetch training details');
      navigate('/training-programs');
    } finally {
      setLoading(false);
    }
  };

  const fetchFAQs = async () => {
    try {
      setFaqLoading(true);
      const response = await faqService.getFAQs({ 
        limit: 10, 
        status: 'published',
        category: 'training' 
      });
      
      if (response.success) {
        setFaqs(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setFaqs([]);
    } finally {
      setFaqLoading(false);
    }
  };

  const toggleFAQ = (index) => {
    setActiveFaqIndex(activeFaqIndex === index ? null : index);
  };

  const handleEnroll = () => {
    if (!user) {
      showError('Please login to enroll in this training');
      navigate('/login');
      return;
    }

    // Store course info in localStorage for enrollment form
    const pricing = {
      currentPrice: training.price,
      originalPrice: training.original_price,
      hasDiscount: training.original_price && training.original_price > training.price,
      discountPercentage: training.discount_percentage
    };
    
    localStorage.setItem('selectedCourse', JSON.stringify({
      id: training.id,
      title: training.title,
      price: pricing.currentPrice,
      currency: training.currency || 'INR',
      originalPrice: pricing.originalPrice,
      hasDiscount: pricing.hasDiscount,
      discountPercentage: pricing.discountPercentage,
      category: training.category,
      duration: training.duration,
      level: training.level
    }));
    
    // Redirect to enrollment page
    navigate('/enroll');
  };

  const handlePaymentSuccess = (paymentData) => {
    setShowPaymentModal(false);
    setEnrollmentData({
      ...enrollmentData,
      paymentId: paymentData.id,
      paymentStatus: 'completed'
    });
    setShowEnrollmentModal(true);
  };

  const handlePaymentError = (error) => {
    showError(error || 'Payment failed. Please try again.');
  };

  const handleEnrollmentSuccess = () => {
    setShowEnrollmentModal(false);
    showSuccess('Successfully enrolled in the training!');
    navigate('/user-dashboard');
  };

  // Curriculum data for the course
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

  console.log('TrainingDetailPage render - loading:', loading, 'training:', training);

  if (loading) {
    return (
      <div className="training-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading training details...</p>
        </div>
      </div>
    );
  }

  if (!training) {
    return (
      <div className="training-detail-page">
        <div className="error-container">
          <h2>Training not found</h2>
          <p>The training you're looking for doesn't exist.</p>
          <button className="btn btn-primary" onClick={() => navigate('/trainings')}>
            Back to Trainings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="training-detail-page min-h-screen bg-white">
      <div className="training-detail-container">

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="card mb-8 overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2"
              >
                <span className="gradient-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {training.category}
                </span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight"
              >
                {training.title}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-gray-600 leading-relaxed"
              >
                {training.description}
              </motion.p>
              
              {/* Meta Information */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center gap-3 text-gray-600">
                  <i className="fas fa-clock text-primary"></i>
                  <span>{training.duration}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <i className="fas fa-users text-primary"></i>
                  <span>{training.level}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <i className="fas fa-calendar text-primary"></i>
                  <span>{training.start_date ? new Date(training.start_date).toLocaleDateString() : 'TBD'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <i className="fas fa-map-marker-alt text-primary"></i>
                  <span>{training.location}</span>
                </div>
              </motion.div>

              {/* Pricing */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-4"
              >
                <span className="text-4xl font-bold text-success">₹{training.price}</span>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex gap-4"
              >
                <button className="btn btn-primary pay-enroll-btn" onClick={handleEnroll}>
                  <i className="fas fa-credit-card"></i>
                  {training.price > 0 ? 'Pay & Enroll' : 'Enroll Now'}
                </button>
              </motion.div>
            </div>
            
            {/* Hero Image */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center items-center"
            >
              {training.image ? (
                <img 
                  src={training.image} 
                  alt={training.title}
                  className="w-full max-w-md h-80 object-cover rounded-2xl shadow-xl"
                />
              ) : (
                <div className="w-full max-w-md h-80 gradient-primary rounded-2xl flex items-center justify-center text-white text-6xl">
                  <i className="fas fa-code"></i>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Training Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* What You'll Learn */}
          <motion.div 
            data-aos="fade-up"
            data-aos-delay="100"
            className="card"
          >
            <div className="card-body">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <i className="fas fa-lightbulb text-warning"></i>
                What You'll Learn
              </h3>
              <ul className="space-y-3">
                {Array.isArray(training.learning_outcomes) && training.learning_outcomes.length > 0 ? (
                  training.learning_outcomes.map((outcome, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 text-gray-600"
                    >
                      <i className="fas fa-check text-success mt-1"></i>
                      <span>{outcome}</span>
                    </motion.li>
                  ))
                ) : (
                  <li className="text-gray-500 italic">Learning outcomes will be provided upon enrollment.</li>
                )}
              </ul>
            </div>
          </motion.div>

          {/* Prerequisites */}
          <motion.div 
            data-aos="fade-up"
            data-aos-delay="200"
            className="card"
          >
            <div className="card-body">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <i className="fas fa-list-check text-primary"></i>
                Prerequisites
              </h3>
              <ul className="space-y-3">
                {Array.isArray(training.prerequisites) && training.prerequisites.length > 0 ? (
                  training.prerequisites.map((prereq, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 text-gray-600"
                    >
                      <i className="fas fa-arrow-right text-primary mt-1"></i>
                      <span>{prereq}</span>
                    </motion.li>
                  ))
                ) : (
                  <li className="text-gray-500 italic">No specific prerequisites required.</li>
                )}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Skills Section */}
        <motion.div 
          data-aos="fade-up"
          data-aos-delay="300"
          className="card mb-8"
        >
          <div className="card-body">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <i className="fas fa-code text-purple"></i>
              Skills You'll Gain
            </h3>
            <div className="flex flex-wrap gap-3">
              {Array.isArray(training.skills) && training.skills.length > 0 ? (
                training.skills.map((skill, index) => (
                  <motion.span 
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-r from-primary to-purple text-white px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </motion.span>
                ))
              ) : (
                <span className="text-gray-500 italic">Skills will be provided upon enrollment.</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Curriculum Section */}
        <section className="curriculum-section">
          <div className="curriculum-container">
            <div className="curriculum-header">
              <h2 className="curriculum-title">Course Curriculum</h2>
              <p className="curriculum-subtitle">
                In Depth Syllabus to make you Industry Ready with Hands on Implementation
              </p>
              <div className="mt-4">
                <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                  Mindware Infotech
                </span>
              </div>
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

        {/* Instructor Section */}
        <motion.div 
          data-aos="fade-up"
          data-aos-delay="500"
          className="card mb-8"
        >
          <div className="card-body">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <i className="fas fa-user-tie text-purple"></i>
              Instructor
            </h3>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                {training.instructor?.profilePicture ? (
                  <img 
                    src={training.instructor.profilePicture} 
                    alt={training.instructor.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {training.instructor?.name?.charAt(0) || 'E'}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-800 mb-2">{training.instructor?.name || 'Expert Instructor'}</h4>
                <p className="text-primary font-semibold mb-3">{training.instructor?.title || 'Senior Developer'}</p>
                <p className="text-gray-600 mb-4">{training.instructor?.bio || 'Experienced professional with years of industry expertise.'}</p>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <i className="fas fa-star text-warning"></i>
                    <span>{training.instructor?.rating || '4.8'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <i className="fas fa-users text-primary"></i>
                    <span>{training.instructor?.students || '1000+'} students</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <i className="fas fa-code text-secondary"></i>
                    <span>{training.instructor?.courses || '10+'} courses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <motion.div 
          data-aos="fade-up"
          data-aos-delay="600"
          className="card mb-8"
        >
          <div className="card-body">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <i className="fas fa-star text-warning"></i>
              Student Reviews
            </h3>
            <div className="text-center mb-8">
              <div className="text-5xl font-bold text-gray-800 mb-2">4.8</div>
              <div className="flex justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`fas fa-star text-warning ${i < 4 ? 'opacity-100' : 'opacity-30'}`}></i>
                ))}
              </div>
              <div className="text-gray-600">Based on {training.reviews?.length || 0} reviews</div>
            </div>
            <div className="space-y-4">
              {Array.isArray(training.reviews) && training.reviews.length > 0 ? (
                training.reviews.slice(0, 3).map((review, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                          {review.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-800">{review.user?.name || 'Anonymous'}</h5>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={`fas fa-star text-warning text-sm ${i < (review.rating || 0) ? 'opacity-100' : 'opacity-30'}`}></i>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-500 text-sm">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recently'}
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment || review.text || 'Great course!'}</p>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 italic text-center py-8">No reviews yet. Be the first to review this training!</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          data-aos="fade-up"
          data-aos-delay="700"
          className="faq-section-wrapper"
        >
          <div className="faq-section-container">
            <div className="faq-section-header">
              <h2 className="text-4xl font-bold text-gray-800 mb-4 text-center">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 text-center mb-8">
                Got questions? We've got answers!
              </p>
            </div>
            
            <div className="faq-list">
              {faqLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-2 text-gray-600">Loading FAQs...</p>
                </div>
              ) : faqs.length > 0 ? (
                faqs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`faq-item ${activeFaqIndex === index ? 'active' : ''}`}
                  >
                    <div
                      className="faq-question"
                      onClick={() => toggleFAQ(index)}
                    >
                      <span className="faq-question-text">{faq.question}</span>
                      <span className="faq-icon">
                        {activeFaqIndex === index ? '−' : '+'}
                      </span>
                    </div>
                    <div className={`faq-answer ${activeFaqIndex === index ? 'active' : ''}`}>
                      <div className="faq-answer-content">
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No FAQs available at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        paymentData={{
          amount: training.price,
          courseName: training.title,
          trainingId: training.id,
          studentName: user?.firstName ? `${user.firstName} ${user.lastName}` : '',
          studentEmail: user?.email || '',
          studentPhone: user?.phone || ''
        }}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  );
};

export default TrainingDetailPage;
