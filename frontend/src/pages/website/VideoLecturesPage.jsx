import React from 'react';
import './VideoLecturesPage.css';

const VideoLecturesPage = () => {
  return (
    <div className="video-lectures-page">
      <div className="page-hero">
        <div className="container">
          <h1>Video Lectures</h1>
          <p>Learn from our expert instructors</p>
        </div>
      </div>
      
      <div className="page-content">
        <div className="container">
          <div className="content-card">
            <h2>Coming Soon</h2>
            <p>Our video lectures are currently under development. Please check back soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoLecturesPage;
