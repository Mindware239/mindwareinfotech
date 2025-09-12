import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import blogService from '../../services/blogService';
import './BlogDetails.css';

const BlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [shareLinks, setShareLinks] = useState({});

  // Fetch blog details
  const { data: blogData, isLoading, error } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => blogService.getBlogBySlug(slug),
    enabled: !!slug
  });

  const blog = blogData?.data;

  // Fetch recent blogs
  const { data: recentBlogsData } = useQuery({
    queryKey: ['recent-blogs'],
    queryFn: () => blogService.getRecentBlogs(5),
    enabled: !!blog
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: () => blogService.getBlogCategories(),
    enabled: !!blog
  });
  const recentBlogs = recentBlogsData?.data || [];
  const categories = categoriesData?.data || [];

  // Debug logging
  console.log('BlogDetails - slug:', slug);
  console.log('BlogDetails - blogData:', blogData);
  console.log('BlogDetails - blog:', blog);
  console.log('BlogDetails - blog.featured_image:', blog?.featured_image);
  console.log('BlogDetails - isLoading:', isLoading);
  console.log('BlogDetails - error:', error);

  useEffect(() => {
    if (blog) {
      setShareLinks(blogService.shareBlog(blog));
    }
  }, [blog]);

  const handleShare = (platform) => {
    if (shareLinks[platform]) {
      window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="blog-details-container">
        <div className="container">
          <div className="loading">Loading blog post...</div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="blog-details-container">
        <div className="container">
          <div className="error-message">
            <h2>Blog Post Not Found</h2>
            <p>The blog post you're looking for doesn't exist or has been removed.</p>
            <button onClick={() => navigate('/blog')} className="btn-primary">
              Back to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-details-container">
      <div className="container">
        <div className="blog-details-layout">
          {/* Main Content */}
          <article className="blog-main-content">
            {/* Breadcrumb */}
            <nav className="breadcrumb">
              <a href="/">Home</a>
              <span>/</span>
              <a href="/blog">Blog</a>
              <span>/</span>
              <span>{blog.category}</span>
              <span>/</span>
              <span>{blog.title}</span>
            </nav>

            {/* Blog Header */}
            <header className="blog-header">
              <div className="blog-meta">
                <span className="blog-category">{blog.category}</span>
                <span className="blog-date">{formatDate(blog.created_at)}</span>
                <span className="blog-views">{blog.views} views</span>
              </div>
              
              <h1 className="blog-title">{blog.title}</h1>
              
              {blog.excerpt && (
                <p className="blog-excerpt">{blog.excerpt}</p>
              )}
            </header>

            {/* Featured Image */}
            {(blog.featured_image && (typeof blog.featured_image === 'string' || typeof blog.featured_image === 'object')) && (
              <div className="blog-featured-image">
                <img 
                  src={(() => {
                    // If it's an empty object, use placeholder
                    if (typeof blog.featured_image === 'object' && Object.keys(blog.featured_image).length === 0) {
                      return '/images/blog-placeholder.jpg';
                    }
                    
                    // If it's a string, try to parse as JSON
                    if (typeof blog.featured_image === 'string') {
                      try {
                        const imageData = JSON.parse(blog.featured_image);
                        if (imageData.url) {
                          const filename = imageData.url.split('/').pop();
                          return `http://localhost:5000/uploads/blogs/${filename}`;
                        }
                      } catch (e) {
                        // If not JSON, treat as filename
                        return `http://localhost:5000/uploads/blogs/${blog.featured_image}`;
                      }
                    }
                    
                    // If it's an object with url property
                    if (blog.featured_image.url) {
                      const filename = blog.featured_image.url.split('/').pop();
                      return `http://localhost:5000/uploads/blogs/${filename}`;
                    }
                    
                    return '/images/blog-placeholder.jpg';
                  })()} 
                  alt={blog.title}
                  onError={(e) => {
                    e.target.src = '/images/blog-placeholder.jpg';
                  }}
                />
              </div>
            )}

            {/* Blog Content */}
            <div className="blog-content">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>

            {/* Blog Tags */}
            {blog.tags && Array.isArray(blog.tags) && blog.tags.length > 0 && (
              <div className="blog-tags">
                <h4>Tags:</h4>
                <div className="tags-list">
                  {blog.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Sharing */}
            <div className="blog-sharing">
              <h4>Share this post:</h4>
              <div className="social-share-buttons">
                <button 
                  onClick={() => handleShare('facebook')}
                  className="share-btn facebook"
                  title="Share on Facebook"
                >
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button 
                  onClick={() => handleShare('twitter')}
                  className="share-btn twitter"
                  title="Share on Twitter"
                >
                  <i className="fab fa-twitter"></i>
                </button>
                <button 
                  onClick={() => handleShare('linkedin')}
                  className="share-btn linkedin"
                  title="Share on LinkedIn"
                >
                  <i className="fab fa-linkedin-in"></i>
                </button>
                <button 
                  onClick={() => handleShare('whatsapp')}
                  className="share-btn whatsapp"
                  title="Share on WhatsApp"
                >
                  <i className="fab fa-whatsapp"></i>
                </button>
                <button 
                  onClick={() => handleShare('telegram')}
                  className="share-btn telegram"
                  title="Share on Telegram"
                >
                  <i className="fab fa-telegram-plane"></i>
                </button>
              </div>
            </div>

            {/* Like Button */}
            <div className="blog-actions">
              <button className="like-btn">
                <i className="far fa-heart"></i>
                <span>{blog.likes || 0} Likes</span>
              </button>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="blog-sidebar">
            {/* Recent Posts */}
            <div className="sidebar-widget">
              <h3>Recent Posts</h3>
              <div className="recent-posts">
                {recentBlogs.map((recentBlog) => (
                  <div key={recentBlog.id} className="recent-post-item">
                    {(recentBlog.featured_image && (typeof recentBlog.featured_image === 'string' || typeof recentBlog.featured_image === 'object')) && (
                      <div className="recent-post-image">
                        <img 
                          src={(() => {
                            // If it's an empty object, use placeholder
                            if (typeof recentBlog.featured_image === 'object' && Object.keys(recentBlog.featured_image).length === 0) {
                              return '/images/blog-placeholder.jpg';
                            }
                            
                            // If it's a string, try to parse as JSON
                            if (typeof recentBlog.featured_image === 'string') {
                              try {
                                const imageData = JSON.parse(recentBlog.featured_image);
                                if (imageData.url) {
                                  const filename = imageData.url.split('/').pop();
                                  return `http://localhost:5000/uploads/blogs/${filename}`;
                                }
                              } catch (e) {
                                // If not JSON, treat as filename
                                return `http://localhost:5000/uploads/blogs/${recentBlog.featured_image}`;
                              }
                            }
                            
                            // If it's an object with url property
                            if (recentBlog.featured_image.url) {
                              const filename = recentBlog.featured_image.url.split('/').pop();
                              return `http://localhost:5000/uploads/blogs/${filename}`;
                            }
                            
                            return '/images/blog-placeholder.jpg';
                          })()} 
                          alt={recentBlog.title}
                          onError={(e) => {
                            e.target.src = '/images/blog-placeholder.jpg';
                          }}
                        />
                      </div>
                    )}
                    <div className="recent-post-content">
                      <h4>
                        <a href={`/blog/${recentBlog.slug}`}>
                          {recentBlog.title}
                        </a>
                      </h4>
                      <span className="recent-post-date">
                        {formatDate(recentBlog.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="sidebar-widget">
              <h3>Categories</h3>
              <div className="categories-list">
                {categories.map((category, index) => (
                  <a 
                    key={index} 
                    href={`/blog?category=${encodeURIComponent(category)}`}
                    className="category-link"
                  >
                    {category}
                  </a>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="sidebar-widget">
              <h3>Search Blog</h3>
              <form className="blog-search-form">
                <input 
                  type="text" 
                  placeholder="Search posts..."
                  className="search-input"
                />
                <button type="submit" className="search-btn">
                  <i className="fas fa-search"></i>
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
