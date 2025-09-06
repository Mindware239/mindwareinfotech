import React from 'react';
import './TransformFutureSection.css';

const TransformFutureSection = () => {
  const stats = [
    { number: '10,000+', label: 'Students Trained' },
    { number: '95%', label: 'Job Placement Rate' },
    { number: '500+', label: 'Industry Partners' },
    { number: '24/7', label: 'Learning Support' }
  ];

  const technologies = [
    'Node.js', 'Nginx', 'TypeScript', 'JavaScript', 'Android', 'Docker',
    'GitHub', 'AWS', 'PostgreSQL', 'React', 'HTML5', 'CSS3', 'Git',
    'Cypress', 'Next.js', 'Python', 'MongoDB', 'Vue.js', 'Angular',
    'Express', 'Redux', 'GraphQL', 'Jest', 'Webpack', 'Babel'
  ];

  return (
    <section className="transform-future-section">
      <div className="container">
        <div className="content-wrapper">
          <div className="left-content">
            <h2 className="main-title">Transform Your Future Today</h2>
            <p className="description">
              Join thousands of students who've successfully transitioned from beginners to industry professionals. 
              Our proven methodology and daily support system ensure your success.
            </p>
            
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
            
            <div className="career-guarantee">
              <div className="guarantee-icon">📈</div>
              <div className="guarantee-text">
                <strong>Career Growth Guaranteed</strong>
                <p>Our students see an average 300% salary increase within 6 months of completion</p>
              </div>
            </div>
          </div>
          
          <div className="right-content">
            <button className="master-tech-btn">
              <span className="btn-icon">👁️</span>
              Master These Technologies
            </button>
            
            <div className="technologies-card">
              <div className="tech-grid">
                {technologies.map((tech, index) => (
                  <div key={index} className="tech-item">
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransformFutureSection;
