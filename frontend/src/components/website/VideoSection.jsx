import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import videoService from '../../services/videoService';
import './VideoSection.css';

const VideoSection = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedVideos();
  }, []);

  const fetchFeaturedVideos = async () => {
    try {
      setLoading(true);
      const response = await videoService.getVideos({ featured: true, limit: 3 });
      setVideos(response.data || []);
    } catch (err) {
      setError('Failed to load videos');
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (duration) => {
    // If duration is already a string (like "2:30:00"), return it as is
    if (typeof duration === 'string') {
      return duration;
    }
    
    // If duration is a number (seconds), convert it
    if (typeof duration === 'number') {
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      const secs = duration % 60;
      
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Default fallback
    return '0:00';
  };

  if (loading) {
    return (
      <section className="video-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Video Lectures</h2>
            <p>Learn from industry experts with our comprehensive video courses</p>
          </div>
          <div className="videos-grid">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="video-card loading">
                <div className="skeleton skeleton-thumbnail"></div>
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-button"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="video-section">
        <div className="container">
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{error}</p>
            <button onClick={fetchFeaturedVideos} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="video-section">
      <div className="container">
        <div className="section-header">
          <h2>Featured Video Lectures</h2>
          <p>Learn from industry experts with our comprehensive video courses</p>
        </div>

        <div className="videos-grid">
          {videos.map((video) => (
            <div key={video._id} className="video-card">
              <div className="video-card__thumbnail">
                <img 
                  src={video.thumbnail?.url || '/images/video-placeholder.jpg'} 
                  alt={video.title}
                  onError={(e) => {
                    e.target.src = '/images/video-placeholder.jpg';
                  }}
                />
                <div className="video-card__overlay">
                  <div className="video-card__play-btn">
                    <i className="fas fa-play"></i>
                  </div>
                  <div className="video-card__duration">
                    {formatDuration(video.duration || '0:00')}
                  </div>
                </div>
                {video.isFree && (
                  <div className="video-card__badge video-card__badge--free">
                    Free
                  </div>
                )}
                {video.isPreview && (
                  <div className="video-card__badge video-card__badge--preview">
                    Preview
                  </div>
                )}
              </div>

              <div className="video-card__content">
                <h3 className="video-card__title">{video.title}</h3>
                <p className="video-card__description">{video.description}</p>
                
                <div className="video-card__meta">
                  <div className="video-card__stats">
                    <span className="video-stat">
                      <i className="fas fa-eye"></i>
                      {video.views} views
                    </span>
                    <span className="video-stat">
                      <i className="fas fa-thumbs-up"></i>
                      {video.likes} likes
                    </span>
                  </div>
                  
                  <div className="video-card__tags">
                    {video.tags && Array.isArray(video.tags) && video.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="video-tag">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="video-card__actions">
                  <Link 
                    to={`/video-lectures/${video._id}`} 
                    className="btn btn-primary btn-sm"
                  >
                    Watch Now
                  </Link>
                  {video.resources && video.resources.length > 0 && (
                    <span className="video-resources">
                      <i className="fas fa-download"></i>
                      {video.resources.length} resources
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="video-cta">
          <Link to="/video-lectures" className="btn btn-primary btn-lg">
            Browse All Videos
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
