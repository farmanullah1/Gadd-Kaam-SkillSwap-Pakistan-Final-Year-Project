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
import HomePage from './components/HomePage';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import ProfilePage from './components/ProfilePage';
import OfferSkillPage from './components/OfferSkillPage'; // <--- NEW: Import OfferSkillPage

import './i18n';
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
        <Route path="/offer-skill" element={<OfferSkillPage />} /> {/* <--- UPDATED: This route now points to the new page */}
        {/* The rest of your routes can stay as they are for now */}
        <Route path="/about" element={<HomePage />} />
        <Route path="/women-zone" element={<HomePage />} />
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