// src/pages/SignupPage.js
import React, { useState } from 'react';
import Navbar from '../components/Navbar'; // Import the reusable Navbar
import Footer from '../components/Footer'; // Import the reusable Footer
import { useTranslation } from 'react-i18next'; // For translating form labels if needed
import { Link } from 'react-router-dom'; // For the "Log In" link

function SignupPage() {
  const { t } = useTranslation();
  const [showHelplinePopup, setShowHelplinePopup] = useState(false); // State for helpline popup

  // Function to open the helpline popup
  const openHelplinePopup = () => {
    setShowHelplinePopup(true);
  };

  // Function to close the helpline popup
  const closeHelplinePopup = () => {
    setShowHelplinePopup(false);
  };

  // State variables for form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [cnicNumber, setCnicNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // You might want to add state for file inputs if you're handling them as controlled components
  // const [profilePicture, setProfilePicture] = useState(null);
  // const [cnicFrontPicture, setCnicFrontPicture] = useState(null);
  // const [cnicBackPicture, setCnicBackPicture] = useState(null);


  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic form validation (add more robust validation as needed)
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Handle form submission logic here
    console.log('Signup form submitted:', {
      firstName, lastName, username, phoneNumber, email, dateOfBirth, cnicNumber, password
      // Include file inputs here if you add state for them
    });
    // In a real application, you'd send this data to an API
    alert('Signup form submitted! (Check console for data)');
    // Optionally clear form fields
    // setFirstName(''); setLastName(''); etc.
  };

  return (
    <div className="signup-page-container">
      {/* Navbar now receives the openHelplinePopup function as a prop */}
      <Navbar onHelplineClick={openHelplinePopup} />

      <main className="signup-section section-container">
        <div className="signup-form-card">
          <h2 className="signup-title">Join Gadd Kaam</h2>
          <p className="signup-subtitle">Create an account to start offering and finding skills in your community.</p>

          <form className="signup-form" onSubmit={handleSubmit}>
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
              {/* For uncontrolled file input, you'd access file via ref or event.target.files[0] */}
              <input type="file" id="profilePicture" accept="image/*" />
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

            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="cnicFrontPicture">CNIC Front Picture</label>
                <input type="file" id="cnicFrontPicture" accept="image/*" />
              </div>
              <div className="form-group">
                <label htmlFor="cnicBackPicture">CNIC Back Picture</label>
                <input type="file" id="cnicBackPicture" accept="image/*" />
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

            <button type="submit" className="btn btn-primary-orange create-account-btn">
              Create Account
            </button>
          </form>

          <p className="login-prompt">
            Already have an account? <Link to="/login" className="login-link">Log In</Link>
          </p>
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
        <div className="helpline-popup-overlay" onClick={closeHelplinePopup}>
          <div className="helpline-popup-content" onClick={e => e.stopPropagation()}>
            <button className="helpline-popup-close-btn" onClick={closeHelplinePopup} aria-label="Close popup">
              &times;
            </button>
            <h3 className="helpline-popup-title">Helpline Number</h3>
            <p className="helpline-number">+923113147029</p>
            <p className="helpline-note">Please call us for immediate assistance.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignupPage;