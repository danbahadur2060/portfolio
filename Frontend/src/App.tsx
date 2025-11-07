import React, { useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { isAuthenticated } from "./utils/auth";
import { Navigation } from "./components/Navigation";
import Footer from "./components/Footer";
import { Loader2 } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load page components for better performance
const HomePage = lazy(() => import('./components/pages/HomePage').then(module => ({ default: module.HomePage })));
const ProjectsPage = lazy(() => import('./components/pages/ProjectsPage').then(module => ({ default: module.ProjectsPage })));
const AboutPage = lazy(() => import('./components/pages/AboutPage').then(module => ({ default: module.AboutPage })));
const BlogPage = lazy(() => import('./components/pages/BlogPage').then(module => ({ default: module.BlogPage })));
const ContactPage = lazy(() => import('./components/pages/ContactPage').then(module => ({ default: module.ContactPage })));
const LoginForm = lazy(() => import('./components/pages/LoginPage').then(module => ({ default: module.default })));
const PortfolioDashboard = lazy(() => import('./components/PortfolioDashboard').then(module => ({ default: module.PortfolioDashboard })));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="ml-2 text-lg">Loading...</span>
  </div>
);

// ✅ Protected route wrapper
function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
            {/* Landing Pages Layout */}
            <Route
              path="/"
              element={
                <>
                  <Navigation
                    currentPage={currentPage}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                  <div className="pt-16">
                    <HomePage />
                    <Footer />
                  </div>
                </>
              }
            />

            <Route
              path="/projects"
              element={
                <>
                  <Navigation
                    currentPage={currentPage}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                  <div className="pt-16">
                    <ProjectsPage />
                    <Footer />
                  </div>
                </>
              }
            />

            <Route
              path="/about"
              element={
                <>
                  <Navigation
                    currentPage={currentPage}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                  <div className="pt-16">
                    <AboutPage />
                    <Footer />
                  </div>
                </>
              }
            />

          <Route
            path="/blog"
            element={
              <>
                <Navigation
                  currentPage={currentPage}
                  onPageChange={(page) => setCurrentPage(page)}
                />
                <div className="pt-16">
                  <BlogPage />
                  <Footer />
                </div>
              </>
            }
          />

          <Route
            path="/contact"
            element={
              <>
                <Navigation
                  currentPage={currentPage}
                  onPageChange={(page) => setCurrentPage(page)}
                />
                <div className="pt-16">
                  <ContactPage />
                  <Footer />
                </div>
              </>
            }
          />

          <Route
            path="/login"
            element={
              <>
                <Navigation
                  currentPage={currentPage}
                  onPageChange={(page) => setCurrentPage(page)}
                />
                <div className="pt-16">
                  <LoginForm />
                  <Footer />
                </div>
              </>
            }
          />

          {/* Dashboard (No Nav, No Footer) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PortfolioDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
      </Router>
    </ThemeProvider>
    </ErrorBoundary>
  );
}
