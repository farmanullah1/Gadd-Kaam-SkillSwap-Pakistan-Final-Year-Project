import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Your global CSS
import './App.css'; // Your main CSS
import HomePage from './components/HomePage';
import SignupPage from './components/SignupPage'; // Import the new SignupPage
import './i18n'; // Import your i18n configuration
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import Router components

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* Add more routes here as needed, e.g., for login, about, contact */}
        <Route path="/login" element={<SignupPage />} /> {/* Placeholder for login, assuming similar structure */}
        <Route path="/about" element={<HomePage />} /> {/* Placeholder route for about */}
        <Route path="/women-zone" element={<HomePage />} /> {/* Placeholder route for women-zone */}
        <Route path="/contact" element={<HomePage />} /> {/* Placeholder route for contact */}
        <Route path="/offer-skill" element={<HomePage />} /> {/* Placeholder route for offer skill */}
        <Route path="/faq" element={<HomePage />} /> {/* Placeholder route for FAQ */}
        <Route path="/dispute" element={<HomePage />} /> {/* Placeholder route for dispute */}
        <Route path="/privacy-policy" element={<HomePage />} /> {/* Placeholder route for privacy policy */}
        <Route path="/terms-of-service" element={<HomePage />} /> {/* Placeholder route for terms of service */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);