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
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import TutorialsPage from './pages/TutorialsPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import CareersPage from './pages/CareersPage';
import TermsPage from './pages/TermsPage';
import RequestProjectPage from './pages/RequestProjectPage';
import InstallPWA from './components/InstallPWA';
import { SiteProvider } from './context/SiteContext';

const App: React.FC = () => {
  return (
    <SiteProvider> {/* Wrapped with SiteProvider */}
      <AuthProvider>
        <Router>
          <InstallPWA /> {/* Integrated PWA Prompt */}
          <Routes>
            {/* Public Routes */} {/* Added comment */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Admin Routes */} {/* Added comment */}
            <Route path="/admin" element={
              <ProtectedRoute role="admin"> {/* Added role prop */}
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<ProductManager />} />
              <Route path="courses" element={<CourseManager />} />
              <Route path="settings" element={<AdminSettings />} /> {/* Added AdminSettings route */}
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
              {/* Add dummy routes for sidebar links */}
              <Route path="source-code" element={<SourceCode />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="checkout/:id" element={<CheckoutPage />} />
              <Route path="order-success" element={<OrderSuccessPage />} />
              <Route path="tutorials" element={<TutorialsPage />} />
              <Route path="pricing" element={<PricingPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="careers" element={<CareersPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="request-project" element={<RequestProjectPage />} /> {/* New Project Request Route */}
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </SiteProvider>
  );
};

export default App;