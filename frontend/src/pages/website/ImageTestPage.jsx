import React, { useState, useEffect } from 'react';
import { getImageUrl, getBlogImageUrl, getGalleryImageUrl, getTestimonialImageUrl } from '../../utils/imageUtils';
import blogService from '../../services/blogService';
import galleryService from '../../services/galleryService';
import testimonialService from '../../services/testimonialService';

const ImageTestPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch blogs
      const blogResponse = await blogService.getBlogs({ limit: 5 });
      setBlogs(blogResponse.data || []);
      
      // Fetch gallery items
      const galleryResponse = await galleryService.getGalleryItems({ limit: 5 });
      setGalleryItems(galleryResponse.data || []);
      
      // Fetch testimonials
      const testimonialResponse = await testimonialService.getTestimonials({ limit: 5 });
      setTestimonials(testimonialResponse.data || []);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/init-all-data');
      const result = await response.json();
      console.log('Data initialization result:', result);
      
      if (result.success) {
        alert('Data initialized successfully! Refreshing page...');
        window.location.reload();
      } else {
        alert('Error initializing data: ' + result.message);
      }
    } catch (error) {
      console.error('Error initializing data:', error);
      alert('Error initializing data: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Image Test Page</h1>
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Image Test Page</h1>
      <p>This page tests image display across all components.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={initializeData}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Initialize Sample Data & Images
        </button>
      </div>

      {/* Blog Images Test */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Blog Images Test</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {blogs.map(blog => (
            <div key={blog.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
              <h3>{blog.title}</h3>
              <img 
                src={getBlogImageUrl(blog.featured_image)} 
                alt={blog.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = '/images/blog-placeholder.jpg';
                }}
              />
              <p>Featured Image URL: {getBlogImageUrl(blog.featured_image)}</p>
              <p>Original Image Data: {JSON.stringify(blog.featured_image)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Images Test */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Gallery Images Test</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {galleryItems.map(item => (
            <div key={item.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
              <h3>{item.title}</h3>
              <img 
                src={getGalleryImageUrl(item.images)} 
                alt={item.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = '/images/gallery-placeholder.jpg';
                }}
              />
              <p>Gallery Image URL: {getGalleryImageUrl(item.images)}</p>
              <p>Original Images Data: {JSON.stringify(item.images)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial Images Test */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Testimonial Images Test</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {testimonials.map(testimonial => (
            <div key={testimonial.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
              <h3>{testimonial.client_name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                {testimonial.client_image ? (
                  <img 
                    src={getTestimonialImageUrl(testimonial.client_image)}
                    alt={testimonial.client_name}
                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginRight: '10px' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%', 
                    backgroundColor: '#ddd', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginRight: '10px'
                  }}>
                    {testimonial.client_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                <div>
                  <p><strong>{testimonial.client_designation}</strong></p>
                  <p>{testimonial.client_company}</p>
                </div>
              </div>
              <p>Client Image URL: {getTestimonialImageUrl(testimonial.client_image)}</p>
              <p>Original Image Data: {testimonial.client_image}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Direct Image URL Tests */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Direct Image URL Tests</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div>
            <h3>Blog Images</h3>
            <img 
              src="http://localhost:5000/uploads/blogs/blog-1757424208625-743240812.png" 
              alt="Blog Image 1"
              style={{ width: '100%', height: '150px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = '/images/blog-placeholder.jpg';
              }}
            />
            <p>Direct URL: /uploads/blogs/blog-1757424208625-743240812.png</p>
          </div>
          
          <div>
            <h3>Gallery Images</h3>
            <img 
              src="http://localhost:5000/uploads/gallery/gallery-1757162175645-370243270.png" 
              alt="Gallery Image 1"
              style={{ width: '100%', height: '150px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = '/images/gallery-placeholder.jpg';
              }}
            />
            <p>Direct URL: /uploads/gallery/gallery-1757162175645-370243270.png</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ImageTestPage;
