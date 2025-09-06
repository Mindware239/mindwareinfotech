import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import videoService from '../../services/videoService';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';
import './VideoLectureManagement.css';

const VideoLectureManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const queryClient = useQueryClient();

  // Fetch videos
  const { data: videosData, isLoading, error } = useQuery({
    queryKey: ['videos', currentPage, pageSize, searchTerm, categoryFilter, statusFilter],
    queryFn: () => videoService.getVideos({
      page: currentPage,
      limit: pageSize,
      search: searchTerm,
      category: categoryFilter,
      status: statusFilter
    })
  });

  // Create video mutation
  const createVideoMutation = useMutation({
    mutationFn: videoService.createVideo,
    onSuccess: () => {
      queryClient.invalidateQueries(['videos']);
      setShowModal(false);
      setEditingVideo(null);
    }
  });

  // Update video mutation
  const updateVideoMutation = useMutation({
    mutationFn: ({ id, data }) => videoService.updateVideo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['videos']);
      setShowModal(false);
      setEditingVideo(null);
    }
  });

  // Delete video mutation
  const deleteVideoMutation = useMutation({
    mutationFn: videoService.deleteVideo,
    onSuccess: () => {
      queryClient.invalidateQueries(['videos']);
    }
  });

  const handleCreateVideo = () => {
    setEditingVideo(null);
    setShowModal(true);
  };

  const handleEditVideo = (video) => {
    setEditingVideo(video);
    setShowModal(true);
  };

  const handleDeleteVideo = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      await deleteVideoMutation.mutateAsync(id);
    }
  };

  const handleSubmit = async (formData) => {
    if (editingVideo) {
      await updateVideoMutation.mutateAsync({
        id: editingVideo.id,
        data: formData
      });
    } else {
      await createVideoMutation.mutateAsync(formData);
    }
  };

  const columns = [
    {
      key: 'thumbnail',
      title: 'Thumbnail',
      render: (video) => (
        <div className="video-thumbnail">
          {video.thumbnail_url ? (
            <img src={video.thumbnail_url} alt={video.title} />
          ) : (
            <div className="no-thumbnail">
              <i className="fas fa-video"></i>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'title',
      title: 'Title',
      render: (video) => (
        <div className="video-title">
          <h4>{video.title}</h4>
          <p className="video-description">{video.description}</p>
        </div>
      )
    },
    {
      key: 'category',
      title: 'Category',
      render: (video) => (
        <span className={`category-badge category-${video.category}`}>
          {video.category}
        </span>
      )
    },
    {
      key: 'duration',
      title: 'Duration',
      render: (video) => formatDuration(video.duration)
    },
    {
      key: 'is_published',
      title: 'Status',
      render: (video) => (
        <span className={`status-badge ${video.is_published ? 'published' : 'draft'}`}>
          {video.is_published ? 'Published' : 'Draft'}
        </span>
      )
    },
    {
      key: 'created_at',
      title: 'Created',
      render: (video) => new Date(video.created_at).toLocaleDateString()
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (video) => (
        <div className="action-buttons">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => handleEditVideo(video)}
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDeleteVideo(video.id)}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )
    }
  ];

  const formatDuration = (seconds) => {
    // Handle null, undefined, or non-numeric values
    if (!seconds || isNaN(seconds)) {
      return '0:00';
    }
    
    const numSeconds = parseInt(seconds, 10);
    const hours = Math.floor(numSeconds / 3600);
    const minutes = Math.floor((numSeconds % 3600) / 60);
    const secs = numSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const videoFormFields = [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      placeholder: 'Enter video title'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: false,
      placeholder: 'Enter video description'
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      options: [
        { value: 'programming', label: 'Programming' },
        { value: 'web-development', label: 'Web Development' },
        { value: 'mobile-development', label: 'Mobile Development' },
        { value: 'data-science', label: 'Data Science' },
        { value: 'cybersecurity', label: 'Cybersecurity' },
        { value: 'cloud-computing', label: 'Cloud Computing' },
        { value: 'general', label: 'General' }
      ]
    },
    {
      name: 'video_url',
      label: 'Video URL',
      type: 'url',
      required: true,
      placeholder: 'Enter video URL (YouTube, Vimeo, etc.)'
    },
    {
      name: 'thumbnail_url',
      label: 'Thumbnail URL',
      type: 'url',
      required: false,
      placeholder: 'Enter thumbnail image URL'
    },
    {
      name: 'duration',
      label: 'Duration (seconds)',
      type: 'number',
      required: false,
      placeholder: 'Enter duration in seconds'
    },
    {
      name: 'is_published',
      label: 'Published',
      type: 'checkbox',
      required: false
    }
  ];

  if (isLoading) {
    return (
      <div className="video-lecture-management-page">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading videos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="video-lecture-management-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Video Lecture Management</h1>
          <p>Manage video lectures and course content</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleCreateVideo}
        >
          <i className="fas fa-plus"></i>
          Add New Video
        </button>
      </div>

      <div className="page-content">
        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="filter-group">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-control"
            >
              <option value="">All Categories</option>
              <option value="programming">Programming</option>
              <option value="web-development">Web Development</option>
              <option value="mobile-development">Mobile Development</option>
              <option value="data-science">Data Science</option>
              <option value="cybersecurity">Cybersecurity</option>
              <option value="cloud-computing">Cloud Computing</option>
              <option value="general">General</option>
            </select>
          </div>
          <div className="filter-group">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-control"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Videos Table */}
        <div className="content-card">
          <DataTable
            data={videosData?.data || []}
            columns={columns}
            loading={isLoading}
            error={error}
            pagination={{
              currentPage,
              totalPages: videosData?.pages || 0,
              totalItems: videosData?.count || 0,
              pageSize,
              onPageChange: setCurrentPage,
              onPageSizeChange: setPageSize
            }}
          />
        </div>
      </div>

      {/* Video Form Modal */}
      {showModal && (
        <FormModal
          title={editingVideo ? 'Edit Video' : 'Add New Video'}
          fields={videoFormFields}
          initialData={editingVideo}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowModal(false);
            setEditingVideo(null);
          }}
          loading={createVideoMutation.isPending || updateVideoMutation.isPending}
        />
      )}
    </div>
  );
};

export default VideoLectureManagement;
