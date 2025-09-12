import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EnrollmentForm from '../../components/forms/EnrollmentForm';
import EnrollmentPreview from '../../components/forms/EnrollmentPreview';
import { useNotification } from '../../context/NotificationContext';
import enrollmentService from '../../services/enrollmentService';
import './EnrollmentPage.css';

const EnrollmentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState('form'); // 'form', 'preview', 'success'
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      
      // Simulate a short loading time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (courseId) {
        // Try to fetch course details from API
        try {
          const response = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            const courseData = await response.json();
            setCourse(courseData.data);
          } else {
            // Fallback to mock data if API fails
            setCourse({
              id: courseId,
              title: 'Web Development Course',
              description: 'Learn full-stack web development with modern technologies',
              price: 15000,
              currency: 'INR',
              duration: '6 months',
              level: 'Beginner to Advanced'
            });
          }
        } catch (apiError) {
          console.log('API not available, using mock data:', apiError.message);
          // Fallback to mock data if API is not available
          setCourse({
            id: courseId,
            title: 'Web Development Course',
            description: 'Learn full-stack web development with modern technologies',
            price: 15000,
            currency: 'INR',
            duration: '6 months',
            level: 'Beginner to Advanced'
          });
        }
      } else {
        // General enrollment without specific course
        setCourse({
          id: null,
          title: 'General Course Enrollment',
          description: 'Enroll in our training programs and courses',
          price: 0,
          currency: 'INR',
          duration: 'Flexible',
          level: 'All Levels'
        });
      }
    } catch (error) {
      console.error('Error loading course details:', error);
      // Set fallback course data even on error
      setCourse({
        id: courseId || null,
        title: courseId ? 'Web Development Course' : 'General Course Enrollment',
        description: courseId ? 'Learn full-stack web development with modern technologies' : 'Enroll in our training programs and courses',
        price: courseId ? 15000 : 0,
        currency: 'INR',
        duration: courseId ? '6 months' : 'Flexible',
        level: courseId ? 'Beginner to Advanced' : 'All Levels'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (data) => {
    setFormData(data);
    setCurrentStep('preview');
  };

  const handlePreviewSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'certificates' && Array.isArray(formData[key])) {
          formData[key].forEach((file, index) => {
            formDataToSend.append(`certificates`, file);
          });
        } else if (formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        } else if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add course ID
      if (courseId) {
        formDataToSend.append('courseId', courseId);
      }

      // Submit enrollment
      const response = await enrollmentService.createEnrollment(formDataToSend);
      
      if (response.success) {
        setCurrentStep('success');
        showSuccess('Enrollment submitted successfully! We will contact you soon.');
      } else {
        showError(response.message || 'Failed to submit enrollment');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      showError('Failed to submit enrollment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditForm = () => {
    setCurrentStep('form');
  };

  const handleNewEnrollment = () => {
    setCurrentStep('form');
    setFormData({});
  };

  if (loading) {
    return (
      <div className="enrollment-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading course details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="enrollment-page">
      <div className="container">
        <div className="enrollment-header">
          <h1>Course Enrollment</h1>
          {course && (
            <div className="course-info">
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <div className="course-details">
                <span className="price">₹{course.price} {course.currency}</span>
                <span className="duration">{course.duration}</span>
                <span className="level">{course.level}</span>
              </div>
            </div>
          )}
        </div>

        <div className="enrollment-content">
          {currentStep === 'form' && (
            <div className="form-section">
              <h3>Fill in your details to enroll</h3>
              <EnrollmentForm
                onSubmit={handleFormSubmit}
                initialData={formData}
              />
            </div>
          )}

          {currentStep === 'preview' && (
            <div className="preview-section">
              <h3>Review your enrollment details</h3>
              <EnrollmentPreview
                data={formData}
                course={course}
                onEdit={handleEditForm}
                onSubmit={handlePreviewSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          )}

          {currentStep === 'success' && (
            <div className="success-section">
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3>Enrollment Submitted Successfully!</h3>
              <p>Thank you for your interest in our course. Our team will review your application and contact you within 24-48 hours.</p>
              <div className="success-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/')}
                >
                  Go to Home
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={handleNewEnrollment}
                >
                  Enroll in Another Course
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrollmentPage;
