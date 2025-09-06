import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';

// Layouts
import WebsiteLayout from './layouts/WebsiteLayout';
import AdminLayout from './layouts/AdminLayout';

// Website Pages
import HomePage from './pages/website/HomePage';
import AboutPage from './pages/website/AboutPage';
import InternshipsPage from './pages/website/InternshipsPage';
import ResumeServicesPage from './pages/website/ResumeServicesPage';
import ApplyInternshipPage from './pages/website/ApplyInternshipPage';
import CareersPage from './pages/website/CareersPage';
import ContactPage from './pages/website/ContactPage';
import PortfolioPage from './pages/website/PortfolioPage';
import BlogPage from './pages/website/BlogPage';
import BlogPostPage from './pages/website/BlogPostPage';
import GalleryPage from './pages/website/GalleryPage';
import FAQPage from './pages/website/FAQPage';
import PrivacyPolicyPage from './pages/website/PrivacyPolicyPage';
import TermsPage from './pages/website/TermsPage';
import VideoLecturesPage from './pages/website/VideoLecturesPage';
import CourseDetailPage from './pages/website/CourseDetailPage';
import CertificatePage from './pages/website/CertificatePage';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import LoginPage from './pages/admin/LoginPage';
import InternshipManagement from './pages/admin/InternshipManagement';
import StudentManagement from './pages/admin/StudentManagement';
import PaymentTracking from './pages/admin/PaymentTracking';
import CertificateGeneration from './pages/admin/CertificateGeneration';
import BlogManagement from './pages/admin/BlogManagement';
import TestimonialManagement from './pages/admin/TestimonialManagement';
import GalleryManagement from './pages/admin/GalleryManagement';
import FAQManagement from './pages/admin/FAQManagement';
import BannerManagement from './pages/admin/BannerManagement';
import VideoLectureManagement from './pages/admin/VideoLectureManagement';
import CourseManagement from './pages/admin/CourseManagement';
import UserManagement from './pages/admin/UserManagement';
import SettingsPage from './pages/admin/SettingsPage';

// Auth Components
import ProtectedRoute from './components/admin/ProtectedRoute';

// Styles
import './styles/globals.css';
import './styles/admin.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <Routes>
                {/* Website Routes */}
                <Route path="/" element={<WebsiteLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="internships" element={<InternshipsPage />} />
                  <Route path="resume-services" element={<ResumeServicesPage />} />
                  <Route path="apply-internship" element={<ApplyInternshipPage />} />
                  <Route path="careers" element={<CareersPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="portfolio" element={<PortfolioPage />} />
                  <Route path="blog" element={<BlogPage />} />
                  <Route path="blog/:slug" element={<BlogPostPage />} />
                  <Route path="gallery" element={<GalleryPage />} />
                  <Route path="faq" element={<FAQPage />} />
                  <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="terms" element={<TermsPage />} />
                  <Route path="video-lectures" element={<VideoLecturesPage />} />
                  <Route path="course/:id" element={<CourseDetailPage />} />
                  <Route path="certificate/:id" element={<CertificatePage />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="internships" element={<InternshipManagement />} />
                  <Route path="students" element={<StudentManagement />} />
                  <Route path="payments" element={<PaymentTracking />} />
                  <Route path="certificates" element={<CertificateGeneration />} />
                  <Route path="blogs" element={<BlogManagement />} />
                  <Route path="testimonials" element={<TestimonialManagement />} />
                  <Route path="gallery" element={<GalleryManagement />} />
                  <Route path="faq" element={<FAQManagement />} />
                  <Route path="banners" element={<BannerManagement />} />
                  <Route path="video-lectures" element={<VideoLectureManagement />} />
                  <Route path="courses" element={<CourseManagement />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Routes>
            </Router>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
