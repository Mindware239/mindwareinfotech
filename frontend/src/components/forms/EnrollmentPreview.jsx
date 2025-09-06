import React from 'react';
import './EnrollmentPreview.css';

const EnrollmentPreview = ({ formData, onClose, onEdit }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'status-pending', text: 'Pending' },
      completed: { class: 'status-completed', text: 'Completed' },
      failed: { class: 'status-failed', text: 'Failed' },
      refunded: { class: 'status-refunded', text: 'Refunded' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  return (
    <div className="enrollment-preview-overlay">
      <div className="enrollment-preview-container">
        <div className="preview-header">
          <h2>Enrollment Preview</h2>
          <div className="preview-actions">
            <button onClick={onEdit} className="btn btn-outline">
              <i className="fas fa-edit"></i> Edit
            </button>
            <button onClick={onClose} className="btn btn-secondary">
              <i className="fas fa-times"></i> Close
            </button>
          </div>
        </div>

        <div className="preview-content">
          {/* Personal Details */}
          <div className="preview-section">
            <h3>
              <i className="fas fa-user"></i>
              Personal Details
            </h3>
            <div className="preview-grid">
              <div className="preview-item">
                <label>Full Name:</label>
                <span>{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="preview-item">
                <label>Email:</label>
                <span>{formData.email}</span>
              </div>
              <div className="preview-item">
                <label>Phone:</label>
                <span>{formData.phone}</span>
              </div>
              <div className="preview-item">
                <label>Date of Birth:</label>
                <span>{formatDate(formData.dateOfBirth)}</span>
              </div>
              <div className="preview-item">
                <label>Gender:</label>
                <span>{formData.gender || 'N/A'}</span>
              </div>
              <div className="preview-item">
                <label>Address:</label>
                <span>{formData.address || 'N/A'}</span>
              </div>
              <div className="preview-item">
                <label>City:</label>
                <span>{formData.city || 'N/A'}</span>
              </div>
              <div className="preview-item">
                <label>State:</label>
                <span>{formData.state || 'N/A'}</span>
              </div>
              <div className="preview-item">
                <label>Pincode:</label>
                <span>{formData.pincode || 'N/A'}</span>
              </div>
              <div className="preview-item">
                <label>Country:</label>
                <span>{formData.country || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Education Details */}
          <div className="preview-section">
            <h3>
              <i className="fas fa-graduation-cap"></i>
              Education Details
            </h3>
            <div className="preview-grid">
              <div className="preview-item">
                <label>Highest Qualification:</label>
                <span>{formData.highestQualification || 'N/A'}</span>
              </div>
              <div className="preview-item">
                <label>Institution:</label>
                <span>{formData.institution || 'N/A'}</span>
              </div>
              <div className="preview-item">
                <label>Year of Passing:</label>
                <span>{formData.yearOfPassing || 'N/A'}</span>
              </div>
              <div className="preview-item">
                <label>Percentage/CGPA:</label>
                <span>{formData.percentage || 'N/A'}</span>
              </div>
              {formData.additionalQualifications && (
                <div className="preview-item full-width">
                  <label>Additional Qualifications:</label>
                  <span>{formData.additionalQualifications}</span>
                </div>
              )}
            </div>
          </div>

          {/* Training Details */}
          <div className="preview-section">
            <h3>
              <i className="fas fa-laptop-code"></i>
              Training Details
            </h3>
            <div className="preview-grid">
              <div className="preview-item">
                <label>Course Interest:</label>
                <span>{formData.courseInterest || 'N/A'}</span>
              </div>
              <div className="preview-item">
                <label>Preferred Batch:</label>
                <span>{formData.preferredBatch || 'N/A'}</span>
              </div>
              <div className="preview-item">
                <label>Training Mode:</label>
                <span>{formData.trainingMode || 'N/A'}</span>
              </div>
              <div className="preview-item">
                <label>Experience:</label>
                <span>{formData.experience || 'N/A'}</span>
              </div>
              <div className="preview-item">
                <label>Current Company:</label>
                <span>{formData.currentCompany || 'N/A'}</span>
              </div>
              <div className="preview-item">
                <label>Current Designation:</label>
                <span>{formData.currentDesignation || 'N/A'}</span>
              </div>
              <div className="preview-item">
                <label>Expected Start Date:</label>
                <span>{formatDate(formData.expectedStartDate)}</span>
              </div>
            </div>
          </div>

          {/* Other Information */}
          <div className="preview-section">
            <h3>
              <i className="fas fa-info-circle"></i>
              Other Information
            </h3>
            <div className="preview-grid">
              <div className="preview-item">
                <label>How did you hear about us:</label>
                <span>{formData.howDidYouHear || 'N/A'}</span>
              </div>
              {formData.motivation && (
                <div className="preview-item full-width">
                  <label>Motivation:</label>
                  <span>{formData.motivation}</span>
                </div>
              )}
              {formData.careerGoals && (
                <div className="preview-item full-width">
                  <label>Career Goals:</label>
                  <span>{formData.careerGoals}</span>
                </div>
              )}
              {formData.specialRequirements && (
                <div className="preview-item full-width">
                  <label>Special Requirements:</label>
                  <span>{formData.specialRequirements}</span>
                </div>
              )}
            </div>
          </div>

          {/* Document Upload */}
          <div className="preview-section">
            <h3>
              <i className="fas fa-file-upload"></i>
              Document Upload
            </h3>
            <div className="preview-grid">
              <div className="preview-item">
                <label>Profile Photo:</label>
                <div className="file-preview">
                  {formData.profilePhoto ? (
                    <div className="file-info">
                      <img src={formData.profilePhoto.url} alt="Profile" className="file-thumbnail" />
                      <div className="file-details">
                        <span className="file-name">{formData.profilePhoto.name}</span>
                        <span className="file-size">{formatFileSize(formData.profilePhoto.size)}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="no-file">No file uploaded</span>
                  )}
                </div>
              </div>
              
              <div className="preview-item">
                <label>Resume/CV:</label>
                <div className="file-preview">
                  {formData.resume ? (
                    <div className="file-info">
                      <i className="fas fa-file-pdf file-icon"></i>
                      <div className="file-details">
                        <span className="file-name">{formData.resume.name}</span>
                        <span className="file-size">{formatFileSize(formData.resume.size)}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="no-file">No file uploaded</span>
                  )}
                </div>
              </div>

              {formData.certificates && formData.certificates.length > 0 && (
                <div className="preview-item full-width">
                  <label>Certificates:</label>
                  <div className="files-list">
                    {formData.certificates.map((cert, index) => (
                      <div key={index} className="file-info">
                        <i className="fas fa-file file-icon"></i>
                        <div className="file-details">
                          <span className="file-name">{cert.name}</span>
                          <span className="file-size">{formatFileSize(cert.size)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="preview-item">
                <label>ID Proof:</label>
                <div className="file-preview">
                  {formData.idProof ? (
                    <div className="file-info">
                      <i className="fas fa-id-card file-icon"></i>
                      <div className="file-details">
                        <span className="file-name">{formData.idProof.name}</span>
                        <span className="file-size">{formatFileSize(formData.idProof.size)}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="no-file">No file uploaded</span>
                  )}
                </div>
              </div>

              <div className="preview-item">
                <label>Address Proof:</label>
                <div className="file-preview">
                  {formData.addressProof ? (
                    <div className="file-info">
                      <i className="fas fa-home file-icon"></i>
                      <div className="file-details">
                        <span className="file-name">{formData.addressProof.name}</span>
                        <span className="file-size">{formatFileSize(formData.addressProof.size)}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="no-file">No file uploaded</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="preview-section">
            <h3>
              <i className="fas fa-credit-card"></i>
              Payment Details
            </h3>
            <div className="preview-grid">
              <div className="preview-item">
                <label>Payment Mode:</label>
                <span>{formData.paymentMode || 'N/A'}</span>
              </div>
              <div className="preview-item">
                <label>Payment Amount:</label>
                <span>{formData.paymentAmount ? `₹${formData.paymentAmount}` : 'N/A'}</span>
              </div>
              <div className="preview-item">
                <label>Payment Status:</label>
                {getStatusBadge(formData.paymentStatus)}
              </div>
              <div className="preview-item">
                <label>Payment Reference:</label>
                <span>{formData.paymentReference || 'N/A'}</span>
              </div>
              {formData.notes && (
                <div className="preview-item full-width">
                  <label>Additional Notes:</label>
                  <span>{formData.notes}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="preview-footer">
          <div className="preview-summary">
            <h4>Enrollment Summary</h4>
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">Status:</span>
                <span className="stat-value">{getStatusBadge(formData.status || 'pending')}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Submitted:</span>
                <span className="stat-value">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Documents:</span>
                <span className="stat-value">
                  {[
                    formData.profilePhoto,
                    formData.resume,
                    formData.idProof,
                    formData.addressProof,
                    ...(formData.certificates || [])
                  ].filter(Boolean).length} files
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentPreview;
