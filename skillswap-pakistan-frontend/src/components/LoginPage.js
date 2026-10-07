// src/components/LoginPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar'; // Import the reusable Navbar
import Footer from './Footer'; // Import the reusable Footer
import HelplinePopup from './HelplinePopup'; // Import the new HelplinePopup component

function LoginPage() {
  const [credential, setCredential] = useState(''); // For email, username, or CNIC
  const [password, setPassword] = useState('');
  const [showHelplinePopup, setShowHelplinePopup] = useState(false); // State for helpline popup

  // Function to open the helpline popup
  const openHelplinePopup = () => {
    setShowHelplinePopup(true);
  };

  // Function to close the helpline popup
  const closeHelplinePopup = () => {
    setShowHelplinePopup(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the login data to your backend
    console.log('Attempting to log in with:', { credential, password });
    alert(`Login attempted for: ${credential}`);
    // You'd add navigation to a dashboard or homepage upon successful login
  };

  return (
    <div className="login-page-container"> {/* Using a specific class for login page container */}
      <Navbar onHelplineClick={openHelplinePopup} /> {/* Pass openHelplinePopup to Navbar */}

      <main className="login-section section-container"> {/* Reusing section-container */}
        <div className="login-form-card"> {/* Specific class for login form card */}
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

            <button type="submit" className="btn create-account-btn"> {/* Reusing create-account-btn style */}
              Log In
            </button>

            <p className="signup-prompt"> {/* Changed class to signup-prompt for clarity */}
              Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link> {/* Changed class to signup-link */}
            </p>
          </form>
        </div>
      </main>

      <Footer /> {/* Use the reusable Footer */}

      {/* Sticky Chatbot Button (can be part of App.js if global, or kept per page) */}
      <button className="chatbot-sticky-btn" aria-label="Open chatbot">
        {/* Chatbot SVG Icon */}
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