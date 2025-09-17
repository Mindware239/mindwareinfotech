import React, { Suspense, lazy } from 'react';
import HeroBanner from '../../components/website/HeroBanner';
import AboutSection from '../../components/website/AboutSection';
import ImpactCreatedSection from '../../components/website/ImpactCreatedSection';
import OurServicesSection from '../../components/website/OurServicesSection';
import SEOHead from '../../components/SEOHead';
import { generateStructuredData } from '../../utils/seoUtils';
import './HomePage.css';

// Lazy load heavy components
const WhyChooseSectionNew = lazy(() => import('../../components/website/WhyChooseSectionNew'));
const TransformFutureSection = lazy(() => import('../../components/website/TransformFutureSection'));
const TrainingProgramsSection = lazy(() => import('../../components/website/TrainingProgramsSection'));
const StatsSection = lazy(() => import('../../components/website/StatsSection'));
const ServiceCards = lazy(() => import('../../components/website/ServiceCards'));
const InternshipSection = lazy(() => import('../../components/website/InternshipSection'));
const VideoSection = lazy(() => import('../../components/website/VideoSection'));
const TestimonialSection = lazy(() => import('../../components/website/TestimonialSection'));
const BlogSection = lazy(() => import('../../components/website/BlogSection'));
const GallerySection = lazy(() => import('../../components/website/GallerySection'));
const FAQSection = lazy(() => import('../../components/website/FAQSection'));
const ApplyForBatchesSection = lazy(() => import('../../components/website/ApplyForBatchesSection'));

// Loading component
const SectionLoader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '200px',
    fontSize: '16px',
    color: '#64748b'
  }}>
    Loading...
  </div>
);

const HomePage = React.memo(() => {
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
        <ImpactCreatedSection />
        <OurServicesSection />
        
        <Suspense fallback={<SectionLoader />}>
          <WhyChooseSectionNew />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <TransformFutureSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <TrainingProgramsSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <StatsSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <ServiceCards />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <InternshipSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <VideoSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <TestimonialSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <BlogSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <GallerySection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <FAQSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <ApplyForBatchesSection />
        </Suspense>
      </div>
    </>
  );
});

export default HomePage;