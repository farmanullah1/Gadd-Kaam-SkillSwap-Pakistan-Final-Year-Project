import React from 'react';
import ReactDOM from 'react-dom/client';
// No need for './index.css' if all styles are moved to './styles/'
import './styles/global.css';
import './styles/navbar.css';
import './styles/homepage.css';
import './styles/forms.css'; // <--- UPDATED: Import forms.css instead of signup.css
import './styles/footer.css';
import './styles/popup.css';
import HomePage from './components/HomePage';
import SignupPage from './components/SignupPage'; // Import the SignupPage
import LoginPage from './components/LoginPage';   // Import the LoginPage
import './i18n'; // Import your i18n configuration
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import Router components

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Add more routes here as needed, e.g., for login, about, contact */}
        <Route path="/about" element={<HomePage />} />
        <Route path="/women-zone" element={<HomePage />} />
        <Route path="/contact" element={<HomePage />} />
        <Route path="/offer-skill" element={<HomePage />} />
        <Route path="/faq" element={<HomePage />} />
        <Route path="/dispute" element={<HomePage />} />
        <Route path="/privacy-policy" element={<HomePage />} />
        <Route path="/terms-of-service" element={<HomePage />} />
        <Route path="/forgot-password" element={<LoginPage />} /> {/* Placeholder for forgot password */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);