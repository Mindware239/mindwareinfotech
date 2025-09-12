import React, { useState, useEffect } from 'react';
import videoService from '../../services/videoService';
import courseService from '../../services/courseService';
import { getImageUrl } from '../../utils/imageUtils';
import { useNotification } from '../../context/NotificationContext';
import './VideoManagement.css';

const VideoManagement = () => {
  const [videos, setVideos] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const { showSuccess, showError } = useNotification();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    video_file: null,
    thumbnail: null,
    duration: 0,
    course_id: '',
    chapter: '',
    order: 1,
    is_free: false,
    is_preview: false,
    access_level: 'free',
    price: 0,
    currency: 'INR',
    preview_duration: 30,
    status: 'draft',
    tags: [],
    resources: [],
    transcript: '',
    subtitles: []
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchVideos();
    fetchCourses();
  }, [currentPage, searchTerm, filterCourse]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        course_id: filterCourse
      };
      const response = await videoService.getVideos(params);
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAccessLevelChange = (e) => {
    const accessLevel = e.target.value;
    setFormData(prev => ({
      ...prev,
      access_level: accessLevel,
      is_free: accessLevel === 'free',
      is_preview: accessLevel === 'preview',
      price: accessLevel === 'free' ? 0 : prev.price
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0] || null
    }));
  };

  const handleVideoUpload = async (file) => {
    try {
      setUploading(true);
      setUploadProgress(0);
      
      const formData = new FormData();
      formData.append('video', file);
      
      const response = await videoService.uploadVideo(formData, (progress) => {
        setUploadProgress(progress);
      });
      
      return response.data.url;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleThumbnailUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('thumbnail', file);
      
      const response = await videoService.uploadThumbnail(formData);
      return response.data.url;
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      let videoUrl = formData.video_url;
      let thumbnailUrl = null;
      
      // Upload video file if provided
      if (formData.video_file) {
        videoUrl = await handleVideoUpload(formData.video_file);
      }
      
      // Upload thumbnail if provided
      if (formData.thumbnail) {
        thumbnailUrl = await handleThumbnailUpload(formData.thumbnail);
      }
      
      const videoData = {
        ...formData,
        video_url: videoUrl,
        thumbnail: thumbnailUrl ? { url: thumbnailUrl } : formData.thumbnail,
        course_id: parseInt(formData.course_id),
        order: parseInt(formData.order),
        duration: parseInt(formData.duration)
      };
      
      if (editingVideo) {
        await videoService.updateVideo(editingVideo.id, videoData);
        showSuccess('Video updated successfully!');
      } else {
        await videoService.createVideo(videoData);
        showSuccess('Video created successfully!');
      }
      
      setShowForm(false);
      setEditingVideo(null);
      resetForm();
      fetchVideos();
    } catch (error) {
      console.error('Error saving video:', error);
      showError('Failed to save video: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description || '',
      video_url: video.video_url,
      video_file: null,
      thumbnail: video.thumbnail || null,
      duration: video.duration || 0,
      course_id: video.course_id?.toString() || '',
      chapter: video.chapter || '',
      order: video.order || 1,
      is_free: video.is_free || false,
      is_preview: video.is_preview || false,
      access_level: video.access_level || 'free',
      price: video.price || 0,
      currency: video.currency || 'INR',
      preview_duration: video.preview_duration || 30,
      status: video.status || 'draft',
      tags: video.tags || [],
      resources: video.resources || [],
      transcript: video.transcript || '',
      subtitles: video.subtitles || []
    });
    setShowForm(true);
  };

  const handleDelete = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await videoService.deleteVideo(videoId);
        showSuccess('Video deleted successfully!');
        fetchVideos();
      } catch (error) {
        console.error('Error deleting video:', error);
        showError('Failed to delete video: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      video_url: '',
      video_file: null,
      thumbnail: null,
      duration: 0,
      course_id: '',
      chapter: '',
      order: 1,
      is_free: false,
      is_preview: false,
      access_level: 'free',
      price: 0,
      currency: 'INR',
      preview_duration: 30,
      status: 'draft',
      tags: [],
      resources: [],
      transcript: '',
      subtitles: []
    });
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="video-management">
      <div className="video-header">
        <h2>Video Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setEditingVideo(null);
            resetForm();
            setShowForm(true);
          }}
        >
          Add New Video
        </button>
      </div>

      {/* Search and Filter */}
      <div className="video-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="filter-box">
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="form-control"
          >
            <option value="">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Video Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content video-form-modal">
            <div className="modal-header">
              <h3>{editingVideo ? 'Edit Video' : 'Add New Video'}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="video-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Course *</label>
                  <select
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleInputChange}
                    required
                    className="form-control"
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Chapter *</label>
                  <input
                    type="text"
                    name="chapter"
                    value={formData.chapter}
                    onChange={handleInputChange}
                    required
                    className="form-control"
                    placeholder="e.g., Introduction to React"
                  />
                </div>
                <div className="form-group">
                  <label>Order *</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="form-control"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Video URL</label>
                  <input
                    type="url"
                    name="video_url"
                    value={formData.video_url}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <div className="form-group">
                  <label>Duration (seconds)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="0"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Video File</label>
                  <input
                    type="file"
                    name="video_file"
                    onChange={handleFileChange}
                    accept="video/*"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Thumbnail</label>
                  <input
                    type="file"
                    name="thumbnail"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Access Level *</label>
                  <select
                    name="access_level"
                    value={formData.access_level}
                    onChange={handleAccessLevelChange}
                    className="form-control"
                    required
                  >
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                    <option value="preview">Preview</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {formData.access_level !== 'free' && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Price *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      required
                      className="form-control"
                      placeholder="Enter price"
                    />
                  </div>
                  <div className="form-group">
                    <label>Currency</label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="form-control"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                </div>
              )}

              {formData.access_level === 'preview' && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Preview Duration (seconds)</label>
                    <input
                      type="number"
                      name="preview_duration"
                      value={formData.preview_duration}
                      onChange={handleInputChange}
                      min="10"
                      max="300"
                      className="form-control"
                      placeholder="Preview duration in seconds"
                    />
                  </div>
                  <div className="form-group">
                    <label>Duration Display</label>
                    <div className="duration-display">
                      {formatDuration(formData.duration)}
                    </div>
                  </div>
                </div>
              )}

              {formData.access_level === 'free' && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Duration Display</label>
                    <div className="duration-display">
                      {formatDuration(formData.duration)}
                    </div>
                  </div>
                </div>
              )}

              <div className="form-checkboxes">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_free"
                    checked={formData.is_free}
                    onChange={handleInputChange}
                  />
                  Free Video
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_preview"
                    checked={formData.is_preview}
                    onChange={handleInputChange}
                  />
                  Preview Video
                </label>
              </div>

              {uploading && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span>Uploading... {uploadProgress}%</span>
                </div>
              )}

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editingVideo ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Videos List */}
      <div className="videos-list">
        {loading ? (
          <div className="loading">Loading videos...</div>
        ) : videos.length === 0 ? (
          <div className="no-videos">No videos found</div>
        ) : (
          <div className="videos-grid">
            {videos.map(video => (
              <div key={video.id} className="video-card">
                <div className="video-thumbnail">
                  {video.thumbnail?.url ? (
                    <img 
                      src={getImageUrl(video.thumbnail.url)} 
                      alt={video.title}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="thumbnail-placeholder" style={{ display: video.thumbnail?.url ? 'none' : 'flex' }}>
                    <i className="fas fa-play"></i>
                  </div>
                  <div className="video-duration">
                    {formatDuration(video.duration)}
                  </div>
                  <div className="video-status">
                    <span className={`status-badge ${video.status}`}>
                      {video.status}
                    </span>
                  </div>
                </div>
                
                <div className="video-info">
                  <h4>{video.title}</h4>
                  <p className="video-description">{video.description}</p>
                  
                  <div className="video-meta">
                    <span className="meta-item">
                      <i className="fas fa-book"></i>
                      {video.chapter}
                    </span>
                    <span className="meta-item">
                      <i className="fas fa-sort-numeric-up"></i>
                      Order: {video.order}
                    </span>
                    <span className="meta-item">
                      <i className="fas fa-eye"></i>
                      {video.views} views
                    </span>
                  </div>
                  
                  <div className="video-badges">
                    {video.access_level === 'free' && <span className="badge free">Free</span>}
                    {video.access_level === 'premium' && (
                      <span className="badge premium">
                        Premium - ₹{video.price}
                      </span>
                    )}
                    {video.access_level === 'preview' && (
                      <span className="badge preview">
                        Preview - ₹{video.price}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="video-actions">
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => handleEdit(video)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(video.id)}
                  >
                    Delete
                  </button>
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
            className="btn btn-sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            className="btn btn-sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoManagement;
