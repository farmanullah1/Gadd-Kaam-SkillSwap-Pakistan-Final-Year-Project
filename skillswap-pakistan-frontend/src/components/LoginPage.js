// src/components/LoginPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';

function LoginPage() {
  const [credential, setCredential] = useState(''); // For email, username, or CNIC
  const [password, setPassword] = useState('');
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);

  const openHelplinePopup = () => {
    setShowHelplinePopup(true);
  };

  const closeHelplinePopup = () => {
    setShowHelplinePopup(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Attempting to log in with:', { credential, password });
    alert(`Login attempted for: ${credential}`);
    // In a real application, you'd send this data to an API and handle success/failure
  };

  return (
    <div className="login-page-container">
      <Navbar onHelplineClick={openHelplinePopup} />

      <main className="login-section section-container">
        <div className="login-form-card">
          <h2 className="login-title">Welcome Back!</h2>
          <p className="login-subtitle">Log in to access your account and start swapping skills.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="credential">Email, Username, or CNIC</label>
              <input
                type="text"
                id="credential"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                placeholder="Enter your credentials"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <Link to="/forgot-password" className="forgot-password-link">Forgot password?</Link>
            </div>

            <button type="submit" className="btn btn-primary-orange login-btn"> {/* Use btn-primary-orange directly */}
              Log In
            </button>

            <p className="signup-prompt">
              Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link>
            </p>
          </form>
        </div>
      </main>

      <Footer />

      {/* Sticky Chatbot Button */}
      <button className="chatbot-sticky-btn" aria-label="Open chatbot">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </button>

      {/* Helpline Popup Modal */}
      {showHelplinePopup && (
        <HelplinePopup onClose={closeHelplinePopup} />
      )}
    </div>
  );
}

export default LoginPage;