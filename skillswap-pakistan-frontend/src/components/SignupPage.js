import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import HelplinePopup from '../components/HelplinePopup';
import SuccessMessageModal from '../components/SuccessMessageModal';
import axios from 'axios';

// Accept onChatbotToggle as a prop
function SignupPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');


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
      setError(t("signup_error_passwords_mismatch"));
      setLoading(false);
      return;
    }
    if (!gender) {
        setError(t("signup_error_gender_required"));
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
      // Use process.env.REACT_APP_API_URL for the API endpoint
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Signup successful:', response.data);

      // Show success modal
      setSuccessMessage(t('signup_success_message'));
      setShowSuccessModal(true);

    } catch (err) {
      console.error('Signup error:', err.response ? err.response.data : err.message);
      if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors.map(e => e.msg).join(', '));
      } else if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError(t('signup_unexpected_error'));
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
          <h2 className="signup-title">{t("signup_join_gadd_kaam")}</h2>
          <p className="signup-subtitle">{t("signup_start_offering_finding")}</p>

          <form className="signup-form" onSubmit={handleSubmit}>
            {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="firstName">{t("signup_firstName_label")}</label>
                <input
                  type="text"
                  id="firstName"
                  placeholder={t("signup_firstName_placeholder")}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">{t("signup_lastName_label")}</label>
                <input
                  type="text"
                  id="lastName"
                  placeholder={t("signup_lastName_placeholder")}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="profilePicture">{t("signup_profilePicture_label")}</label>
              <input type="file" id="profilePicture" accept="image/*" onChange={(e) => setProfilePicture(e.target.files[0])} />
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="username">{t("signup_username_label")}</label>
                <input
                  type="text"
                  id="username"
                  placeholder={t("signup_username_placeholder")}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumber">{t("signup_phoneNumber_label")}</label>
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
                <label htmlFor="email">{t("signup_email_label")}</label>
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
                <label htmlFor="dateOfBirth">{t("signup_dateOfBirth_label")}</label>
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
              <label htmlFor="cnicNumber">{t("signup_cnicNumber_label")}</label>
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
              <label>{t("signup_gender_label")}</label>
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
                  {t("signup_gender_male")}
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
                  {t("signup_gender_female")}
                </label>
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="cnicFrontPicture">{t("signup_cnicFrontPic_label")}</label>
                <input type="file" id="cnicFrontPicture" accept="image/*" onChange={(e) => setCnicFrontPicture(e.target.files[0])} />
              </div>
              <div className="form-group">
                <label htmlFor="cnicBackPicture">{t("signup_cnicBackPic_label")}</label>
                <input type="file" id="cnicBackPicture" accept="image/*" onChange={(e) => setCnicBackPicture(e.target.files[0])} />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="password">{t("signup_password_label")}</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">{t("signup_confirmPassword_label")}</label>
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
              {loading ? t('signup_creating_account') : t('signup_create_account_btn')}
            </button>
          </form>

          <p className="login-prompt">
            {t("signup_already_have_account")} <Link to="/login" className="login-link">{t("signup_login_link")}</Link>
          </p>
        </div>
      </main>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />

      <button className="chatbot-sticky-btn" aria-label="Open chatbot" onClick={onChatbotToggle}>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </button>

      {showHelplinePopup && (
        <HelplinePopup onClose={closeHelplinePopup} />
      )}

      <SuccessMessageModal
        isOpen={showSuccessModal}
        title={t("signup_success_modal_title")}
        message={successMessage}
        onClose={handleSuccessModalClose}
      />
    </div>
  );
}

export default SignupPage;