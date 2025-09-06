import React from 'react';
import './StatsCard.css';

const StatsCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = 'primary', 
  format = 'number',
  loading = false 
}) => {
  const formatValue = (val, formatType) => {
    if (formatType === 'currency') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(val);
    }
    
    if (formatType === 'number') {
      return new Intl.NumberFormat('en-IN').format(val);
    }
    
    if (formatType === 'percentage') {
      return `${val}%`;
    }
    
    return val;
  };

  const getChangeColor = (changeValue) => {
    if (changeValue > 0) return 'positive';
    if (changeValue < 0) return 'negative';
    return 'neutral';
  };

  const getChangeIcon = (changeValue) => {
    if (changeValue > 0) return 'fas fa-arrow-up';
    if (changeValue < 0) return 'fas fa-arrow-down';
    return 'fas fa-minus';
  };

  if (loading) {
    return (
      <div className={`stats-card stats-card--${color} loading`}>
        <div className="stats-card__icon">
          <div className="skeleton-icon"></div>
        </div>
        <div className="stats-card__content">
          <div className="skeleton-title"></div>
          <div className="skeleton-value"></div>
          <div className="skeleton-change"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`stats-card stats-card--${color}`}>
      <div className="stats-card__icon">
        <i className={icon}></i>
      </div>
      
      <div className="stats-card__content">
        <h3 className="stats-card__title">{title}</h3>
        <div className="stats-card__value">
          {formatValue(value, format)}
        </div>
        <div className={`stats-card__change stats-card__change--${getChangeColor(change)}`}>
          <i className={getChangeIcon(change)}></i>
          <span>{Math.abs(change)}%</span>
          <span className="change-label">vs last month</span>
        </div>
      </div>
      
      <div className="stats-card__trend">
        <div className="trend-line">
          {[...Array(12)].map((_, index) => (
            <div 
              key={index} 
              className="trend-dot"
              style={{
                height: `${Math.random() * 40 + 20}%`,
                animationDelay: `${index * 0.1}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
