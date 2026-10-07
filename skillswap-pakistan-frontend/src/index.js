// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
// Import modular CSS files
import './styles/global.css';
import './styles/navbar.css';
import './styles/homepage.css';
import './styles/forms.css';
import './styles/footer.css';
import './styles/popup.css';
import './styles/dashboard.css';
import './styles/profile.css';
import './styles/offer-skill.css';
import './styles/my-skills.css';
import './styles/marketplace.css';
import './styles/WomenOnlyZonePage.css';
import './styles/LoadingSpinner.css';

import HomePage from './components/HomePage';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import ProfilePage from './components/ProfilePage';
import OfferSkillPage from './components/OfferSkillPage';
import MySkillPage from './components/MySkillPage';
import MarketplacePage from './components/MarketplacePage';
import WomenOnlyZonePage from './components/WomenOnlyZonePage';
import ReceivedRequestsPage from './components/ReceivedRequestsPage'; // New: ReceivedRequestsPage

import './i18n'; // Ensure i18n is imported
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/profile" element={<ProfilePage />} />
        <Route path="/dashboard/my-skills" element={<MySkillPage />} />
        <Route path="/offer-skill" element={<OfferSkillPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/women-zone" element={<WomenOnlyZonePage />} />
        <Route path="/dashboard/received-requests" element={<ReceivedRequestsPage />} /> {/* New Route */}
        {/* Add more routes here as needed */}
        <Route path="/about" element={<HomePage />} />
        <Route path="/contact" element={<HomePage />} />
        <Route path="/faq" element={<HomePage />} />
        <Route path="/dispute" element={<HomePage />} />
        <Route path="/privacy-policy" element={<HomePage />} />
        <Route path="/terms-of-service" element={<HomePage />} />
        <Route path="/forgot-password" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);