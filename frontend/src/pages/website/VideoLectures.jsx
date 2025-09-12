import React, { useState, useEffect } from 'react';
import videoService from '../../services/videoService';
import courseService from '../../services/courseService';
import VideoPlayer from '../../components/website/VideoPlayer';
import './VideoLectures.css';

const VideoLectures = () => {
  const [videos, setVideos] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  useEffect(() => {
    fetchVideos();
    fetchCourses();
  }, [currentPage, searchTerm, filterCourse, filterCategory]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
        search: searchTerm,
        course_id: filterCourse,
        status: 'published'
      };
      const response = await videoService.getVideos(params);
      console.log('Fetched videos:', response.data);
      setVideos(response.data);
      setTotalPages(response.pages);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await courseService.getCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleVideoSelect = (video) => {
    console.log('Selected video:', video);
    console.log('Video ID:', video.id);
    console.log('Video title:', video.title);
    setSelectedVideo(video);
  };

  const handleVideoEnd = () => {
    // Handle video end logic
    console.log('Video ended');
  };

  const handleVideoProgress = (progress) => {
    // Handle video progress tracking
    console.log('Video progress:', progress);
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'web-development', label: 'Web Development' },
    { value: 'mobile-development', label: 'Mobile Development' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'ai-ml', label: 'AI & Machine Learning' },
    { value: 'programming', label: 'Programming' },
    { value: 'database', label: 'Database' },
    { value: 'devops', label: 'DevOps' },
    { value: 'cybersecurity', label: 'Cybersecurity' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="video-lectures-page">
      {/* Hero Section */}
      <div className="video-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Video Lectures</h1>
            <p>Learn from our comprehensive collection of video tutorials and lectures</p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="video-content">
          {/* Video Player Section */}
          {selectedVideo ? (
            <div className="video-player-section">
              <h3>Now Playing: {selectedVideo.title}</h3>
              <VideoPlayer
                video={selectedVideo}
                onVideoEnd={handleVideoEnd}
                onProgress={handleVideoProgress}
                autoPlay={true}
                showControls={true}
                className="main-video-player"
              />
            </div>
          ) : (
            <div className="video-player-section" style={{padding: '40px', textAlign: 'center', background: '#f8f9fa', borderRadius: '15px', marginBottom: '40px'}}>
              <h3>Select a video to start watching</h3>
              <p>Click on any video below to begin your learning journey</p>
            </div>
          )}

          {/* Filters and Search */}
          <div className="video-filters">
            <div className="search-section">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <i className="fas fa-search search-icon"></i>
              </div>
            </div>

            <div className="filter-section">
              <div className="filter-group">
                <label>Course</label>
                <select
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Courses</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="filter-select"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="view-controls">
                <button
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <i className="fas fa-th"></i>
                </button>
                <button
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Videos Grid/List */}
          <div className="videos-section">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading videos...</p>
              </div>
            ) : videos.length === 0 ? (
              <div className="no-videos">
                <i className="fas fa-video"></i>
                <h3>No videos found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className={`videos-container ${viewMode}`}>
                {videos.map(video => (
                  <div
                    key={video.id}
                    className={`video-card ${selectedVideo?.id === video.id ? 'selected' : ''}`}
                    onClick={() => handleVideoSelect(video)}
                  >
                    <div className="video-thumbnail">
                      {video.thumbnail?.url ? (
                        <img src={video.thumbnail.url} alt={video.title} />
                      ) : (
                        <div className="thumbnail-placeholder">
                          <i className="fas fa-play"></i>
                        </div>
                      )}
                      <div className="video-duration">
                        {formatDuration(video.duration)}
                      </div>
                      <div className="play-overlay">
                        <i className="fas fa-play"></i>
                      </div>
                      {video.access_level === 'free' && (
                        <div className="free-badge">Free</div>
                      )}
                      {video.access_level === 'premium' && (
                        <div className="premium-badge">₹{video.price}</div>
                      )}
                      {video.access_level === 'preview' && (
                        <div className="preview-badge">Preview - ₹{video.price}</div>
                      )}
                    </div>

                    <div className="video-info">
                      <h4 className="video-title">{video.title}</h4>
                      <p className="video-description">{video.description}</p>
                      
                      <div className="video-meta">
                        {video.chapter && (
                          <span className="meta-item">
                            <i className="fas fa-book"></i>
                            {video.chapter}
                          </span>
                        )}
                        <span className="meta-item">
                          <i className="fas fa-eye"></i>
                          {video.views || 0} views
                        </span>
                        <span className="meta-item">
                          <i className="fas fa-clock"></i>
                          {formatDuration(video.duration)}
                        </span>
                      </div>

                      <div className="video-tags">
                        {(() => {
                          const tags = Array.isArray(video.tags) ? video.tags : 
                                      (typeof video.tags === 'string' ? JSON.parse(video.tags || '[]') : []);
                          return tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="tag">
                              {tag}
                            </span>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i>
                Previous
              </button>
              
              <div className="pagination-numbers">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoLectures;