import React from 'react';
import HeroBanner from '../../components/website/HeroBanner';
import AboutSection from '../../components/website/AboutSection';
import WhyChooseSection from '../../components/website/WhyChooseSection';
import TransformFutureSection from '../../components/website/TransformFutureSection';
import TrainingProgramsSection from '../../components/website/TrainingProgramsSection';
import StatsSection from '../../components/website/StatsSection';
import ServiceCards from '../../components/website/ServiceCards';
import InternshipSection from '../../components/website/InternshipSection';
import VideoSection from '../../components/website/VideoSection';
import TestimonialSection from '../../components/website/TestimonialSection';
import BlogSection from '../../components/website/BlogSection';
import GallerySection from '../../components/website/GallerySection';
import FAQSection from '../../components/website/FAQSection';
import SEOHead from '../../components/SEOHead';
import { generateStructuredData } from '../../utils/seoUtils';
import './HomePage.css';

const HomePage = () => {
  // Generate structured data for the homepage
  const structuredData = generateStructuredData('organization');

  return (
    <>
      <SEOHead
        title="Mindware India - Leading Software Training Institute | Web Development, Mobile Development, Data Science Courses"
        description="India's leading software training institute offering comprehensive courses in web development, mobile development, data science, AI/ML, and more. Expert instructors, hands-on training, and job placement assistance."
        keywords="software training, web development, mobile development, data science, AI ML, programming courses, IT training, job placement, Mindware India, React, Node.js, Python, Java, JavaScript"
        ogTitle="Mindware India - Leading Software Training Institute"
        ogDescription="India's leading software training institute offering comprehensive courses in web development, mobile development, data science, AI/ML, and more."
        ogImage="/mindware-logo.png"
        ogUrl={window.location.href}
        twitterTitle="Mindware India - Leading Software Training Institute"
        twitterDescription="India's leading software training institute offering comprehensive courses in web development, mobile development, data science, AI/ML, and more."
        twitterImage="/mindware-logo.png"
        canonicalUrl={window.location.href}
        structuredData={structuredData}
      />
      <div className="home-page">
      <HeroBanner />
      <AboutSection />
      <WhyChooseSection />
      <TransformFutureSection />
      <TrainingProgramsSection />
      <StatsSection />
      <ServiceCards />
      <InternshipSection />
      <VideoSection />
      <TestimonialSection />
      <BlogSection />
      <GallerySection />
      <FAQSection />
      </div>
    </>
  );
};

export default HomePage;