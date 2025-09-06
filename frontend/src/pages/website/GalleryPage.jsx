import React from 'react';
import './GalleryPage.css';

const GalleryPage = () => {
  return (
    <div className="gallery-page">
      <div className="page-hero">
        <div className="container">
          <h1>Gallery</h1>
          <p>View our photos and events</p>
        </div>
      </div>
      
      <div className="page-content">
        <div className="container">
          <div className="content-card">
            <h2>Coming Soon</h2>
            <p>Our gallery is currently under development. Please check back soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
