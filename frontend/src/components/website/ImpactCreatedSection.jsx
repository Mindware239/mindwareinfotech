import React, { useEffect, useState } from 'react';
import './ImpactCreatedSection.css';

const ImpactCreatedSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.querySelector('.impact-created-section');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  const stats = [
    {
      label: 'STUDENTS TRAINED',
      value: 1250,
      suffix: '+',
      color: '#3b82f6'
    },
    {
      label: 'HIGHEST SALARY',
      value: 18,
      suffix: 'LPA',
      color: '#10b981'
    },
    {
      label: 'PARTNER COMPANIES',
      value: 25,
      suffix: '+',
      color: '#f59e0b'
    },
    {
      label: 'AVERAGE SALARY',
      value: 8.5,
      suffix: 'LPA',
      color: '#ef4444'
    }
  ];

  return (
    <section className="impact-created-section">
      <div className="impact-container">
        <div className="impact-title-container">
          <h2 className="impact-section-title">IMPACT CREATED</h2>
          <div className="impact-underline"></div>
        </div>
        
        <div className="impact-stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="impact-stat-item">
              <p className="stat-label">{stat.label}</p>
              <h3 className="impact-stat-value">
                <div className="counter animated">
                  {isVisible && (
                    <AnimatedCounter 
                      value={stat.value} 
                      suffix={stat.suffix}
                      color={stat.color}
                      index={index}
                    />
                  )}
                </div>
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AnimatedCounter = ({ value, suffix, color, index }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    const startValue = 0;
    const endValue = value;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easeOutCubic;
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  const formatValue = (val) => {
    if (val % 1 !== 0) {
      return val.toFixed(1);
    }
    return Math.floor(val).toString();
  };

  return (
    <div className="counter-display" style={{ color }}>
      {formatValue(displayValue)}{suffix}
    </div>
  );
};

export default ImpactCreatedSection;
