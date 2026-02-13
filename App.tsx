import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ProjectsPage from './pages/ProjectsPage';
import BlogPage from './pages/BlogPage';
import AboutPage from './pages/AboutPage';
import ProjectDetail from './components/ProjectDetail';
import BlogDetail from './components/BlogDetail';
import AdminLayout from './components/admin/AdminLayout';
import InvoicePage from './pages/InvoicePage';


import AdminDashboard from './components/admin/AdminDashboard';
import ProductManager from './components/admin/ProductManager';
import CourseManager from './components/admin/CourseManager';
import BlogManager from './components/admin/BlogManager';
import CouponManager from './components/admin/CouponManager';
import EmailManager from './components/admin/EmailManager';
import ProjectRequestManager from './components/admin/ProjectRequestManager';
import StudentRequestManager from './components/admin/StudentRequestManager';
import TutorialManager from './components/admin/TutorialManager';
import CertificateManager from './components/admin/CertificateManager';
import AdminSettings from './components/admin/AdminSettings';
import SourceCode from './components/SourceCode';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AccountPage from './pages/AccountPage';
import ProtectedRoute from './components/ProtectedRoute';
import CoursesPage from './pages/CoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import CourseReaderPage from './pages/CourseReaderPage';
import CertificatePage from './pages/CertificatePage';
import CertificateVerificationPage from './pages/CertificateVerificationPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import TutorialsPage from './pages/TutorialsPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import CareersPage from './pages/CareersPage';
import TermsPage from './pages/TermsPage';
import RequestProjectPage from './pages/RequestProjectPage';
import InstallPWA from './components/InstallPWA';
import ScrollToTop from './components/ScrollToTop';
import { SiteProvider } from './context/SiteContext';
import { ThemeProvider } from './context/ThemeContext';
import SecurityQuestionsPage from './pages/SecurityQuestionsPage';
import ResetPasswordSecurityPage from './pages/ResetPasswordSecurityPage';


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SiteProvider>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <InstallPWA />
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/reset-password-security" element={<ResetPasswordSecurityPage />} />

              <Route path="/security-questions" element={
                <ProtectedRoute requireSecurityQuestions={false}>
                  <SecurityQuestionsPage />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="projects" element={<ProductManager />} />
                <Route path="courses" element={<CourseManager />} />
                <Route path="blogs" element={<BlogManager />} />
                <Route path="coupons" element={<CouponManager />} />
                <Route path="emails" element={<EmailManager />} />
                <Route path="requests" element={<ProjectRequestManager />} />
                <Route path="students" element={<StudentRequestManager />} />
                <Route path="tutorials" element={<TutorialManager />} />
                <Route path="certificates" element={<CertificateManager />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Invoice Route */}
              <Route path="/invoice/:id" element={
                <ProtectedRoute>
                  <InvoicePage />
                </ProtectedRoute>
              } />

              {/* Account Route */}
              <Route path="/account" element={
                <ProtectedRoute>
                  <Navbar />
                  <AccountPage />
                </ProtectedRoute>
              } />

              {/* Main App Routes */}
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="blog" element={<BlogPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="project/:id" element={<ProjectDetail />} />
                <Route path="blog/:id" element={<BlogDetail />} />
                <Route path="source-code" element={<SourceCode />} />
                <Route path="courses" element={<CoursesPage />} />
                <Route path="courses/:id" element={<CourseDetailsPage />} />
                <Route path="courses/:id/learn" element={<CourseReaderPage />} />
                <Route path="courses/:id/certificate" element={<CertificatePage />} />
                <Route path="verify" element={<CertificateVerificationPage />} />
                <Route path="verify/:id" element={<CertificateVerificationPage />} />
                <Route path="checkout/:id" element={<CheckoutPage />} />
                <Route path="order-success" element={<OrderSuccessPage />} />
                <Route path="tutorials" element={<TutorialsPage />} />
                <Route path="pricing" element={<PricingPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="careers" element={<CareersPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="request-project" element={<RequestProjectPage />} />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </SiteProvider>
    </ThemeProvider>
  );
};

export default App;