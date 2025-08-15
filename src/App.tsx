import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Layout } from './components/layout';
import { HomePage, ExplorePage, AboutPage } from './pages';

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
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route
              path="universities"
              element={
                <div className="p-6">
                  <h1 className="text-h1 font-bold">
                    Universities & Consultants
                  </h1>
                  <p className="text-body-3 text-text-secondary mt-4">
                    Coming soon...
                  </p>
                </div>
              }
            />
            <Route
              path="services/university-application"
              element={
                <div className="p-6">
                  <h1 className="text-h1 font-fustat font-bold">
                    University Application
                  </h1>
                  <p className="text-body-3 text-text-secondary mt-4">
                    Coming soon...
                  </p>
                </div>
              }
            />
            <Route
              path="services/visa-assistance"
              element={
                <div className="p-6">
                  <h1 className="text-h1 font-fustat font-bold">
                    Visa Assistance
                  </h1>
                  <p className="text-body-3 text-text-secondary mt-4">
                    Coming soon...
                  </p>
                </div>
              }
            />
            <Route
              path="services/counseling"
              element={
                <div className="p-6">
                  <h1 className="text-h1 font-fustat font-bold">
                    Study Abroad Counseling
                  </h1>
                  <p className="text-body-3 text-text-secondary mt-4">
                    Coming soon...
                  </p>
                </div>
              }
            />
            <Route
              path="services/scholarships"
              element={
                <div className="p-6">
                  <h1 className="text-h1 font-fustat font-bold">
                    Scholarship Guidance
                  </h1>
                  <p className="text-body-3 text-text-secondary mt-4">
                    Coming soon...
                  </p>
                </div>
              }
            />
            <Route
              path="blogs"
              element={
                <div className="p-6">
                  <h1 className="text-h1 font-fustat font-bold">Blogs</h1>
                  <p className="text-body-3 text-text-secondary mt-4">
                    Coming soon...
                  </p>
                </div>
              }
            />
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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
