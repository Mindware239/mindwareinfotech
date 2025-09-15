import React from 'react';
import './WhyChooseSection.css';

const WhyChooseSection = () => {
  const features = [
    {
      icon: '👥',
      title: 'Expert Team',
      description: 'Experienced developers and trainers with years of industry experience and proven track records.',
      color: '#8b5cf6'
    },
    {
      icon: '⏰',
      title: 'On-Time Delivery',
      description: 'We deliver projects on time without compromising on quality, ensuring client satisfaction every time.',
      color: '#f59e0b'
    },
    {
      icon: '🛡️',
      title: 'Quality Assurance',
      description: 'Rigorous testing and quality checks ensure bug-free software with industry-leading standards.',
      color: '#10b981'
    },
    {
      icon: '🎧',
      title: '24/7 Support',
      description: 'Round-the-clock support for all your software needs with dedicated customer success team.',
      color: '#06b6d4'
    },
    {
      icon: '🚀',
      title: 'Modern Technology',
      description: 'Stay ahead with the latest technologies including React, Node.js, Python, AI/ML, and cloud platforms.',
      color: '#ef4444'
    },
    {
      icon: '💼',
      title: 'Job Placement',
      description: '100% placement assistance with our strong industry network and career guidance programs.',
      color: '#8b5cf6'
    },
    {
      icon: '📚',
      title: 'Hands-on Learning',
      description: 'Practical, project-based learning approach with real-world case studies and industry projects.',
      color: '#f59e0b'
    },
    {
      icon: '🏆',
      title: 'Industry Recognition',
      description: 'Certified courses and industry-recognized certifications that boost your career prospects.',
      color: '#10b981'
    }
  ];

  return (
    <section className="why-choose-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            Why Choose <span className="highlight">Mindware Infotech</span>?
          </h2>
          <p className="section-subtitle">
            We are committed to delivering excellence in software development and training with cutting-edge solutions. 
            Our innovative approach combines industry expertise with modern technology to provide comprehensive learning experiences 
            that prepare you for real-world challenges in the ever-evolving tech landscape.
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon" style={{ backgroundColor: feature.color }}>
                <span className="icon-emoji">{feature.icon}</span>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-underline" style={{ backgroundColor: feature.color }}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
