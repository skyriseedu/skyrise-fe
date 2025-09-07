import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout';
import ScrollToTop from './components/common/ScrollToTop';
import HomePage from './pages/users/home/HomePage';
import ExplorePage from './pages/users/explore/ExplorePage';
import ProgramDetailsPage from './pages/users/explore/ProgramDetailsPage';
import AboutPage from './pages/users/about/AboutPage';
import BlogsPage from './pages/users/blogs/BlogsPage';
import BlogDetailPage from './pages/users/blogs/BlogDetailPage';
import UniversitiesAndConsultants from './pages/users/universities/UniversitiesAndConsultants';
import UniversityApplicationPage from './pages/users/services/UniversityApplicationPage';
import VisaAssistancePage from './pages/users/services/VisaAssistancePage';
import CounselingPage from './pages/users/services/CounselingPage';
import ScholarshipsPage from './pages/users/services/ScholarshipsPage';

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
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="programs/:id" element={<ProgramDetailsPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route
              path="universities-and-consultants"
              element={<UniversitiesAndConsultants />}
            />
            <Route
              path="services/university-application"
              element={<UniversityApplicationPage />}
            />
            <Route
              path="services/visa-assistance"
              element={<VisaAssistancePage />}
            />
            <Route path="services/consultation" element={<CounselingPage />} />
            <Route
              path="services/scholarships"
              element={<ScholarshipsPage />}
            />
            <Route path="blogs" element={<BlogsPage />} />
            <Route path="blogs/:slug" element={<BlogDetailPage />} />
          </Route>

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
    </QueryClientProvider>
  );
};

export default App;
