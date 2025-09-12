import React, { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';
import SEOForm from '../../components/admin/SEOForm';
import blogService from '../../services/blogService';
import { getBlogImageUrl } from '../../utils/imageUtils';
import { useNotification } from '../../context/NotificationContext';
import './BlogManagement.css';

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [seoData, setSeoData] = useState({});
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, searchTerm, filterStatus]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        status: filterStatus !== 'all' ? filterStatus : undefined
      };
      
      const response = await blogService.getBlogs(params);
      setBlogs(response.data || []);
      setTotalPages(response.pages || 1);
    } catch (err) {
      setError('Failed to load blogs');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = () => {
    setEditingBlog(null);
    setShowModal(true);
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setShowModal(true);
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        if (!blogId) {
          throw new Error('Blog ID is missing');
        }
        await blogService.deleteBlog(blogId);
        showSuccess('Blog post deleted successfully!');
        fetchBlogs();
      } catch (err) {
        console.error('Error deleting blog:', err);
        showError('Failed to delete blog post: ' + err.message);
      }
    }
  };

  const handleSaveBlog = async (blogData) => {
    try {
      if (editingBlog) {
        const blogId = editingBlog.id || editingBlog._id;
        if (!blogId) {
          throw new Error('Blog ID is missing');
        }
        await blogService.updateBlog(blogId, blogData);
        showSuccess('Blog post updated successfully!');
      } else {
        await blogService.createBlog(blogData);
        showSuccess('Blog post created successfully!');
      }
      setShowModal(false);
      setEditingBlog(null);
      fetchBlogs();
    } catch (err) {
      console.error('Error saving blog:', err);
      showError('Failed to save blog post: ' + err.message);
    }
  };

  const handleStatusChange = async (blogId, newStatus) => {
    try {
      if (!blogId) {
        throw new Error('Blog ID is missing');
      }
      await blogService.updateBlog(blogId, { status: newStatus });
      showSuccess('Blog status updated successfully!');
      fetchBlogs();
    } catch (err) {
      console.error('Error updating blog status:', err);
      showError('Failed to update blog status: ' + err.message);
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (blog) => {
        const imageUrl = getBlogImageUrl(blog.featured_image);
        return (
          <div className="blog-title-cell">
            <img 
              src={imageUrl} 
              alt={blog.title}
              className="blog-thumbnail"
              onError={(e) => {
                e.target.src = '/images/blog-placeholder.jpg';
              }}
            />
            <div className="blog-title-content">
              <h4>{blog.title}</h4>
              <p>{blog.excerpt}</p>
            </div>
          </div>
        );
      }
    },
    {
      key: 'category',
      label: 'Category',
      render: (blog) => {
        const category = blog.category || '';
        return (
          <span className={`category-badge category-${category}`}>
            {category ? category.replace('-', ' ').toUpperCase() : 'N/A'}
          </span>
        );
      }
    },
    {
      key: 'author',
      label: 'Author',
      render: (blog) => (
        <div className="author-cell">
          <img 
            src={blog.author?.avatar || '/images/avatars/default-avatar.svg'} 
            alt={blog.author?.name}
            className="author-avatar"
            onError={(e) => {
              e.target.src = '/images/avatars/default-avatar.svg';
            }}
          />
          <span>{blog.author?.name}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (blog) => (
        <select 
          value={blog.status}
          onChange={(e) => handleStatusChange(blog.id || blog._id, e.target.value)}
          className={`status-select status-${blog.status}`}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      )
    },
    {
      key: 'views',
      label: 'Views',
      render: (blog) => (
        <div className="stats-cell">
          <span className="stat-item">
            <i className="fas fa-eye"></i>
            {blog.views}
          </span>
          <span className="stat-item">
            <i className="fas fa-heart"></i>
            {blog.likes}
          </span>
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (blog) => {
        try {
          return new Date(blog.created_at || blog.createdAt).toLocaleDateString();
        } catch (e) {
          return 'Invalid Date';
        }
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (blog) => (
        <div className="action-buttons">
          <button 
            className="btn btn-sm btn-outline"
            onClick={() => handleEditBlog(blog)}
            title="Edit"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button 
            className="btn btn-sm btn-danger"
            onClick={() => handleDeleteBlog(blog.id || blog._id)}
            title="Delete"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )
    }
  ];

  const blogFormFields = [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      placeholder: 'Enter blog title'
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: false,
      placeholder: 'Auto-generated from title (or enter custom)'
    },
    {
      name: 'excerpt',
      label: 'Excerpt',
      type: 'textarea',
      required: true,
      placeholder: 'Brief description of the blog post',
      rows: 3
    },
    {
      name: 'content',
      label: 'Content',
      type: 'textarea',
      required: true,
      placeholder: 'Write your blog content here',
      rows: 10
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      options: [
        { value: 'technology', label: 'Technology' },
        { value: 'programming', label: 'Programming' },
        { value: 'career', label: 'Career' },
        { value: 'internship', label: 'Internship' },
        { value: 'tutorial', label: 'Tutorial' },
        { value: 'news', label: 'News' },
        { value: 'company-updates', label: 'Company Updates' },
        { value: 'student-success', label: 'Student Success' },
        { value: 'industry-insights', label: 'Industry Insights' }
      ]
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'text',
      placeholder: 'Enter tags separated by commas'
    },
    {
      name: 'featuredImage',
      label: 'Featured Image',
      type: 'file',
      accept: 'image/*'
    },
    {
      name: 'isFeatured',
      label: 'Featured Post',
      type: 'checkbox'
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
        { value: 'archived', label: 'Archived' }
      ]
    },
    {
      name: 'seo',
      label: 'SEO Settings',
      type: 'custom',
      component: ({ value, onChange }) => (
        <SEOForm
          data={value || {}}
          onChange={onChange}
          title={seoData.title}
          description={seoData.description}
          excerpt={seoData.excerpt}
          featuredImage={seoData.featuredImage}
        />
      )
    }
  ];

  if (loading && blogs.length === 0) {
    return (
      <div className="blog-management loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-management">
      <div className="page-header">
        <div className="page-title">
          <h1>Blog Management</h1>
          <p>Manage your blog posts and articles</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleCreateBlog}
        >
          <i className="fas fa-plus"></i>
          Add New Post
        </button>
      </div>

      <div className="page-content">
        <div className="content-card">
          <div className="card-header">
            <div className="filters">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input 
                  type="text"
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="card-body">
            {error ? (
              <div className="error-message">
                <i className="fas fa-exclamation-triangle"></i>
                <p>{error}</p>
                <button onClick={fetchBlogs} className="btn btn-primary">
                  Try Again
                </button>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={blogs}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <FormModal
          title={editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
          fields={blogFormFields}
          initialData={editingBlog}
          onSubmit={handleSaveBlog}
          onClose={() => {
            setShowModal(false);
            setEditingBlog(null);
            setSeoData({});
          }}
          onFormDataChange={(formData) => {
            setSeoData({
              title: formData.title,
              description: formData.content,
              excerpt: formData.excerpt,
              featuredImage: formData.featuredImage
            });
          }}
        />
      )}
    </div>
  );
};

export default BlogManagement;
