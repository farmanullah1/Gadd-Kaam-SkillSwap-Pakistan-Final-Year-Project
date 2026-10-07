// src/pages/SignupPage.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import HelplinePopup from '../components/HelplinePopup';
import SuccessMessageModal from '../components/SuccessMessageModal'; // Import the new modal
import axios from 'axios';

function SignupPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
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

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [cnicNumber, setCnicNumber] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [profilePicture, setProfilePicture] = useState(null);
  const [cnicFrontPicture, setCnicFrontPicture] = useState(null);
  const [cnicBackPicture, setCnicBackPicture] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }
    if (!gender) {
        setError("Please select your gender.");
        setLoading(false);
        return;
    }

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('username', username);
    formData.append('phoneNumber', phoneNumber);
    formData.append('email', email);
    formData.append('dateOfBirth', dateOfBirth);
    formData.append('cnicNumber', cnicNumber);
    formData.append('gender', gender);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);

    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }
    if (cnicFrontPicture) {
      formData.append('cnicFrontPicture', cnicFrontPicture);
    }
    if (cnicBackPicture) {
      formData.append('cnicBackPicture', cnicBackPicture);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Signup successful:', response.data);

      // Show success modal instead of alert
      setSuccessMessage('Account has been successfully created! Please log in.');
      setShowSuccessModal(true);

    } catch (err) {
      console.error('Signup error:', err.response ? err.response.data : err.message);
      if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors.map(e => e.msg).join(', '));
      } else if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError('An unexpected error occurred during signup.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/login'); // Redirect to login page after closing the modal
  };

  return (
    <div className="signup-page-container">
      <Navbar onHelplineClick={openHelplinePopup} onLogout={handleLogout} user={user} />

      <main className="signup-section section-container">
        <div className="signup-form-card">
          <h2 className="signup-title">Join Gadd Kaam</h2>
          <p className="signup-subtitle">Create an account to start offering and finding skills in your community.</p>

          <form className="signup-form" onSubmit={handleSubmit}>
            {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="Your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="profilePicture">Profile Picture</label>
              <input type="file" id="profilePicture" accept="image/*" onChange={(e) => setProfilePicture(e.target.files[0])} />
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  placeholder="0300-1234567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="cnicNumber">CNIC Number</label>
              <input
                type="text"
                id="cnicNumber"
                placeholder="XXXXX-XXXXXXX-X"
                value={cnicNumber}
                onChange={(e) => setCnicNumber(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Choose Male or Female</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={gender === 'Male'}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  />
                  Male
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={gender === 'Female'}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  />
                  Female
                </label>
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="cnicFrontPicture">CNIC Front Picture</label>
                <input type="file" id="cnicFrontPicture" accept="image/*" onChange={(e) => setCnicFrontPicture(e.target.files[0])} />
              </div>
              <div className="form-group">
                <label htmlFor="cnicBackPicture">CNIC Back Picture</label>
                <input type="file" id="cnicBackPicture" accept="image/*" onChange={(e) => setCnicBackPicture(e.target.files[0])} />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary-orange create-account-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="login-prompt">
            Already have an account? <Link to="/login" className="login-link">Log In</Link>
          </p>
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
        title="Account Created!"
        message={successMessage}
        onClose={handleSuccessModalClose}
      />
    </div>
  );
}

export default SignupPage;