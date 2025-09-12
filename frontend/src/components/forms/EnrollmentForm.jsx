import React, { useState, useRef } from 'react';
import './EnrollmentForm.css';

const EnrollmentForm = ({ onSubmit, onPreview, initialData = {}, isEdit = false }) => {
  // Ensure initialData is not null or undefined
  const safeInitialData = initialData || {};
  
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: safeInitialData.firstName || '',
    lastName: safeInitialData.lastName || '',
    email: safeInitialData.email || '',
    phone: safeInitialData.phone || '',
    dateOfBirth: safeInitialData.dateOfBirth || '',
    gender: safeInitialData.gender || '',
    address: safeInitialData.address || '',
    city: safeInitialData.city || '',
    state: safeInitialData.state || '',
    pincode: safeInitialData.pincode || '',
    country: safeInitialData.country || 'India',
    
    // Education Details
    highestQualification: safeInitialData.highestQualification || '',
    institution: safeInitialData.institution || '',
    yearOfPassing: safeInitialData.yearOfPassing || '',
    percentage: safeInitialData.percentage || '',
    additionalQualifications: safeInitialData.additionalQualifications || '',
    
    // Training Details
    courseInterest: safeInitialData.courseInterest || '',
    preferredBatch: safeInitialData.preferredBatch || '',
    trainingMode: safeInitialData.trainingMode || '',
    experience: safeInitialData.experience || '',
    currentCompany: safeInitialData.currentCompany || '',
    currentDesignation: safeInitialData.currentDesignation || '',
    expectedStartDate: safeInitialData.expectedStartDate || '',
    
    // Other Information
    howDidYouHear: safeInitialData.howDidYouHear || '',
    motivation: safeInitialData.motivation || '',
    careerGoals: safeInitialData.careerGoals || '',
    specialRequirements: safeInitialData.specialRequirements || '',
    
    // Document Upload
    profilePhoto: safeInitialData.profilePhoto || null,
    resume: safeInitialData.resume || null,
    certificates: safeInitialData.certificates || [],
    idProof: safeInitialData.idProof || null,
    addressProof: safeInitialData.addressProof || null,
    
    // Payment Details
    paymentMode: safeInitialData.paymentMode || '',
    paymentAmount: safeInitialData.paymentAmount || '',
    paymentStatus: safeInitialData.paymentStatus || 'pending',
    paymentReference: safeInitialData.paymentReference || '',
    
    // Additional fields
    status: safeInitialData.status || 'pending',
    notes: safeInitialData.notes || ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRefs = useRef({});

  const steps = [
    { id: 1, title: 'Personal Details', icon: 'fas fa-user' },
    { id: 2, title: 'Education Details', icon: 'fas fa-graduation-cap' },
    { id: 3, title: 'Training Details', icon: 'fas fa-laptop-code' },
    { id: 4, title: 'Other Information', icon: 'fas fa-info-circle' },
    { id: 5, title: 'Document Upload', icon: 'fas fa-file-upload' },
    { id: 6, title: 'Payment Details', icon: 'fas fa-credit-card' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData(prev => ({
            ...prev,
            [name]: {
              file: file,
              url: e.target.result,
              name: file.name,
              size: file.size,
              type: file.type
            }
          }));
        };
        reader.readAsDataURL(file);
      }
    } else if (name === 'certificates') {
      // Handle multiple file uploads for certificates
      const filesArray = Array.from(files);
      const certificates = filesArray.map(file => {
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onload = (e) => {
            resolve({
              file: file,
              url: e.target.result,
              name: file.name,
              size: file.size,
              type: file.type
            });
          };
          reader.readAsDataURL(file);
        });
      });
      
      Promise.all(certificates).then(certData => {
        setFormData(prev => ({
          ...prev,
          certificates: [...prev.certificates, ...certData]
        }));
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const removeFile = (fieldName, index = null) => {
    if (index !== null) {
      // Remove specific certificate
      setFormData(prev => ({
        ...prev,
        certificates: prev.certificates.filter((_, i) => i !== index)
      }));
    } else {
      // Remove single file
      setFormData(prev => ({
        ...prev,
        [fieldName]: null
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1: // Personal Details
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        break;
        
      case 2: // Education Details
        if (!formData.highestQualification) newErrors.highestQualification = 'Highest qualification is required';
        if (!formData.institution.trim()) newErrors.institution = 'Institution name is required';
        if (!formData.yearOfPassing) newErrors.yearOfPassing = 'Year of passing is required';
        break;
        
      case 3: // Training Details
        if (!formData.courseInterest) newErrors.courseInterest = 'Course interest is required';
        if (!formData.trainingMode) newErrors.trainingMode = 'Training mode is required';
        break;
        
      case 4: // Other Information
        if (!formData.motivation.trim()) newErrors.motivation = 'Motivation is required';
        break;
        
      case 5: // Document Upload
        if (!formData.profilePhoto) newErrors.profilePhoto = 'Profile photo is required';
        if (!formData.resume) newErrors.resume = 'Resume is required';
        if (!formData.idProof) newErrors.idProof = 'ID proof is required';
        break;
        
      case 6: // Payment Details
        if (!formData.paymentMode) newErrors.paymentMode = 'Payment mode is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      onSubmit(formData);
    }
  };

  const handlePreview = () => {
    setPreviewMode(true);
    onPreview(formData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-section">
            <h3>Personal Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={errors.firstName ? 'error' : ''}
                />
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={errors.lastName ? 'error' : ''}
                />
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={errors.dateOfBirth ? 'error' : ''}
                />
                {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
              </div>
              <div className="form-group">
                <label>Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={errors.gender ? 'error' : ''}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <span className="error-text">{errors.gender}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="3"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              >
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="form-section">
            <h3>Education Details</h3>
            <div className="form-group">
              <label>Highest Qualification *</label>
              <select
                name="highestQualification"
                value={formData.highestQualification}
                onChange={handleInputChange}
                className={errors.highestQualification ? 'error' : ''}
              >
                <option value="">Select Qualification</option>
                <option value="10th">10th Standard</option>
                <option value="12th">12th Standard</option>
                <option value="diploma">Diploma</option>
                <option value="bachelor">Bachelor's Degree</option>
                <option value="master">Master's Degree</option>
                <option value="phd">PhD</option>
                <option value="other">Other</option>
              </select>
              {errors.highestQualification && <span className="error-text">{errors.highestQualification}</span>}
            </div>
            
            <div className="form-group">
              <label>Institution/University *</label>
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleInputChange}
                className={errors.institution ? 'error' : ''}
              />
              {errors.institution && <span className="error-text">{errors.institution}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Year of Passing *</label>
                <input
                  type="number"
                  name="yearOfPassing"
                  value={formData.yearOfPassing}
                  onChange={handleInputChange}
                  min="1950"
                  max="2030"
                  className={errors.yearOfPassing ? 'error' : ''}
                />
                {errors.yearOfPassing && <span className="error-text">{errors.yearOfPassing}</span>}
              </div>
              <div className="form-group">
                <label>Percentage/CGPA</label>
                <input
                  type="text"
                  name="percentage"
                  value={formData.percentage}
                  onChange={handleInputChange}
                  placeholder="e.g., 85% or 8.5"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Additional Qualifications</label>
              <textarea
                name="additionalQualifications"
                value={formData.additionalQualifications}
                onChange={handleInputChange}
                rows="3"
                placeholder="Any additional certifications, courses, or qualifications"
              />
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="form-section">
            <h3>Training Details</h3>
            <div className="form-group">
              <label>Course Interest *</label>
              <select
                name="courseInterest"
                value={formData.courseInterest}
                onChange={handleInputChange}
                className={errors.courseInterest ? 'error' : ''}
              >
                <option value="">Select Course</option>
                <option value="web-development">Web Development</option>
                <option value="mobile-development">Mobile Development</option>
                <option value="data-science">Data Science</option>
                <option value="cybersecurity">Cybersecurity</option>
                <option value="cloud-computing">Cloud Computing</option>
                <option value="artificial-intelligence">Artificial Intelligence</option>
                <option value="machine-learning">Machine Learning</option>
                <option value="digital-marketing">Digital Marketing</option>
                <option value="ui-ux-design">UI/UX Design</option>
                <option value="other">Other</option>
              </select>
              {errors.courseInterest && <span className="error-text">{errors.courseInterest}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Preferred Batch</label>
                <select
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
                <label>Training Mode *</label>
                <select
                  name="trainingMode"
                  value={formData.trainingMode}
                  onChange={handleInputChange}
                  className={errors.trainingMode ? 'error' : ''}
                >
                  <option value="">Select Mode</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                {errors.trainingMode && <span className="error-text">{errors.trainingMode}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <label>Work Experience</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
              >
                <option value="">Select Experience</option>
                <option value="fresher">Fresher (0 years)</option>
                <option value="1-2">1-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Current Company</label>
                <input
                  type="text"
                  name="currentCompany"
                  value={formData.currentCompany}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Current Designation</label>
                <input
                  type="text"
                  name="currentDesignation"
                  value={formData.currentDesignation}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Expected Start Date</label>
              <input
                type="date"
                name="expectedStartDate"
                value={formData.expectedStartDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="form-section">
            <h3>Other Information</h3>
            <div className="form-group">
              <label>How did you hear about us?</label>
              <select
                name="howDidYouHear"
                value={formData.howDidYouHear}
                onChange={handleInputChange}
              >
                <option value="">Select Source</option>
                <option value="google">Google Search</option>
                <option value="social-media">Social Media</option>
                <option value="friend">Friend/Colleague</option>
                <option value="advertisement">Advertisement</option>
                <option value="website">Website</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Motivation for joining this course *</label>
              <textarea
                name="motivation"
                value={formData.motivation}
                onChange={handleInputChange}
                rows="4"
                placeholder="Tell us why you want to join this course..."
                className={errors.motivation ? 'error' : ''}
              />
              {errors.motivation && <span className="error-text">{errors.motivation}</span>}
            </div>
            
            <div className="form-group">
              <label>Career Goals</label>
              <textarea
                name="careerGoals"
                value={formData.careerGoals}
                onChange={handleInputChange}
                rows="3"
                placeholder="What are your career goals after completing this course?"
              />
            </div>
            
            <div className="form-group">
              <label>Special Requirements</label>
              <textarea
                name="specialRequirements"
                value={formData.specialRequirements}
                onChange={handleInputChange}
                rows="3"
                placeholder="Any special requirements or accommodations needed..."
              />
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="form-section">
            <h3>Document Upload</h3>
            
            <div className="form-group">
              <label>Profile Photo *</label>
              <div className="file-upload-container">
                <input
                  type="file"
                  name="profilePhoto"
                  accept="image/*"
                  onChange={handleInputChange}
                  ref={el => fileInputRefs.current.profilePhoto = el}
                  className="file-input"
                />
                <button
                  type="button"
                  onClick={() => fileInputRefs.current.profilePhoto?.click()}
                  className="file-upload-btn"
                >
                  <i className="fas fa-camera"></i> Upload Photo
                </button>
                {formData.profilePhoto && (
                  <div className="file-preview">
                    <img src={formData.profilePhoto.url} alt="Profile" />
                    <span>{formData.profilePhoto.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile('profilePhoto')}
                      className="remove-file-btn"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                )}
              </div>
              {errors.profilePhoto && <span className="error-text">{errors.profilePhoto}</span>}
            </div>
            
            <div className="form-group">
              <label>Resume/CV *</label>
              <div className="file-upload-container">
                <input
                  type="file"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleInputChange}
                  ref={el => fileInputRefs.current.resume = el}
                  className="file-input"
                />
                <button
                  type="button"
                  onClick={() => fileInputRefs.current.resume?.click()}
                  className="file-upload-btn"
                >
                  <i className="fas fa-file-pdf"></i> Upload Resume
                </button>
                {formData.resume && (
                  <div className="file-preview">
                    <i className="fas fa-file-pdf"></i>
                    <span>{formData.resume.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile('resume')}
                      className="remove-file-btn"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                )}
              </div>
              {errors.resume && <span className="error-text">{errors.resume}</span>}
            </div>
            
            <div className="form-group">
              <label>Certificates (Optional)</label>
              <div className="file-upload-container">
                <input
                  type="file"
                  name="certificates"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={handleInputChange}
                  ref={el => fileInputRefs.current.certificates = el}
                  className="file-input"
                />
                <button
                  type="button"
                  onClick={() => fileInputRefs.current.certificates?.click()}
                  className="file-upload-btn"
                >
                  <i className="fas fa-certificate"></i> Upload Certificates
                </button>
                {formData.certificates.length > 0 && (
                  <div className="files-list">
                    {formData.certificates.map((cert, index) => (
                      <div key={index} className="file-preview">
                        <i className="fas fa-file"></i>
                        <span>{cert.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile('certificates', index)}
                          className="remove-file-btn"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>ID Proof *</label>
                <div className="file-upload-container">
                  <input
                    type="file"
                    name="idProof"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleInputChange}
                    ref={el => fileInputRefs.current.idProof = el}
                    className="file-input"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current.idProof?.click()}
                    className="file-upload-btn"
                  >
                    <i className="fas fa-id-card"></i> Upload ID
                  </button>
                  {formData.idProof && (
                    <div className="file-preview">
                      <i className="fas fa-file"></i>
                      <span>{formData.idProof.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile('idProof')}
                        className="remove-file-btn"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}
                </div>
                {errors.idProof && <span className="error-text">{errors.idProof}</span>}
              </div>
              
              <div className="form-group">
                <label>Address Proof</label>
                <div className="file-upload-container">
                  <input
                    type="file"
                    name="addressProof"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleInputChange}
                    ref={el => fileInputRefs.current.addressProof = el}
                    className="file-input"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current.addressProof?.click()}
                    className="file-upload-btn"
                  >
                    <i className="fas fa-home"></i> Upload Address Proof
                  </button>
                  {formData.addressProof && (
                    <div className="file-preview">
                      <i className="fas fa-file"></i>
                      <span>{formData.addressProof.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile('addressProof')}
                        className="remove-file-btn"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 6:
        return (
          <div className="form-section">
            <h3>Payment Details</h3>
            <div className="form-group">
              <label>Payment Mode *</label>
              <select
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleInputChange}
                className={errors.paymentMode ? 'error' : ''}
              >
                <option value="">Select Payment Mode</option>
                <option value="online">Online Payment</option>
                <option value="bank-transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
                <option value="installment">Installment</option>
              </select>
              {errors.paymentMode && <span className="error-text">{errors.paymentMode}</span>}
            </div>
            
            <div className="form-group">
              <label>Payment Amount</label>
              <input
                type="number"
                name="paymentAmount"
                value={formData.paymentAmount}
                onChange={handleInputChange}
                placeholder="Enter amount"
              />
            </div>
            
            <div className="form-group">
              <label>Payment Status</label>
              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleInputChange}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Payment Reference/Transaction ID</label>
              <input
                type="text"
                name="paymentReference"
                value={formData.paymentReference}
                onChange={handleInputChange}
                placeholder="Enter transaction ID or reference"
              />
            </div>
            
            <div className="form-group">
              <label>Additional Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                placeholder="Any additional notes or comments..."
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="enrollment-form-container">
      <div className="form-header">
        <h2>{isEdit ? 'Edit Enrollment' : 'Student Enrollment Form'}</h2>
        <p>Please fill in all the required information to complete your enrollment.</p>
      </div>
      
      <div className="form-steps">
        {steps.map(step => (
          <div
            key={step.id}
            className={`step ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
          >
            <div className="step-icon">
              <i className={step.icon}></i>
            </div>
            <div className="step-title">{step.title}</div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="enrollment-form">
        <div className="form-content">
          {renderStepContent()}
        </div>
        
        <div className="form-actions">
          <div className="form-actions-left">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="btn btn-secondary"
              >
                <i className="fas fa-arrow-left"></i> Previous
              </button>
            )}
          </div>
          
          <div className="form-actions-right">
            <button
              type="button"
              onClick={handlePreview}
              className="btn btn-outline"
            >
              <i className="fas fa-eye"></i> Preview
            </button>
            
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn btn-primary"
              >
                Next <i className="fas fa-arrow-right"></i>
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-success"
              >
                <i className="fas fa-check"></i> {isEdit ? 'Update Enrollment' : 'Submit Enrollment'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default EnrollmentForm;
