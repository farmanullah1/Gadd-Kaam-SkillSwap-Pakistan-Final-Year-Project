// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import './styles/navbar.css';
import './styles/homepage.css';
import './styles/forms.css';
import './styles/footer.css';
import './styles/popup.css';
import './styles/dashboard.css';
import './styles/profile.css';
import './styles/offer-skill.css';

import HomePage from './components/HomePage';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import ProfilePage from './components/ProfilePage';
import OfferSkillPage from './components/OfferSkillPage';
import MarketplacePage from './components/MarketplacePage';
import MySkillPage from './components/MySkillPage';
import WomenOnlyZonePage from './components/WomenOnlyZonePage';

import './i18n';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

// A simple wrapper to check for a logged-in user and redirect if not found
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

// A more specific wrapper to check for a logged-in female user
const WomenOnlyRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  return (token && user && user.gender === 'Female') ? children : <Navigate to="/login" />;
};

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/dashboard/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        {/* NEW: Route for the My Skill page, nested under dashboard */}
        <Route path="/dashboard/my-skills" element={<PrivateRoute><MySkillPage /></PrivateRoute>} />
        <Route path="/offer-skill" element={<PrivateRoute><OfferSkillPage /></PrivateRoute>} />

        {/* NEW: Route for the Marketplace page, accessible to everyone */}
        <Route path="/marketplace" element={<MarketplacePage />} />
        
        {/* NEW: Route for the Women-Only Zone, with access control */}
        <Route path="/women-zone" element={<WomenOnlyRoute><WomenOnlyZonePage /></WomenOnlyRoute>} />

        {/* The rest of your routes should point to the correct pages */}
        <Route path="/about" element={<>Page under construction</>} />
        <Route path="/contact" element={<>Page under construction</>} />
        <Route path="/faq" element={<>Page under construction</>} />
        <Route path="/dispute" element={<>Page under construction</>} />
        <Route path="/privacy-policy" element={<>Page under construction</>} />
        <Route path="/terms-of-service" element={<>Page under construction</>} />
        <Route path="/forgot-password" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
