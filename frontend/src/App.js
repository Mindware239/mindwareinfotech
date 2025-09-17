import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';

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
import BlogDetails from './pages/website/BlogDetails';
import GalleryPage from './pages/website/GalleryPage';
import FAQPage from './pages/website/FAQPage';
import PrivacyPolicyPage from './pages/website/PrivacyPolicyPage';
import TermsPage from './pages/website/TermsPage';
import VideoLectures from './pages/website/VideoLectures';
import CourseDetailPage from './pages/website/CourseDetailPage';
import CertificatePage from './pages/website/CertificatePage';
import UserDashboard from './pages/website/UserDashboard';
import TrainingDetailPage from './pages/website/TrainingDetailPage';
import WebDevelopmentPage from './pages/website/WebDevelopmentPage';
import TrainingProgramsPage from './pages/website/TrainingProgramsPage';
import EnrollmentPage from './pages/website/EnrollmentPage';
import LoginPage from './pages/website/LoginPage';
import RegisterPage from './pages/website/RegisterPage';
import ForgotPasswordPage from './pages/website/ForgotPasswordPage';
import UserDashboardLayout from './layouts/UserDashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminLoginPage from './pages/admin/LoginPage';
import InternshipManagement from './pages/admin/InternshipManagement';
import StudentManagement from './pages/admin/StudentManagement';
import EnrollmentManagement from './pages/admin/EnrollmentManagement';
import PaymentTracking from './pages/admin/PaymentTracking';
import CertificateGeneration from './pages/admin/CertificateGeneration';
import BlogManagement from './pages/admin/BlogManagement';
import TestimonialManagement from './pages/admin/TestimonialManagement';
import GalleryManagement from './pages/admin/GalleryManagement';
import FAQManagement from './pages/admin/FAQManagement';
import BannerManagement from './pages/admin/BannerManagement';
import VideoLectureManagement from './pages/admin/VideoLectureManagement';
import CourseManagement from './pages/admin/CourseManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import InternshipCategoryManagement from './pages/admin/InternshipCategoryManagement';
import UserManagement from './pages/admin/UserManagement';
import TrainingProgramManagement from './pages/admin/TrainingProgramManagement';
import SettingsPage from './pages/admin/SettingsPage';

// New Admin Components
import NewAdminDashboard from './pages/admin/AdminDashboard';
import NewTrainingProgramManager from './pages/admin/TrainingProgramManager';
import ContentManager from './pages/admin/ContentManager';

// Auth Components

// Styles
import './styles/globals.css';

// Create a client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      enabled: true,
    },
  },
});

// Loading component for lazy loaded routes
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '200px',
    fontSize: '18px',
    color: '#e4770d'
  }}>
    Loading...
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <CartProvider>
                <NotificationProvider>
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
                  <Route path="blog/:slug" element={<BlogDetails />} />
                  <Route path="gallery" element={<GalleryPage />} />
                  <Route path="faq" element={<FAQPage />} />
                  <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="terms" element={<TermsPage />} />
                  <Route path="video-lectures" element={<VideoLectures />} />
                  <Route path="course/:id" element={<CourseDetailPage />} />
                  <Route path="enroll/:courseId" element={<EnrollmentPage />} />
                  <Route path="enroll" element={<EnrollmentPage />} />
                  <Route path="certificate/:id" element={<CertificatePage />} />
                  <Route path="training/:slug" element={<TrainingDetailPage />} />
                  <Route path="web-training" element={<WebDevelopmentPage />} />
                  <Route path="training-programs" element={<TrainingProgramsPage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="forgot-password" element={<ForgotPasswordPage />} />
                </Route>

                {/* User Dashboard Routes - Separate from Website */}
                <Route path="/user-dashboard" element={
                  <ProtectedRoute>
                    <UserDashboardLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<UserDashboard />} />
                  <Route path="courses" element={<UserDashboard />} />
                  <Route path="trainings" element={<UserDashboard />} />
                  <Route path="internships" element={<UserDashboard />} />
                  <Route path="payments" element={<UserDashboard />} />
                  <Route path="certificates" element={<UserDashboard />} />
                  <Route path="profile" element={<UserDashboard />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminDashboard />
                    </Suspense>
                  } />
                  <Route path="dashboard" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminDashboard />
                    </Suspense>
                  } />
                  <Route path="internships" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <InternshipManagement />
                    </Suspense>
                  } />
                  <Route path="students" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <StudentManagement />
                    </Suspense>
                  } />
                  <Route path="enrollments" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <EnrollmentManagement />
                    </Suspense>
                  } />
                  <Route path="payments" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <PaymentTracking />
                    </Suspense>
                  } />
                  <Route path="certificates" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <CertificateGeneration />
                    </Suspense>
                  } />
                  <Route path="blogs" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <BlogManagement />
                    </Suspense>
                  } />
                  <Route path="testimonials" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <TestimonialManagement />
                    </Suspense>
                  } />
                  <Route path="gallery" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <GalleryManagement />
                    </Suspense>
                  } />
                  <Route path="faq" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <FAQManagement />
                    </Suspense>
                  } />
                  <Route path="banners" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <BannerManagement />
                    </Suspense>
                  } />
                  <Route path="video-lectures" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <VideoLectureManagement />
                    </Suspense>
                  } />
                  <Route path="courses" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <CourseManagement />
                    </Suspense>
                  } />
                  <Route path="courses/categories" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <CategoryManagement />
                    </Suspense>
                  } />
                  <Route path="internships/categories" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <InternshipCategoryManagement />
                    </Suspense>
                  } />
                  <Route path="users" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <UserManagement />
                    </Suspense>
                  } />
                  <Route path="training-programs" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <TrainingProgramManagement />
                    </Suspense>
                  } />
                  <Route path="new-dashboard" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <NewAdminDashboard />
                    </Suspense>
                  } />
                  <Route path="program-manager" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <NewTrainingProgramManager />
                    </Suspense>
                  } />
                  <Route path="content-manager" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <ContentManager />
                    </Suspense>
                  } />
                  <Route path="settings" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <SettingsPage />
                    </Suspense>
                  } />
                </Route>
              </Routes>
            </Router>
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
</HelmetProvider>
</ErrorBoundary>
  );
}

export default App;
