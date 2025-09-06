import React from 'react';
import './TrainingProgramsSection.css';

const TrainingProgramsSection = () => {
  const programs = [
    {
      title: 'Paid Internships',
      description: 'Join our team as a paid intern and work on real projects while earning valuable experience and compensation. Perfect for students and fresh graduates looking to kickstart their careers.',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
      buttonText: 'Apply Now',
      buttonColor: '#fce7f3',
      textColor: '#be185d'
    },
    {
      title: 'Unpaid Internships',
      description: 'Gain hands-on experience with our unpaid internship program. Work on real projects, learn from industry experts, and build your portfolio for future opportunities.',
      gradient: 'linear-gradient(135deg, #1e40af 0%, #06b6d4 100%)',
      buttonText: 'Learn More',
      buttonColor: '#dbeafe',
      textColor: '#1e40af'
    },
    {
      title: 'Industrial Training',
      description: 'Comprehensive training programs designed to bridge the gap between academic knowledge and industry requirements. Get certified and job-ready.',
      gradient: 'linear-gradient(135deg, #059669 0%, #06b6d4 100%)',
      buttonText: 'Enroll Now',
      buttonColor: '#d1fae5',
      textColor: '#059669'
    },
    {
      title: 'Programming Courses',
      description: 'Learn programming languages, frameworks, and best practices from industry experts. From beginner to advanced levels, we have courses for everyone.',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
      buttonText: 'View Courses',
      buttonColor: '#fef3c7',
      textColor: '#d97706'
    }
  ];

  return (
    <section className="training-programs-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Training & Internship Programs</h2>
        </div>
        
        <div className="programs-grid">
          {programs.map((program, index) => (
            <div key={index} className="program-card">
              <div 
                className="program-background" 
                style={{ background: program.gradient }}
              ></div>
              <div className="program-content">
                <h3 className="program-title">{program.title}</h3>
                <p className="program-description">{program.description}</p>
                <button 
                  className="program-button"
                  style={{ 
                    backgroundColor: program.buttonColor,
                    color: program.textColor
                  }}
                >
                  {program.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrainingProgramsSection;
