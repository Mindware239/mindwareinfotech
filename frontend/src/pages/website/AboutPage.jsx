import React, { useState, useEffect } from 'react';
import './AboutPage.css';

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({
    students: 0,
    projects: 0,
    companies: 0,
    years: 0
  });

  useEffect(() => {
    setIsVisible(true);
    
    // Animate stats
    const animateStats = () => {
      const targetStats = {
        students: 15000,
        projects: 5000,
        companies: 200,
        years: 27
      };
      
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setStats({
          students: Math.floor(targetStats.students * progress),
          projects: Math.floor(targetStats.projects * progress),
          companies: Math.floor(targetStats.companies * progress),
          years: Math.floor(targetStats.years * progress)
        });
        
        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, stepDuration);
    };
    
    setTimeout(animateStats, 500);
  }, []);

  const technologies = [
    { name: 'React', icon: '⚛️', color: '#61DAFB' },
    { name: 'Node.js', icon: '🟢', color: '#339933' },
    { name: 'Python', icon: '🐍', color: '#3776AB' },
    { name: 'JavaScript', icon: '🟨', color: '#F7DF1E' },
    { name: 'AWS', icon: '☁️', color: '#FF9900' },
    { name: 'Docker', icon: '🐳', color: '#2496ED' },
    { name: 'MongoDB', icon: '🍃', color: '#47A248' },
    { name: 'Git', icon: '📝', color: '#F05032' }
  ];

  const values = [
    {
      icon: '🎯',
      title: 'Excellence',
      description: 'We strive for the highest quality in everything we do, from our training programs to our student outcomes.'
    },
    {
      icon: '🤝',
      title: 'Collaboration',
      description: 'We believe in the power of teamwork and creating an environment where everyone can thrive together.'
    },
    {
      icon: '🚀',
      title: 'Innovation',
      description: 'We stay ahead of the curve by embracing new technologies and teaching cutting-edge skills.'
    },
    {
      icon: '💡',
      title: 'Learning',
      description: 'We foster a culture of continuous learning and growth for both our students and our team.'
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-background">
          <div className="floating-elements">
            <div className="floating-icon">💻</div>
            <div className="floating-icon">⚡</div>
            <div className="floating-icon">🔧</div>
            <div className="floating-icon">📱</div>
            <div className="floating-icon">🌐</div>
          </div>
        </div>
        <div className="container">
          <div className={`hero-content ${isVisible ? 'animate-in' : ''}`}>
            <h1 className="hero-title">
              <span className="gradient-text">About Mindware India</span>
            </h1>
            <p className="hero-subtitle">
              Empowering the next generation of software developers with cutting-edge technology training and real-world experience
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">{stats.students.toLocaleString()}+</div>
                <div className="stat-label">Students Trained</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{stats.projects.toLocaleString()}+</div>
                <div className="stat-label">Projects Completed</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{stats.companies}+</div>
                <div className="stat-label">Partner Companies</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{stats.years}+</div>
                <div className="stat-label">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Our Mission</h2>
              <p>
                At Mindware India, we bridge the gap between academic learning and industry requirements. 
                Our mission is to provide students with hands-on experience, practical skills, and real-world 
                projects that prepare them for successful careers in technology.
              </p>
              <div className="mission-features">
                <div className="feature-item">
                  <div className="feature-icon">🎓</div>
                  <div className="feature-text">
                    <h4>Industry-Ready Skills</h4>
                    <p>Learn the latest technologies used in top tech companies</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">💼</div>
                  <div className="feature-text">
                    <h4>Real-World Projects</h4>
                    <p>Work on actual projects that mirror industry challenges</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🏆</div>
                  <div className="feature-text">
                    <h4>Career Support</h4>
                    <p>Get placement assistance and career guidance</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mission-visual">
              <div className="code-animation">
                <div className="code-line">
                  <span className="code-keyword">const</span> 
                  <span className="code-variable"> future</span> 
                  <span className="code-operator"> = </span>
                  <span className="code-string">'bright'</span>
                </div>
                <div className="code-line">
                  <span className="code-keyword">if</span>
                  <span className="code-punctuation">(</span>
                  <span className="code-variable">dedication</span>
                  <span className="code-operator"> && </span>
                  <span className="code-variable">hardWork</span>
                  <span className="code-punctuation">)</span> 
                  <span className="code-punctuation">{"{"}</span>
                </div>
                <div className="code-line indent">
                  <span className="code-variable">success</span>
                  <span className="code-operator"> = </span>
                  <span className="code-string">'guaranteed'</span>
                </div>
                <div className="code-line">
                  <span className="code-punctuation">{"}"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="technologies-section">
        <div className="container">
          <h2>Technologies We Master</h2>
          <p>Stay ahead with the latest and most in-demand technologies</p>
          <div className="tech-grid">
            {technologies.map((tech, index) => (
              <div key={tech.name} className="tech-item" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="tech-icon" style={{ backgroundColor: tech.color }}>
                  {tech.icon}
                </div>
                <span className="tech-name">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={value.title} className="value-card" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2>Meet Our Expert Team</h2>
          <p>Industry veterans with years of experience in software development and training</p>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <div className="member-avatar">👨‍💼</div>
                <div className="member-overlay">
                  <div className="social-links">
                    <a href="#" className="social-link">📧</a>
                    <a href="#" className="social-link">💼</a>
                    <a href="#" className="social-link">🐦</a>
                  </div>
                </div>
              </div>
              <h3>Rajesh Kumar</h3>
              <p className="member-role">CEO & Founder</p>
              <p className="member-bio">27+ years in software development, former Microsoft engineer</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <div className="member-avatar">👩‍💻</div>
                <div className="member-overlay">
                  <div className="social-links">
                    <a href="#" className="social-link">📧</a>
                    <a href="#" className="social-link">💼</a>
                    <a href="#" className="social-link">🐦</a>
                  </div>
                </div>
              </div>
              <h3>Priya Sharma</h3>
              <p className="member-role">CTO</p>
              <p className="member-bio">Full-stack expert with 15+ years in React and Node.js</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <div className="member-avatar">👨‍🎓</div>
                <div className="member-overlay">
                  <div className="social-links">
                    <a href="#" className="social-link">📧</a>
                    <a href="#" className="social-link">💼</a>
                    <a href="#" className="social-link">🐦</a>
                  </div>
                </div>
              </div>
              <h3>Amit Patel</h3>
              <p className="member-role">Head of Training</p>
              <p className="member-bio">Python and AI specialist, former Google developer</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Tech Journey?</h2>
            <p>Join thousands of students who have transformed their careers with our programs</p>
            <div className="cta-buttons">
              <a href="/enroll" className="btn btn-primary">Start Learning Today</a>
              <a href="/contact" className="btn btn-outline">Get in Touch</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
