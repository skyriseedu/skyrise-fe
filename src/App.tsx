import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import { HomePage, ExplorePage, AboutPage } from './pages';
import WebViewRedirect from './components/common/WebViewRedirect';
import WebViewDebug from './components/common/WebViewDebug';

const App: React.FC = () => {
  return (
    <>
      <WebViewRedirect />
      <WebViewDebug />
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
    </>
  );
};

export default App;
