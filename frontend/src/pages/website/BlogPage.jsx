import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import blogService from '../../services/blogService';
import { getBlogImageUrl } from '../../utils/imageUtils';
import './BlogPage.css';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, searchTerm, filterCategory]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 9,
        search: searchTerm,
        category: filterCategory !== 'all' ? filterCategory : undefined,
        status: 'published'
      };
      
      const response = await blogService.getBlogs(params);
      setBlogs(response.data || []);
      setTotalPages(response.pages || 1);
    } catch (err) {
      setError('Failed to load blog posts');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'technology', label: 'Technology' },
    { value: 'programming', label: 'Programming' },
    { value: 'career', label: 'Career' },
    { value: 'internship', label: 'Internship' },
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'news', label: 'News' },
    { value: 'company-updates', label: 'Company Updates' },
    { value: 'student-success', label: 'Student Success' },
    { value: 'industry-insights', label: 'Industry Insights' }
  ];

  if (loading && blogs.length === 0) {
    return (
      <div className="blog-page loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page">
      <div className="page-hero">
        <div className="container">
          <h1>Our Blog</h1>
          <p>Insights, tutorials, and updates from the world of technology</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <div className="filters-section">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input 
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
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

          {error ? (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{error}</p>
              <button onClick={fetchBlogs} className="btn btn-primary">
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="blogs-grid">
                {blogs.map(blog => (
                  <article key={blog.id} className="blog-card">
                    <div className="blog-image">
                      <img 
                        src={getBlogImageUrl(blog.featured_image)} 
                        alt={blog.title}
                        onError={(e) => {
                          e.target.src = '/images/blog-placeholder.jpg';
                        }}
                      />
                      <div className="blog-category">
                        {blog.category.replace('-', ' ').toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="blog-content">
                      <div className="blog-meta">
                        <span className="author">
                          <i className="fas fa-user"></i>
                          {blog.author?.name || 'Admin'}
                        </span>
                        <span className="date">
                          <i className="fas fa-calendar"></i>
                          {new Date(blog.created_at).toLocaleDateString()}
                        </span>
                        <span className="reading-time">
                          <i className="fas fa-clock"></i>
                          {blog.reading_time} min read
                        </span>
                      </div>
                      
                      <h2 className="blog-title">
                        <Link to={`/blog/${blog.slug}`}>
                          {blog.title}
                        </Link>
                      </h2>
                      
                      <p className="blog-excerpt">{blog.excerpt}</p>
                      
                      <div className="blog-stats">
                        <span className="views">
                          <i className="fas fa-eye"></i>
                          {blog.views} views
                        </span>
                        <span className="likes">
                          <i className="fas fa-heart"></i>
                          {blog.likes} likes
                        </span>
                      </div>
                      
                      <Link to={`/blog/${blog.slug}`} className="read-more">
                        Read More <i className="fas fa-arrow-right"></i>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    className="pagination-btn"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <i className="fas fa-chevron-left"></i>
                    Previous
                  </button>
                  
                  <div className="pagination-numbers">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
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
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </>
          )}

          {blogs.length === 0 && !loading && (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <h3>No blog posts found</h3>
              <p>Try adjusting your search criteria or check back later for new content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
