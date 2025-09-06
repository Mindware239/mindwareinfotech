import React from 'react';
import './AboutSection.css';

const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        {/* Left Sidebar */}
        <div className="about-sidebar">
          
       

          {/* Years of Excellence Badge */}
          <div className="excellence-badge">
            <img src="/mindwareinfotech.png" alt="27+ Years of Excellence" className="excellence-image" />
          </div>

         
        </div>

        {/* Main Content */}
        <div className="about-main">
          <div className="about-header">
            <div className="header-icon">
              <i className="fas fa-building"></i>
            </div>
            <h2>About Mindware India</h2>
            <div className="header-underline"></div>
          </div>

          <div className="about-content">
            <p className="about-description">
              Mindware India is a full-fledged software development company offering real-world projects, 
              internships, and training opportunities for aspiring developers.
            </p>
            
            <p className="about-mission">
              Whether you want to learn, intern, or join as a professional, we have the right path for you. 
              Our comprehensive programs bridge the gap between academic knowledge and industry requirements.
            </p>

            {/* Offerings Cards */}
            <div className="offerings-grid">
              <div className="offering-card">
                <div className="card-icon training">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <h3>Training Programs</h3>
                <p>Industry-focused courses</p>
              </div>
              
              <div className="offering-card">
                <div className="card-icon internship">
                  <i className="fas fa-briefcase"></i>
                </div>
                <h3>Internships</h3>
                <p>Real-world experience</p>
              </div>
              
              <div className="offering-card">
                <div className="card-icon software">
                  <i className="fas fa-code"></i>
                </div>
                <h3>Software Solutions</h3>
                <p>Custom development</p>
              </div>
            </div>
          </div>

          {/* Chat Widget */}
          <div className="chat-widget">
            <div className="chat-icon">
              <i className="fas fa-comments"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
