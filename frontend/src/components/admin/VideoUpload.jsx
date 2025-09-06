import React, { useState } from 'react';
import videoService from '../../services/videoService';
import './VideoUpload.css';

const VideoUpload = ({ onUploadSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    video_url: '',
    thumbnail_url: '',
    duration: '',
    is_published: false
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    try {
      if (file) {
        // Upload file first
        const uploadFormData = new FormData();
        uploadFormData.append('video', file);
        uploadFormData.append('title', formData.title);
        uploadFormData.append('description', formData.description);
        uploadFormData.append('category', formData.category);
        uploadFormData.append('is_published', formData.is_published);

        const response = await videoService.uploadVideo(uploadFormData);
        onUploadSuccess(response.data);
      } else {
        // Create video with URL
        const response = await videoService.createVideo(formData);
        onUploadSuccess(response.data);
      }
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="video-upload-modal">
      <div className="video-upload-content">
        <div className="upload-header">
          <h2>Upload Video</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Upload Method</label>
            <div className="upload-method">
              <label className="method-option">
                <input
                  type="radio"
                  name="uploadType"
                  value="file"
                  defaultChecked
                />
                <span>Upload File</span>
              </label>
              <label className="method-option">
                <input
                  type="radio"
                  name="uploadType"
                  value="url"
                />
                <span>Video URL</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter video title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter video description"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="programming">Programming</option>
              <option value="web-development">Web Development</option>
              <option value="mobile-development">Mobile Development</option>
              <option value="data-science">Data Science</option>
              <option value="cybersecurity">Cybersecurity</option>
              <option value="cloud-computing">Cloud Computing</option>
              <option value="general">General</option>
            </select>
          </div>

          <div className="form-group file-upload">
            <label htmlFor="videoFile">Video File</label>
            <input
              type="file"
              id="videoFile"
              accept="video/*"
              onChange={handleFileChange}
              className="file-input"
            />
            <div className="file-input-display">
              {file ? (
                <div className="file-selected">
                  <i className="fas fa-video"></i>
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="remove-file"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ) : (
                <div className="file-placeholder">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <span>Choose video file or drag and drop</span>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="video_url">Video URL (if not uploading file)</label>
            <input
              type="url"
              id="video_url"
              name="video_url"
              value={formData.video_url}
              onChange={handleChange}
              placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="thumbnail_url">Thumbnail URL</label>
            <input
              type="url"
              id="thumbnail_url"
              name="thumbnail_url"
              value={formData.thumbnail_url}
              onChange={handleChange}
              placeholder="https://example.com/thumbnail.jpg"
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration (seconds)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Enter duration in seconds"
              min="0"
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_published"
                checked={formData.is_published}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Publish immediately
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <div className="btn-spinner"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <i className="fas fa-upload"></i>
                  Upload Video
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoUpload;
