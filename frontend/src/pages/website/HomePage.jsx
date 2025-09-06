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
import './HomePage.css';

const HomePage = () => {
  return (
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
  );
};

export default HomePage;