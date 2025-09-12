import React, { useState, useEffect } from 'react';
import jobService from '../../services/jobService';
import './CareersPage.css';

const CareersPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    applicant_name: '',
    applicant_email: '',
    applicant_phone: '',
    cover_letter: '',
    experience_years: '',
    current_company: '',
    current_position: '',
    expected_salary: '',
    availability: 'flexible',
    portfolio_url: '',
    linkedin_url: '',
    github_url: ''
  });

  const departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' },
    { value: 'support', label: 'Support' },
    { value: 'management', label: 'Management' }
  ];

  const jobTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'freelance', label: 'Freelance' }
  ];

  useEffect(() => {
    fetchJobs();
  }, [currentPage, selectedDepartment, selectedType, searchTerm]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: 9,
        status: 'active'
      };
      
      if (selectedDepartment !== 'all') {
        params.department = selectedDepartment;
      }
      
      if (selectedType !== 'all') {
        params.type = selectedType;
      }
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const response = await jobService.getJobs(params);
      
      if (response && response.data) {
        setJobs(response.data);
        setTotalPages(response.pages || 1);
      } else {
        setJobs([]);
      }
    } catch (err) {
      setError('Failed to load job listings');
      console.error('Error fetching jobs:', err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentChange = (department) => {
    setSelectedDepartment(department);
    setCurrentPage(1);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchJobs();
  };

  const handleJobClick = async (job) => {
    try {
      const response = await jobService.getJob(job.id);
      setSelectedJob(response.data);
      setShowJobModal(true);
    } catch (err) {
      console.error('Error fetching job details:', err);
    }
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    try {
      await jobService.applyForJob(selectedJob.id, applicationData);
      alert('Application submitted successfully!');
      setShowApplicationModal(false);
      setApplicationData({
        applicant_name: '',
        applicant_email: '',
        applicant_phone: '',
        cover_letter: '',
        experience_years: '',
        current_company: '',
        current_position: '',
        expected_salary: '',
        availability: 'flexible',
        portfolio_url: '',
        linkedin_url: '',
        github_url: ''
      });
    } catch (err) {
      console.error('Error submitting application:', err);
      alert('Failed to submit application. Please try again.');
    }
  };

  const formatSalary = (min, max, currency) => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `₹${(min / 100000).toFixed(1)}L - ₹${(max / 100000).toFixed(1)}L`;
    if (min) return `₹${(min / 100000).toFixed(1)}L+`;
    if (max) return `Up to ₹${(max / 100000).toFixed(1)}L`;
    return 'Salary not specified';
  };

  const getExperienceLevel = (level) => {
    const levels = {
      'entry': 'Entry Level',
      'junior': 'Junior',
      'mid': 'Mid Level',
      'senior': 'Senior',
      'lead': 'Lead',
      'executive': 'Executive'
    };
    return levels[level] || level;
  };

  const getDepartmentName = (dept) => {
    const departments = {
      'engineering': 'Engineering',
      'design': 'Design',
      'marketing': 'Marketing',
      'sales': 'Sales',
      'hr': 'Human Resources',
      'finance': 'Finance',
      'operations': 'Operations',
      'support': 'Support',
      'management': 'Management',
      'other': 'Other'
    };
    return departments[dept] || dept;
  };

  const renderJobCard = (job) => (
    <div key={job.id} className="job-card">
      <div className="job-card__header">
        <div className="job-card__badges">
          {job.is_featured && (
            <span className="job-badge featured">Featured</span>
          )}
          {job.is_remote && (
            <span className="job-badge remote">Remote</span>
          )}
          {job.is_urgent && (
            <span className="job-badge urgent">Urgent</span>
          )}
        </div>
        <div className="job-card__type">
          <span className="job-type">{job.type.replace('-', ' ').toUpperCase()}</span>
        </div>
      </div>

      <div className="job-card__content">
        <h3 className="job-title" onClick={() => handleJobClick(job)}>
          {job.title}
        </h3>
        <p className="job-description">{job.short_description}</p>
        
        <div className="job-meta">
          <div className="job-meta__item">
            <i className="fas fa-building"></i>
            <span>{getDepartmentName(job.department)}</span>
          </div>
          <div className="job-meta__item">
            <i className="fas fa-map-marker-alt"></i>
            <span>{job.location}</span>
          </div>
          <div className="job-meta__item">
            <i className="fas fa-user-tie"></i>
            <span>{getExperienceLevel(job.experience_level)}</span>
          </div>
        </div>

        <div className="job-salary">
          <i className="fas fa-rupee-sign"></i>
          <span>{formatSalary(job.salary_min, job.salary_max, job.currency)}</span>
        </div>

        <div className="job-skills">
          {job.skills && Array.isArray(job.skills) && job.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
          {job.skills && Array.isArray(job.skills) && job.skills.length > 3 && (
            <span className="skill-tag more">+{job.skills.length - 3} more</span>
          )}
        </div>

        <div className="job-card__actions">
          <button 
            className="btn btn-outline"
            onClick={() => handleJobClick(job)}
          >
            View Details
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => handleApplyClick(job)}
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );

  if (loading && jobs.length === 0) {
    return (
      <div className="careers-page">
        <div className="page-hero">
          <div className="container">
            <h1>Careers</h1>
            <p>Join our team and grow with us</p>
          </div>
        </div>
        
        <div className="page-content">
          <div className="container">
            <div className="jobs-filters">
              <div className="jobs-skeleton skeleton-filter"></div>
            </div>
            <div className="jobs-grid">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="job-card loading">
                  <div className="skeleton skeleton-image"></div>
                  <div className="skeleton skeleton-title"></div>
                  <div className="skeleton skeleton-text"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="careers-page">
      <div className="page-hero">
        <div className="container">
          <h1>Careers</h1>
          <p>Join our team and grow with us</p>
        </div>
      </div>
      
      <div className="page-content">
        <div className="container">
          {/* Filters and Search */}
          <div className="jobs-filters">
            <div className="filters-row">
              <div className="department-filters">
                {departments.map(dept => (
                  <button
                    key={dept.value}
                    className={`filter-btn ${selectedDepartment === dept.value ? 'active' : ''}`}
                    onClick={() => handleDepartmentChange(dept.value)}
                  >
                    {dept.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="search-row">
              <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-group">
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <button type="submit" className="search-btn">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </form>
              
              <div className="type-filters">
                {jobTypes.map(type => (
                  <button
                    key={type.value}
                    className={`filter-btn ${selectedType === type.value ? 'active' : ''}`}
                    onClick={() => handleTypeChange(type.value)}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Jobs Grid */}
          {error ? (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{error}</p>
              <button onClick={fetchJobs} className="btn btn-primary">
                Try Again
              </button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="no-items">
              <i className="fas fa-briefcase"></i>
              <h3>No job openings found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="jobs-grid">
              {jobs.map(renderJobCard)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i>
                Previous
              </button>
              
              <div className="pagination-numbers">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    <span className="pagination-ellipsis">...</span>
                    <button
                      className={`pagination-number ${currentPage === totalPages ? 'active' : ''}`}
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Job Details Modal */}
      {showJobModal && selectedJob && (
        <div className="job-modal" onClick={() => setShowJobModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowJobModal(false)}>
              <i className="fas fa-times"></i>
            </button>
            
            <div className="job-details">
              <div className="job-details__header">
                <h2>{selectedJob.title}</h2>
                <div className="job-details__badges">
                  {selectedJob.is_featured && <span className="job-badge featured">Featured</span>}
                  {selectedJob.is_remote && <span className="job-badge remote">Remote</span>}
                  {selectedJob.is_urgent && <span className="job-badge urgent">Urgent</span>}
                </div>
              </div>

              <div className="job-details__meta">
                <div className="meta-item">
                  <i className="fas fa-building"></i>
                  <span>{getDepartmentName(selectedJob.department)}</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{selectedJob.location}</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-user-tie"></i>
                  <span>{getExperienceLevel(selectedJob.experience_level)}</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-clock"></i>
                  <span>{selectedJob.type.replace('-', ' ').toUpperCase()}</span>
                </div>
              </div>

              <div className="job-details__salary">
                <i className="fas fa-rupee-sign"></i>
                <span>{formatSalary(selectedJob.salary_min, selectedJob.salary_max, selectedJob.currency)}</span>
              </div>

              <div className="job-details__content">
                <div className="job-section">
                  <h3>Job Description</h3>
                  <p>{selectedJob.description}</p>
                </div>

                {selectedJob.responsibilities && Array.isArray(selectedJob.responsibilities) && selectedJob.responsibilities.length > 0 && (
                  <div className="job-section">
                    <h3>Responsibilities</h3>
                    <ul>
                      {selectedJob.responsibilities.map((resp, index) => (
                        <li key={index}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedJob.requirements && Array.isArray(selectedJob.requirements) && selectedJob.requirements.length > 0 && (
                  <div className="job-section">
                    <h3>Requirements</h3>
                    <ul>
                      {selectedJob.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedJob.benefits && Array.isArray(selectedJob.benefits) && selectedJob.benefits.length > 0 && (
                  <div className="job-section">
                    <h3>Benefits</h3>
                    <ul>
                      {selectedJob.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedJob.skills && Array.isArray(selectedJob.skills) && selectedJob.skills.length > 0 && (
                  <div className="job-section">
                    <h3>Skills</h3>
                    <div className="skills-list">
                      {selectedJob.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="job-details__actions">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => {
                    setShowJobModal(false);
                    handleApplyClick(selectedJob);
                  }}
                >
                  Apply for this position
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {showApplicationModal && selectedJob && (
        <div className="application-modal" onClick={() => setShowApplicationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowApplicationModal(false)}>
              <i className="fas fa-times"></i>
            </button>
            
            <div className="application-form">
              <h2>Apply for {selectedJob.title}</h2>
              
              <form onSubmit={handleApplicationSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="applicant_name">Full Name *</label>
                    <input
                      type="text"
                      id="applicant_name"
                      value={applicationData.applicant_name}
                      onChange={(e) => setApplicationData({...applicationData, applicant_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="applicant_email">Email *</label>
                    <input
                      type="email"
                      id="applicant_email"
                      value={applicationData.applicant_email}
                      onChange={(e) => setApplicationData({...applicationData, applicant_email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="applicant_phone">Phone</label>
                    <input
                      type="tel"
                      id="applicant_phone"
                      value={applicationData.applicant_phone}
                      onChange={(e) => setApplicationData({...applicationData, applicant_phone: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="experience_years">Years of Experience</label>
                    <input
                      type="number"
                      id="experience_years"
                      value={applicationData.experience_years}
                      onChange={(e) => setApplicationData({...applicationData, experience_years: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="current_company">Current Company</label>
                    <input
                      type="text"
                      id="current_company"
                      value={applicationData.current_company}
                      onChange={(e) => setApplicationData({...applicationData, current_company: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="current_position">Current Position</label>
                    <input
                      type="text"
                      id="current_position"
                      value={applicationData.current_position}
                      onChange={(e) => setApplicationData({...applicationData, current_position: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expected_salary">Expected Salary (₹)</label>
                    <input
                      type="number"
                      id="expected_salary"
                      value={applicationData.expected_salary}
                      onChange={(e) => setApplicationData({...applicationData, expected_salary: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="availability">Availability</label>
                    <select
                      id="availability"
                      value={applicationData.availability}
                      onChange={(e) => setApplicationData({...applicationData, availability: e.target.value})}
                    >
                      <option value="immediate">Immediate</option>
                      <option value="2-weeks">2 weeks</option>
                      <option value="1-month">1 month</option>
                      <option value="2-months">2 months</option>
                      <option value="3-months">3 months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="portfolio_url">Portfolio URL</label>
                  <input
                    type="url"
                    id="portfolio_url"
                    value={applicationData.portfolio_url}
                    onChange={(e) => setApplicationData({...applicationData, portfolio_url: e.target.value})}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="linkedin_url">LinkedIn URL</label>
                    <input
                      type="url"
                      id="linkedin_url"
                      value={applicationData.linkedin_url}
                      onChange={(e) => setApplicationData({...applicationData, linkedin_url: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="github_url">GitHub URL</label>
                    <input
                      type="url"
                      id="github_url"
                      value={applicationData.github_url}
                      onChange={(e) => setApplicationData({...applicationData, github_url: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="cover_letter">Cover Letter</label>
                  <textarea
                    id="cover_letter"
                    rows="4"
                    value={applicationData.cover_letter}
                    onChange={(e) => setApplicationData({...applicationData, cover_letter: e.target.value})}
                    placeholder="Tell us why you're interested in this position..."
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowApplicationModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareersPage;
