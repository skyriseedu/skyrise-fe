import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/layout';
import AdminLayout from './components/layout/AdminLayout';
import AdminRoute from './components/auth/AdminRoute';
import AdminDashboard from './pages/admin/dashboard/AdminDashboard';
import BookingsPage from './pages/admin/bookings/BookingsPage';
import ProgramSetup from './pages/admin/programs/ProgramSetup';
import ProgramForm from './pages/admin/programs/ProgramForm';
import TeamAndConsultantsPage from './pages/admin/team/TeamAndConsultantsPage';
import ScrollToTop from './components/common/ScrollToTop';
import HomePage from './pages/users/home/HomePage';
import ExplorePage from './pages/users/explore/ExplorePage';
import ProgramDetailsPage from './pages/users/explore/ProgramDetailsPage';
import AboutPage from './pages/users/about/AboutPage';
import BlogsPage from './pages/users/blogs/BlogsPage';
import BlogDetailPage from './pages/users/blogs/BlogDetailPage';
import UniversitiesAndConsultants from './pages/users/universities/UniversitiesAndConsultants';
import AdmissionProcessPage from './pages/users/services/AdmissionProcessPage';
import VisaAssistancePage from './pages/users/services/VisaAssistancePage';
import CounselingPage from './pages/users/services/CounselingPage';
import { UniversityDetail } from './pages/users/universities';
import AccommodationPage from './pages/users/services/AccommodationPage';
import PreUniversityPage from './pages/users/services/PreUniversityPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import LogoutPage from './pages/auth/LogoutPage';
import UniversitySetup from './pages/admin/universities/UniversitySetup';
import UniversityForm from './pages/admin/universities/UniversityForm';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/logout" element={<LogoutPage />} />

            {/* Public user routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="programs/:slug" element={<ProgramDetailsPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route
                path="universities-and-consultants"
                element={<UniversitiesAndConsultants />}
              />
              <Route
                path="universities-and-consultants/:slug"
                element={<UniversityDetail />}
              />
              <Route
                path="services/consultation"
                element={<CounselingPage />}
              />
              <Route
                path="services/admission-process-support"
                element={<AdmissionProcessPage />}
              />
              <Route
                path="services/visa-assistance"
                element={<VisaAssistancePage />}
              />
              <Route
                path="services/accommodation-and-airport-pick-up"
                element={<AccommodationPage />}
              />
              <Route
                path="services/pre-university"
                element={<PreUniversityPage />}
              />
              <Route path="blogs" element={<BlogsPage />} />
              <Route path="blogs/:slug" element={<BlogDetailPage />} />
            </Route>

            {/* Admin routes */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="program-setup" element={<ProgramSetup />} />
              <Route path="program-setup/create" element={<ProgramForm />} />
              <Route
                path="program-setup/edit/:slug"
                element={<ProgramForm />}
              />

              <Route path="university-setup" element={<UniversitySetup />} />
              <Route
                path="university-setup/create"
                element={<UniversityForm />}
              />
              <Route
                path="university-setup/edit/:slug"
                element={<UniversityForm />}
              />

              <Route path="team" element={<TeamAndConsultantsPage />} />
              <Route path="bookings" element={<BookingsPage />} />
            </Route>

            {/* 404 page */}
            <Route
              path="*"
              element={
                <div className="p-6">
                  <h1 className="text-h1 font-fustat font-bold">
                    Page Not Found
                  </h1>
                  <p className="text-body-3 text-text-secondary mt-4">
                    The page you are looking for does not exist.
                  </p>
                </div>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
