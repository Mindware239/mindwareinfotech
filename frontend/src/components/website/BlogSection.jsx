import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import blogService from '../../services/blogService';
import { getBlogImageUrl } from '../../utils/imageUtils';
import './BlogSection.css';

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeaturedBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await blogService.getFeaturedBlogs(3);
      setBlogs(response.data || []);
    } catch (err) {
      setError('Failed to load blogs');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedBlogs();
  }, [fetchFeaturedBlogs]);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const getCategoryColor = useCallback((category) => {
    const colors = {
      'technology': '#667eea',
      'programming': '#f093fb',
      'career': '#4facfe',
      'internship': '#43e97b',
      'tutorial': '#fa709a',
      'news': '#ff9a9e',
      'company-updates': '#a8edea',
      'student-success': '#d299c2',
      'industry-insights': '#fad0c4'
    };
    return colors[category] || '#667eea';
  }, []);

  // Memoize blog cards to prevent unnecessary re-renders
  const memoizedBlogs = useMemo(() => {
    return blogs.map((blog) => (
      <article key={blog.id || blog._id} className="blog-card">
        <div className="blog-card__image">
          <img 
            src={getBlogImageUrl(blog.featured_image)} 
            alt={blog.title}
            onError={(e) => {
              e.target.src = '/images/blog-placeholder.jpg';
            }}
          />
          <div className="blog-card__category">
            <span 
              className="category-tag"
              style={{ backgroundColor: getCategoryColor(blog.category) }}
            >
              {blog.category?.replace('-', ' ').toUpperCase()}
            </span>
          </div>
          {blog.is_featured && (
            <div className="blog-card__badge">
              <i className="fas fa-star"></i>
              Featured
            </div>
          )}
        </div>

        <div className="blog-card__content">
          <div className="blog-card__meta">
            <div className="blog-card__author">
              <img 
                src={blog.author?.avatar || '/images/avatars/default-avatar.svg'} 
                alt={blog.author?.name}
                className="author-avatar"
              />
              <span className="author-name">{blog.author?.name}</span>
            </div>
            <div className="blog-card__date">
              <i className="fas fa-calendar-alt"></i>
              {formatDate(blog.published_at || blog.created_at)}
            </div>
          </div>

          <h3 className="blog-card__title">
            <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
          </h3>
          
          <p className="blog-card__excerpt">{blog.excerpt}</p>

          <div className="blog-card__stats">
            <div className="blog-stat">
              <i className="fas fa-eye"></i>
              <span>{blog.views || 0} views</span>
            </div>
            <div className="blog-stat">
              <i className="fas fa-heart"></i>
              <span>{blog.likes || 0} likes</span>
            </div>
            <div className="blog-stat">
              <i className="fas fa-clock"></i>
              <span>{blog.reading_time || 0} min read</span>
            </div>
          </div>

          <div className="blog-card__tags">
            {blog.tags && Array.isArray(blog.tags) && blog.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="blog-tag">#{tag}</span>
            ))}
          </div>

          <Link to={`/blog/${blog.slug}`} className="blog-card__link">
            Read More
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </article>
    ));
  }, [blogs, getCategoryColor, formatDate]);

  if (loading) {
    return (
      <section className="blog-section">
        <div className="container">
          <div className="section-header">
            <h2>Latest Blog Posts</h2>
            <p>Stay updated with industry insights and career tips</p>
          </div>
          <div className="blogs-grid">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="blog-card loading">
                <div className="skeleton skeleton-image"></div>
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-meta"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="blog-section">
        <div className="container">
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{error}</p>
            <button onClick={fetchFeaturedBlogs} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="blog-section">
      <div className="container">
        <div className="section-header">
          <h2>Latest Blog Posts</h2>
          <p>Stay updated with industry insights and career tips</p>
        </div>

        <div className="blogs-grid">
          {memoizedBlogs}
        </div>

        <div className="blog-cta">
          <Link to="/blog" className="btn btn-primary btn-lg">
            View All Posts
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
