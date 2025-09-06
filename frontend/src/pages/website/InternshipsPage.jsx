import React, { useState, useEffect } from 'react';
import internshipService from '../../services/internshipService';
import './InternshipsPage.css';

const InternshipsPage = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchInternships();
  }, [searchTerm, filterCategory, filterType]);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        category: filterCategory !== 'all' ? filterCategory : undefined,
        type: filterType !== 'all' ? filterType : undefined,
        status: 'active'
      };
      
      const response = await internshipService.getInternships(params);
      setInternships(response.data || []);
    } catch (err) {
      setError('Failed to load internships');
      console.error('Error fetching internships:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (internshipId) => {
    // Redirect to application page
    window.location.href = `/apply-internship/${internshipId}`;
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'web-development', label: 'Web Development' },
    { value: 'mobile-development', label: 'Mobile Development' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'ai-ml', label: 'AI/ML' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'business', label: 'Business' }
  ];

  const types = [
    { value: 'all', label: 'All Types' },
    { value: 'remote', label: 'Remote' },
    { value: 'onsite', label: 'On-site' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  if (loading) {
    return (
      <div className="internships-page loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading internships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="internships-page">
      <div className="page-hero">
        <div className="container">
          <h1>Internship Opportunities</h1>
          <p>Find the perfect internship to kickstart your career</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <div className="filters-section">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input 
                type="text"
                placeholder="Search internships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-controls">
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="filter-select"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                {types.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error ? (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{error}</p>
              <button onClick={fetchInternships} className="btn btn-primary">
                Try Again
              </button>
            </div>
          ) : (
            <div className="internships-grid">
              {internships.map(internship => (
                <div key={internship.id} className="internship-card">
                  <div className="card-header">
                    <div className="company-info">
                      <h3>{internship.title}</h3>
                      <p>{internship.company} • {internship.location}</p>
                    </div>
                    <div className="card-badges">
                      <span className={`type-badge type-${internship.type}`}>
                        {internship.type.toUpperCase()}
                      </span>
                      <span className={`category-badge category-${internship.category}`}>
                        {internship.category.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <p className="description">{internship.short_description}</p>
                    
                    <div className="internship-details">
                      <div className="detail-item">
                        <i className="fas fa-clock"></i>
                        <span>{internship.duration} {internship.duration_unit}</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-rupee-sign"></i>
                        <span>
                          {internship.stipend_amount > 0 
                            ? `₹${internship.stipend_amount.toLocaleString()}/month` 
                            : 'Unpaid'
                          }
                        </span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-users"></i>
                        <span>{internship.current_applications}/{internship.max_applications} applied</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-footer">
                    <div className="deadline">
                      <i className="fas fa-calendar"></i>
                      <span>Apply by {new Date(internship.application_deadline).toLocaleDateString()}</span>
                    </div>
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleApply(internship.id)}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {internships.length === 0 && !loading && (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <h3>No internships found</h3>
              <p>Try adjusting your search criteria or check back later for new opportunities.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InternshipsPage;
