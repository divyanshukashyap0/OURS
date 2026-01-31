import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ProjectsPage from './pages/ProjectsPage';
import BlogPage from './pages/BlogPage';
import AboutPage from './pages/AboutPage';
import ProjectDetail from './components/ProjectDetail';
import BlogDetail from './components/BlogDetail';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import ProductManager from './components/admin/ProductManager';
import SourceCode from './components/SourceCode';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AccountPage from './pages/AccountPage';
import ProtectedRoute from './components/ProtectedRoute';
import CoursesPage from './pages/CoursesPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Admin Routes (Keep separate from main layout if preferred, or wrap) - Keeping separate for now or assumed unrelated */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductManager />} />
          </Route>

          {/* Account Route */}
          <Route path="/account" element={
            <ProtectedRoute>
              <Navbar />
              <AccountPage />
            </ProtectedRoute>
          } />

          {/* Main App Routes */}
          <Route path="*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/project/:id" element={<ProjectDetail />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                {/* Add dummy routes for sidebar links */}
                <Route path="/source-code" element={<SourceCode />} />
                <Route path="/courses" element={<CoursesPage />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;