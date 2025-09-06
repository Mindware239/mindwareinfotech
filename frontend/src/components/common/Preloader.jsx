import React, { useState, useEffect } from 'react';
import './Preloader.css';

const Preloader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
          }, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="preloader">
      <div className="wave-container">
        <div className="wave wave-1"></div>
        <div className="wave wave-2"></div>
        <div className="wave wave-3"></div>
        <div className="wave wave-4"></div>
      </div>
      
      <div className="bubbles">
        {[...Array(9)].map((_, i) => (
          <div key={i} className={`bubble bubble-${i + 1}`}></div>
        ))}
      </div>
      
      <div className="logo-container">
        <h1 className="company-logo">MINDWARE INDIA</h1>
        <div className="tagline">Redefining Technology with Human Touch</div>
      </div>
      
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
      
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        <div className="progress-text">{Math.round(progress)}%</div>
      </div>
    </div>
  );
};

export default Preloader;
