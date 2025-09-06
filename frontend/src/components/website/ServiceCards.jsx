import React from 'react';
import { Link } from 'react-router-dom';
import './ServiceCards.css';

const ServiceCards = () => {
  const services = [
    {
      id: 1,
      title: 'Web Development',
      description: 'Learn modern web development with HTML, CSS, JavaScript, React, and Node.js',
      icon: 'fas fa-code',
      color: 'primary',
      features: ['Frontend Development', 'Backend Development', 'Full Stack Projects'],
      link: '/internships?category=web-development'
    },
    {
      id: 2,
      title: 'Mobile Development',
      description: 'Build mobile apps for iOS and Android using React Native and Flutter',
      icon: 'fas fa-mobile-alt',
      color: 'secondary',
      features: ['React Native', 'Flutter', 'App Store Deployment'],
      link: '/internships?category=mobile-development'
    },
    {
      id: 3,
      title: 'Data Science',
      description: 'Master data analysis, machine learning, and AI with Python and R',
      icon: 'fas fa-chart-line',
      color: 'success',
      features: ['Python Programming', 'Machine Learning', 'Data Visualization'],
      link: '/internships?category=data-science'
    },
    {
      id: 4,
      title: 'UI/UX Design',
      description: 'Create beautiful and user-friendly interfaces with modern design tools',
      icon: 'fas fa-paint-brush',
      color: 'warning',
      features: ['Figma', 'Adobe XD', 'User Research'],
      link: '/internships?category=design'
    },
    {
      id: 5,
      title: 'DevOps',
      description: 'Learn cloud computing, containerization, and deployment strategies',
      icon: 'fas fa-cloud',
      color: 'info',
      features: ['AWS/Azure', 'Docker', 'Kubernetes'],
      link: '/internships?category=devops'
    },
    {
      id: 6,
      title: 'Cybersecurity',
      description: 'Protect systems and networks from cyber threats and attacks',
      icon: 'fas fa-shield-alt',
      color: 'danger',
      features: ['Ethical Hacking', 'Network Security', 'Penetration Testing'],
      link: '/internships?category=cybersecurity'
    }
  ];

  return (
    <section className="service-cards">
      <div className="container">
        <div className="section-header">
          <h2>Our Services</h2>
          <p>Comprehensive training programs designed to launch your tech career</p>
        </div>
        
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className={`service-card service-card--${service.color}`}>
              <div className="service-card__icon">
                <i className={service.icon}></i>
              </div>
              
              <div className="service-card__content">
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__description">{service.description}</p>
                
                <ul className="service-card__features">
                  {service.features.map((feature, index) => (
                    <li key={index} className="service-card__feature">
                      <i className="fas fa-check"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link to={service.link} className="service-card__link">
                  Learn More
                  <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="services-cta">
          <Link to="/internships" className="btn btn-primary btn-lg">
            View All Internships
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceCards;
