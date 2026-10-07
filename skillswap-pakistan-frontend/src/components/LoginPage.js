// src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HelplinePopup from '../components/HelplinePopup';
import SuccessMessageModal from '../components/SuccessMessageModal'; // Import the new modal
import axios from 'axios';

function LoginPage() {
  const navigate = useNavigate();
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const openHelplinePopup = () => {
    setShowHelplinePopup(true);
  };

  const closeHelplinePopup = () => {
    setShowHelplinePopup(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        credential,
        password,
      });

      console.log('Login successful:', response.data);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);

      // Show success modal instead of alert
      setSuccessMessage('You have successfully logged in!');
      setShowSuccessModal(true);

    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors.map(e => e.msg).join(', '));
      } else if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError('An unexpected error occurred during login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/dashboard'); // Redirect to dashboard after closing the modal
  };

  return (
    <div className="login-page-container">
      <Navbar onHelplineClick={openHelplinePopup} onLogout={handleLogout} user={user} />

      <main className="login-section section-container">
        <div className="login-form-card">
          <h2 className="login-title">Welcome Back!</h2>
          <p className="login-subtitle">Log in to access your account and start swapping skills.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

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

            <button type="submit" className="btn btn-primary-orange login-btn" disabled={loading}>
              {loading ? 'Logging In...' : 'Log In'}
            </button>

            <p className="signup-prompt">
              Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link>
            </p>
          </form>
        </div>
      </main>

      <Footer />

      <button className="chatbot-sticky-btn" aria-label="Open chatbot">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </button>

      {showHelplinePopup && (
        <HelplinePopup onClose={closeHelplinePopup} />
      )}

      {/* New Success Message Modal */}
      <SuccessMessageModal
        isOpen={showSuccessModal}
        title="Login Successful!"
        message={successMessage}
        onClose={handleSuccessModalClose}
      />
    </div>
  );
}

export default LoginPage;