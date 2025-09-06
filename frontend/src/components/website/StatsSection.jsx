import React from 'react';
import './StatsSection.css';

const StatsSection = () => {
  const stats = [
    {
      number: '500+',
      label: 'Students Placed',
      icon: 'fas fa-user-graduate',
      color: 'primary'
    },
    {
      number: '50+',
      label: 'Partner Companies',
      icon: 'fas fa-building',
      color: 'secondary'
    },
    {
      number: '95%',
      label: 'Success Rate',
      icon: 'fas fa-chart-line',
      color: 'success'
    },
    {
      number: '4.9',
      label: 'Average Rating',
      icon: 'fas fa-star',
      color: 'warning'
    }
  ];

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card stat-card--${stat.color}`}>
              <div className="stat-card__icon">
                <i className={stat.icon}></i>
              </div>
              <div className="stat-card__content">
                <div className="stat-card__number">{stat.number}</div>
                <div className="stat-card__label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
