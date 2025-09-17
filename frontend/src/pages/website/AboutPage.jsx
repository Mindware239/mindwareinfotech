import React, { useState, useEffect, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './AboutPage.css';
import ApplyForBatchesSection from '../../components/website/ApplyForBatchesSection';



const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTimelineItem, setActiveTimelineItem] = useState(0);
  const [stats, setStats] = useState({
    students: 0,
    projects: 0,
    companies: 0,
    years: 0
  });

  const timelineRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    // Disable AOS completely
    AOS.init({
      disable: true
    });
    
    setIsVisible(true);
    
    // Animate stats with requestAnimationFrame for better performance
    const animateStats = () => {
      const targetStats = {
        students: 15000,
        projects: 5000,
        companies: 200,
        years: 27
      };
      
      const duration = 1500;
      const startTime = performance.now();
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        setStats({
          students: Math.floor(targetStats.students * progress),
          projects: Math.floor(targetStats.projects * progress),
          companies: Math.floor(targetStats.companies * progress),
          years: Math.floor(targetStats.years * progress)
        });
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    };
    
    setTimeout(animateStats, 300);

    // Timeline auto-scroll
    const timelineInterval = setInterval(() => {
      setActiveTimelineItem(prev => (prev + 1) % journeyTimeline.length);
    }, 4000);

    return () => clearInterval(timelineInterval);
  }, []);

  const journeyTimeline = [
    {
      year: "1997",
      title: "The Beginning",
      description: "Mindware Infotech was founded with a vision to bridge the gap between academic learning and industry requirements. Started as a small training center in Mumbai.",
      icon: "🌱",
      color: "#E3F2FD"
    },
    {
      year: "2005",
      title: "Digital Transformation",
      description: "Expanded our curriculum to include modern programming languages and web development technologies. Launched our first online training program.",
      icon: "💻",
      color: "#F3E5F5"
    },
    {
      year: "2012",
      title: "Industry Partnerships",
      description: "Established partnerships with leading tech companies. Started providing placement assistance and career guidance to our students.",
      icon: "🤝",
      color: "#E8F5E8"
    },
    {
      year: "2018",
      title: "AI & Machine Learning",
      description: "Introduced cutting-edge courses in Artificial Intelligence, Machine Learning, and Data Science. Became a pioneer in emerging technologies.",
      icon: "🤖",
      color: "#FFF3E0"
    },
    {
      year: "2021",
      title: "Global Expansion",
      description: "Expanded our reach globally with online training programs. Reached 10,000+ students across 50+ countries.",
      icon: "🌍",
      color: "#FCE4EC"
    },
    {
      year: "2024",
      title: "Future Ready",
      description: "Launched advanced programs in Cloud Computing, DevOps, and Full-Stack Development. Preparing students for the future of technology.",
      icon: "🚀",
      color: "#E0F2F1"
    }
  ];

  const values = [
    {
      icon: "🎯",
      title: "Excellence",
      description: "We strive for the highest quality in everything we do, from our training programs to our student outcomes.",
      color: "#E3F2FD"
    },
    {
      icon: "🤝",
      title: "Collaboration",
      description: "We believe in the power of teamwork and creating an environment where everyone can thrive together.",
      color: "#F3E5F5"
    },
    {
      icon: "🚀",
      title: "Innovation",
      description: "We stay ahead of the curve by embracing new technologies and teaching cutting-edge skills.",
      color: "#E8F5E8"
    },
    {
      icon: "💡",
      title: "Learning",
      description: "We foster a culture of continuous learning and growth for both our students and our team.",
      color: "#FFF3E0"
    }
  ];

  const technologies = [
    { name: 'React', icon: '⚛️', color: '#61DAFB', bgColor: '#E3F2FD' },
    { name: 'Node.js', icon: '🟢', color: '#339933', bgColor: '#E8F5E8' },
    { name: 'Python', icon: '🐍', color: '#3776AB', bgColor: '#E3F2FD' },
    { name: 'JavaScript', icon: '🟨', color: '#F7DF1E', bgColor: '#FFF8E1' },
    { name: 'AWS', icon: '☁️', color: '#FF9900', bgColor: '#FFF3E0' },
    { name: 'Docker', icon: '🐳', color: '#2496ED', bgColor: '#E3F2FD' },
    { name: 'MongoDB', icon: '🍃', color: '#47A248', bgColor: '#E8F5E8' },
    { name: 'Git', icon: '📝', color: '#F05032', bgColor: '#FFEBEE' }
  ];

  const teamMembers = [
    {
      name: "Rajesh Kumar",
      role: "CEO & Founder",
      bio: "27+ years in software development, former Microsoft engineer",
      avatar: "👨‍💼",
      color: "#E3F2FD"
    },
    {
      name: "Priya Sharma",
      role: "CTO",
      bio: "Full-stack expert with 15+ years in React and Node.js",
      avatar: "👩‍💻",
      color: "#F3E5F5"
    },
    {
      name: "Amit Patel",
      role: "Head of Training",
      bio: "Python and AI specialist, former Google developer",
      avatar: "👨‍🎓",
      color: "#E8F5E8"
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Background Image Section */}
      <section className="about-hero-bg">
        <div className="hero-overlay">
          <div className="container">
            <div className="hero-content">
              <div className="hero-badge">
                <span className="badge-icon">✨</span>
                <span>27 Years of Excellence</span>
              </div>
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
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <div className="section-badge">
                <span className="badge-icon">🎯</span>
                <span>Our Mission</span>
              </div>
              <h2>Bridging the Gap Between Learning and Industry</h2>
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
                <div className="code-header">
                  <div className="code-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="code-title">mindware.js</span>
                </div>
                <div className="code-content">
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
        </div>
      </section>

      {/* Journey Timeline Section */}
      <section className="journey-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <span className="badge-icon">📅</span>
              <span>Our Journey</span>
            </div>
            <h2>27 Years of Innovation & Growth</h2>
            <p>From a small training center to a global technology education leader</p>
          </div>
           <div className="timeline-container" ref={timelineRef}>
             <div className="timeline-line"></div>
             {journeyTimeline.map((item, index) => (
               <div 
                 key={index} 
                 className={`timeline-item ${activeTimelineItem === index ? 'active' : ''}`}
                 style={{ animationDelay: `${index * 0.3}s` }}
               >
                 <div 
                   className="timeline-dot" 
                   style={{ backgroundColor: item.color }}
                 >
                   <span className="timeline-icon">{item.icon}</span>
                 </div>
                 <div 
                   className="timeline-content" 
                   style={{ backgroundColor: item.color }}
                 >
                   <div className="timeline-year">
                     {item.year}
                   </div>
                   <h3 className="timeline-title">
                     {item.title}
                   </h3>
                   <p className="timeline-description">
                     {item.description}
                   </p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <span className="badge-icon">💎</span>
              <span>Our Values</span>
            </div>
            <h2>What Drives Us Forward</h2>
            <p>The principles that guide everything we do</p>
          </div>
          <div className="values-grid">
            {values.map((value, index) => (
              <div 
                key={value.title} 
                className="value-card" 
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  backgroundColor: value.color 
                }}
              >
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="technologies-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <span className="badge-icon">⚡</span>
              <span>Technologies</span>
            </div>
            <h2>Technologies We Master</h2>
            <p>Stay ahead with the latest and most in-demand technologies</p>
          </div>
          <div className="tech-grid">
            {technologies.map((tech, index) => (
              <div 
                key={tech.name} 
                className="tech-item" 
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  backgroundColor: tech.bgColor 
                }}
              >
                <div className="tech-icon" style={{ backgroundColor: tech.color }}>
                  {tech.icon}
                </div>
                <span className="tech-name">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <span className="badge-icon">👥</span>
              <span>Our Team</span>
            </div>
            <h2>Meet Our Expert Team</h2>
            <p>Industry veterans with years of experience in software development and training</p>
          </div>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div 
                key={member.name} 
                className="team-member" 
                style={{ 
                  animationDelay: `${index * 0.2}s`,
                  backgroundColor: member.color 
                }}
              >
                <div className="member-image">
                  <div className="member-avatar">{member.avatar}</div>
                  <div className="member-overlay">
                    <div className="social-links">
                      <a href="#" className="social-link">📧</a>
                      <a href="#" className="social-link">💼</a>
                      <a href="#" className="social-link">🐦</a>
                    </div>
                  </div>
                </div>
                <h3>{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <p className="member-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply for Upcoming Batches Section */}
      <ApplyForBatchesSection />

      {/* CTA Section */}
      
    </div>
  );
};

export default AboutPage;