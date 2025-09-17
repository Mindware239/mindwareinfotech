import React, { useState, useEffect, useRef } from 'react';
import './WhyChooseSectionNew.css';

const WhyChooseSectionNew = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    state: '',
    degree: '',
    graduationYear: '',
    jobStatus: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tabs = [
    {
      id: 'lectures',
      title: 'Lectures and Assignments',
      icon: 'fas fa-play',
      features: ['Live Lectures', 'Lifetime Access', 'Lecture Recordings', 'Daily Assignments'],
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 'learning-support',
      title: 'Learning support',
      icon: 'fas fa-comments',
      features: ['HR expert sessions', 'Project Mentorship', 'Live Doubt Resolution', 'Mentorship Sessions', 'Learning coach'],
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 'skill-evaluation',
      title: 'Skill Evaluation',
      icon: 'fas fa-cube',
      features: ['Weekend contests', 'Module-end tests', 'Mid-course mock interviews', 'Full-course mock interviews', 'Placement mock interviews'],
      imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 'placement-services',
      title: 'Placement Services',
      icon: 'fas fa-briefcase',
      features: ['Dedicated Placement Team', '500+ hiring partners', 'Placement Mock Interviews', 'Placement Coach', 'Referrals to top tech companies'],
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 'self-learning',
      title: 'Self Learning Resources',
      icon: 'fas fa-calendar-check',
      features: ['Projects', 'Gym', 'Placement related resources', 'Soft Skill Resources', 'Topic-wise notes'],
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    }
  ];


  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact/brochure-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        alert('Thank you! Your details have been submitted successfully.');
        setShowModal(false);
        setFormData({
          name: '',
          whatsapp: '',
          state: '',
          degree: '',
          graduationYear: '',
          jobStatus: ''
        });
      } else {
        alert(result.message || 'Sorry, there was an error submitting your details. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Sorry, there was an error submitting your details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="why-choose-section">
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <h3 className="section-subtitle">WHY CHOOSE US</h3>
          <div className="line"></div>
          <h2 className="section-title">
            <span className="highlight"><span>All in one place : </span>From conceptual learning to implementation to placement!</span>
          </h2>
          <p className="section-description">
            You will have access to Live Doubt Solving, 1-on-1 Practice Interviews, Weekly Contests, Our Placement Portal and More!
          </p>
        </div>


        {/* Desktop Tabs */}
        <div className="desktop-tabs">
          <ul className="tab-header">
            {tabs.map((tab, index) => (
              <li
                key={tab.id}
                className={`tab-item ${activeTab === index ? 'active' : ''}`}
                onClick={() => setActiveTab(index)}
              >
                <i className={tab.icon}></i>
                <span>{tab.title}</span>
              </li>
            ))}
          </ul>

          <div className="tab-content">
            <div className="tab-content-left">
              <h3 className="tab-title">{tabs[activeTab].title}</h3>
              <ul className="features-list">
                {tabs[activeTab].features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <i className="fas fa-check tick-icon"></i>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="download-section">
                <p className="download-text">
                  To know more about the course in detail, download our Brochure
                </p>
                <button 
                  className="download-btn"
                  onClick={() => setShowModal(true)}
                >
                  Download Brochure
                </button>
              </div>
            </div>
            <div className="tab-content-right">
              <div className="feature-image">
                <img 
                  src={tabs[activeTab].imageUrl} 
                  alt={tabs[activeTab].title}
                  onError={(e) => {
                    e.target.src = '/images/feature-placeholder.svg';
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sections */}
        <div className="mobile-sections">
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              className="mobile-section"
            >
              <div className="section-header-mobile">
                <i className={tab.icon}></i>
                <h3>{tab.title}</h3>
              </div>
              <ul className="features-list">
                {tab.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="feature-item">
                    <i className="fas fa-check tick-icon"></i>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="download-section">
                <p className="download-text">
                  To know more about the course in detail, download our Brochure
                </p>
                <button 
                  className="download-btn"
                  onClick={() => setShowModal(true)}
                >
                  Download Brochure
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
              >
                <i className="fas fa-times"></i>
              </button>
              <h2>Your Dream Career Awaits!</h2>
              <p>Fill your details to download Mindware Infotech brochure</p>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <i className="fab fa-whatsapp"></i>
                <div className="phone-input">
                  <select className="country-code">
                    <option value="+91">+91</option>
                  </select>
                  <input
                    type="tel"
                    name="whatsapp"
                    placeholder="Enter whatsapp number"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <i className="fas fa-map-marker-alt"></i>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select State</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Pune">Pune</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <i className="fas fa-graduation-cap"></i>
                <select
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Degree</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="B.E">B.E</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="B.C.A">B.C.A</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="M.Sc">M.Sc</option>
                  <option value="M.C.A">M.C.A</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <i className="fas fa-calendar"></i>
                <select
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Graduation Year</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                  <option value="2019">2019</option>
                  <option value="2018">2018</option>
                  <option value="Earlier">Earlier</option>
                </select>
              </div>
              <div className="form-group">
                <i className="fas fa-briefcase"></i>
                <select
                  name="jobStatus"
                  value={formData.jobStatus}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Job Status</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Experienced">Experienced</option>
                  <option value="Student">Student</option>
                  <option value="Unemployed">Unemployed</option>
                </select>
              </div>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Download Brochure'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default WhyChooseSectionNew;
