import React from 'react';
import './PortfolioPage.css';

const PortfolioPage = () => {
  return (
    <div className="portfolio-page">
      <div className="page-hero">
        <div className="container">
          <h1>Portfolio</h1>
          <p>View our work and projects</p>
        </div>
      </div>
      
      <div className="page-content">
        <div className="container">
          <div className="content-card">
            <h2>Coming Soon</h2>
            <p>Our portfolio page is currently under development. Please check back soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
