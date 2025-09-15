import React, { useState, useEffect } from 'react';
import courseService from '../../services/courseService';
import './EnrollmentPage.css';

const EnrollmentPage = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    highestQualification: '',
    institution: '',
    yearOfPassing: '',
    percentage: '',
    additionalQualifications: '',
    courseInterest: '',
    preferredBatch: '',
    trainingMode: 'online',
    experience: '',
    currentCompany: '',
    currentDesignation: '',
    expectedStartDate: '',
    howDidYouHear: '',
    motivation: '',
    careerGoals: '',
    specialRequirements: '',
    paymentMode: 'online'
  });

  useEffect(() => {
    // Get selected course from localStorage
    const courseData = localStorage.getItem('selectedCourse');
    if (courseData) {
      const course = JSON.parse(courseData);
      setSelectedCourse(course);
      setFormData(prev => ({
        ...prev,
        courseInterest: course.title,
        paymentAmount: course.price
      }));
    }
    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const enrollmentData = {
        ...formData,
        courseId: selectedCourse?.id,
        paymentAmount: selectedCourse?.price,
        paymentStatus: 'pending'
      };

      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(enrollmentData)
      });

      if (!response.ok) throw new Error('Failed to submit enrollment');

      const result = await response.json();
      
      // Clear localStorage
      localStorage.removeItem('selectedCourse');
      
      // Show success message
      alert('Enrollment submitted successfully! We will contact you soon.');
      
      // Redirect to home page
      window.location.href = '/';
      
    } catch (error) {
      console.error('Error submitting enrollment:', error);
      alert('Failed to submit enrollment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="enrollment-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading enrollment form...</p>
        </div>
      </div>
    );
  }

  if (!selectedCourse) {
    return (
      <div className="enrollment-page">
        <div className="error-container">
          <i className="fas fa-exclamation-triangle"></i>
          <h2>No Course Selected</h2>
          <p>Please select a course first before enrolling.</p>
          <button onClick={() => window.location.href = '/web-training'}>
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  const pricing = selectedCourse.hasDiscount ? {
    originalPrice: selectedCourse.originalPrice,
    currentPrice: selectedCourse.price,
    discountPercentage: selectedCourse.discountPercentage,
    hasDiscount: true
  } : {
    originalPrice: selectedCourse.price,
    currentPrice: selectedCourse.price,
    discountPercentage: 0,
    hasDiscount: false
  };

  return (
    <div className="enrollment-page">
      <div className="container">
        <div className="enrollment-header">
          <h1>Course Enrollment</h1>
          <p>Complete your enrollment for the selected course</p>
        </div>

        <div className="enrollment-content">
          {/* Course Summary */}
          <div className="course-summary">
            <h3>Selected Course</h3>
            <div className="course-card">
              <h4>{selectedCourse.title}</h4>
              <div className="course-pricing">
                {pricing.hasDiscount && (
                  <span className="original-price">
                    {courseService.formatPrice(pricing.originalPrice, selectedCourse.currency)}
                  </span>
                )}
                <span className="current-price">
                  {courseService.formatPrice(pricing.currentPrice, selectedCourse.currency)}
                </span>
                {pricing.hasDiscount && (
                  <span className="discount-badge">
                    {pricing.discountPercentage}% OFF
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Enrollment Form */}
          <form className="enrollment-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth *</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="gender">Gender *</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pincode">Pincode</label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Educational Background</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="highestQualification">Highest Qualification *</label>
                  <select
                    id="highestQualification"
                    name="highestQualification"
                    value={formData.highestQualification}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Qualification</option>
                    <option value="10th">10th</option>
                    <option value="12th">12th</option>
                    <option value="diploma">Diploma</option>
                    <option value="bachelor">Bachelor's Degree</option>
                    <option value="master">Master's Degree</option>
                    <option value="phd">PhD</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="institution">Institution *</label>
                  <input
                    type="text"
                    id="institution"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="yearOfPassing">Year of Passing *</label>
                  <input
                    type="number"
                    id="yearOfPassing"
                    name="yearOfPassing"
                    value={formData.yearOfPassing}
                    onChange={handleInputChange}
                    min="1950"
                    max="2030"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="percentage">Percentage/CGPA</label>
                  <input
                    type="text"
                    id="percentage"
                    name="percentage"
                    value={formData.percentage}
                    onChange={handleInputChange}
                    placeholder="e.g., 85% or 8.5"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="additionalQualifications">Additional Qualifications</label>
                <textarea
                  id="additionalQualifications"
                  name="additionalQualifications"
                  value={formData.additionalQualifications}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Any certifications, courses, or additional qualifications"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Training Preferences</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="preferredBatch">Preferred Batch</label>
                  <select
                    id="preferredBatch"
                    name="preferredBatch"
                    value={formData.preferredBatch}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Batch</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (1 PM - 4 PM)</option>
                    <option value="evening">Evening (6 PM - 9 PM)</option>
                    <option value="weekend">Weekend</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="trainingMode">Training Mode *</label>
                  <select
                    id="trainingMode"
                    name="trainingMode"
                    value={formData.trainingMode}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="experience">Work Experience</label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Experience</option>
                    <option value="fresher">Fresher</option>
                    <option value="1-2">1-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="expectedStartDate">Expected Start Date</label>
                  <input
                    type="date"
                    id="expectedStartDate"
                    name="expectedStartDate"
                    value={formData.expectedStartDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="motivation">Why do you want to join this course? *</label>
                <textarea
                  id="motivation"
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  rows="4"
                  required
                  placeholder="Tell us about your motivation and goals"
                />
              </div>

              <div className="form-group">
                <label htmlFor="careerGoals">Career Goals</label>
                <textarea
                  id="careerGoals"
                  name="careerGoals"
                  value={formData.careerGoals}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="What are your career aspirations?"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Payment Information</h3>
              <div className="payment-summary">
                <div className="payment-item">
                  <span>Course Fee:</span>
                  <span>{courseService.formatPrice(selectedCourse.price, selectedCourse.currency)}</span>
                </div>
                {pricing.hasDiscount && (
                  <div className="payment-item discount">
                    <span>Discount ({pricing.discountPercentage}%):</span>
                    <span>-{courseService.formatPrice(pricing.originalPrice - pricing.currentPrice, selectedCourse.currency)}</span>
                  </div>
                )}
                <div className="payment-item total">
                  <span>Total Amount:</span>
                  <span>{courseService.formatPrice(selectedCourse.price, selectedCourse.currency)}</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="paymentMode">Payment Mode *</label>
                <select
                  id="paymentMode"
                  name="paymentMode"
                  value={formData.paymentMode}
                  onChange={handleInputChange}
                  required
                >
                  <option value="online">Online Payment</option>
                  <option value="bank-transfer">Bank Transfer</option>
                  <option value="installment">Installment</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => window.history.back()}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Submit Enrollment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentPage;