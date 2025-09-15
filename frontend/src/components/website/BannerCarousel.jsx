import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import bannerService from '../../services/bannerService';
import './BannerCarousel.css';

const BannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Fetch banners from database
  const { data: bannersData, isLoading } = useQuery({
    queryKey: ['banners', 'hero'],
    queryFn: () => bannerService.getBanners({ status: 'active', limit: 10 }),
    select: (data) => data?.banners || data?.data || []
  });

  // Convert database banners to slide format
  const slides = bannersData?.map((banner, index) => ({
    id: banner.banner_id,
    title: banner.title,
    subtitle: banner.subtitle || "Transform your ideas into powerful solutions",
    description: banner.description,
    button1: { 
      text: banner.button_text || "Learn More", 
      link: banner.button_url || "/services", 
      color: index % 3 === 0 ? "red" : index % 3 === 1 ? "purple" : "blue" 
    },
    button2: { 
      text: "Contact Us", 
      link: "/contact", 
      color: index % 3 === 0 ? "orange" : index % 3 === 1 ? "blue" : "green" 
    },
    background: index % 3 === 0 
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : index % 3 === 1 
      ? "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)"
      : "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
    image: banner.image_url ? `http://localhost:5000${banner.image_url}` : "/images/software-development.jpg"
  })) || [];

  // Fallback slides if no banners from database
  const fallbackSlides = [
    {
      id: 1,
      title: "Join Our Growing Team",
      subtitle: "Explore Exciting Career Opportunities",
      description: "Be part of our innovative team and work on cutting-edge projects. We offer competitive packages and growth opportunities.",
      button1: { text: "→ View Jobs", link: "/careers", color: "red" },
      button2: { text: "Apply Now", link: "/apply", color: "orange" },
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      image: "/images/team-collaboration.jpg"
    },
    {
      id: 2,
      title: "Internship Program – Mindware India",
      subtitle: "Kickstart Your Career with Our Internship Program",
      description: "Gain real-world experience in Software Development, Web Design, and IT Solutions while working on live projects.",
      button1: { text: "→ Contact Us", link: "/contact", color: "purple" },
      button2: { text: "Learn More", link: "/internships", color: "blue" },
      background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
      image: "/images/internship-program.jpg"
    },
    {
      id: 3,
      title: "Professional Software Development",
      subtitle: "Transform your ideas into powerful software solutions",
      description: "We specialize in web development, mobile apps, and enterprise software. Let us help you build the future.",
      button1: { text: "Our Services", link: "/services", color: "blue" },
      button2: { text: "View Portfolio", link: "/portfolio", color: "green" },
      background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
      image: "/images/software-development.jpg"
    }
  ];

  const finalSlides = slides.length > 0 ? slides : fallbackSlides;

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || finalSlides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % finalSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, finalSlides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % finalSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + finalSlides.length) % finalSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentSlideData = finalSlides[currentSlide];

  // Show loading state
  if (isLoading) {
    return (
      <section className="banner-carousel">
        <div className="carousel-container">
          <div className="loading-slide">
            <div className="loading-content">
              <h1>Loading...</h1>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="banner-carousel">
      <div className="carousel-container">
        {/* Main Slide */}
        <div 
          className="carousel-slide active"
        >
          <div className="slide-content">
            <div className="slide-text">
              <h1 className="slide-title">{currentSlideData.title}</h1>
              <h2 className="slide-subtitle">{currentSlideData.subtitle}</h2>
              <p className="slide-description">{currentSlideData.description}</p>
              
              <div className="slide-buttons">
                <Link 
                  to={currentSlideData.button1.link}
                  className={`btn btn-primary ${currentSlideData.button1.color}`}
                >
                  {currentSlideData.button1.text}
                </Link>
                <Link 
                  to={currentSlideData.button2.link}
                  className={`btn btn-secondary ${currentSlideData.button2.color}`}
                >
                  {currentSlideData.button2.text}
                </Link>
              </div>
            </div>
            
            <div className="slide-image">
              {currentSlideData.image ? (
                <div className="banner-image-container">
                  <img 
                    src={currentSlideData.image} 
                    alt={currentSlideData.title}
                    className="banner-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="image-fallback" style={{ display: 'none' }}>
                    <div className="floating-elements">
                      <div className="element element-1">
                        <i className="fas fa-briefcase"></i>
                      </div>
                      <div className="element element-2">
                        <i className="fas fa-laptop"></i>
                      </div>
                      <div className="element element-3">
                        <i className="fas fa-rocket"></i>
                      </div>
                      <div className="element element-4">
                        <i className="fas fa-star"></i>
                      </div>
                      <div className="element element-5">
                        <i className="fas fa-bullseye"></i>
                      </div>
                      <div className="element element-6">
                        <i className="fas fa-lightbulb"></i>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="image-placeholder">
                  <div className="floating-elements">
                    <div className="element element-1">
                      <i className="fas fa-briefcase"></i>
                    </div>
                    <div className="element element-2">
                      <i className="fas fa-laptop"></i>
                    </div>
                    <div className="element element-3">
                      <i className="fas fa-rocket"></i>
                    </div>
                    <div className="element element-4">
                      <i className="fas fa-star"></i>
                    </div>
                    <div className="element element-5">
                      <i className="fas fa-bullseye"></i>
                    </div>
                    <div className="element element-6">
                      <i className="fas fa-lightbulb"></i>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button 
          className="carousel-nav prev"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        
        <button 
          className="carousel-nav next"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <i className="fas fa-chevron-right"></i>
        </button>

        {/* Dots Indicator */}
        <div className="carousel-dots">
          {finalSlides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="carousel-progress">
          <div 
            className="progress-bar"
            style={{ 
              width: `${((currentSlide + 1) / finalSlides.length) * 100}%`,
              animation: isAutoPlaying ? 'progress 5s linear' : 'none'
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default BannerCarousel;
