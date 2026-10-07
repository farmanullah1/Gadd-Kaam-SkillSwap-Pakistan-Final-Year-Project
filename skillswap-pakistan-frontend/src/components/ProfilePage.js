// skillswap-pakistan-frontend/src/components/ProfilePage.js

import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';
import '../styles/profile.css';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; // Import useTranslation

// Import icons from lucide-react for consistent styling
import {
  Home, User, Settings, ShoppingCart, Shield, Mail, MessageSquare, Star as StarIcon, Award // Added Award for badges
} from 'lucide-react';

// Accept onChatbotToggle as a prop
function ProfilePage({ onChatbotToggle }) {
  const { t } = useTranslation(); // Initialize the translation hook
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [initialState, setInitialState] = useState({
    location: '',
    aboutMe: '',
    profilePicture: null
  });

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [locationValue, setLocationValue] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [earnedBadges, setEarnedBadges] = useState([]); // NEW: State for earned badges

  const defaultProfilePicture = 'https://placehold.co/150x150/cccccc/ffffff?text=No+Pic';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      const userLocation = parsedUser.location || '';
      const userAboutMe = parsedUser.aboutMe || '';
      const userPhoneNumber = parsedUser.phoneNumber || '';
      const userProfilePicture = parsedUser.profilePicture || null;

      setFullName(`${parsedUser.firstName} ${parsedUser.lastName}`);
      setEmail(parsedUser.email);
      setPhoneNumber(userPhoneNumber);
      setLocationValue(userLocation);
      setAboutMe(userAboutMe);
      setProfilePicture(userProfilePicture);

      setInitialState({
          location: userLocation,
          aboutMe: userAboutMe,
          profilePicture: userProfilePicture
      });

      // NEW: Fetch user's badges
      fetchUserBadges(parsedUser.id);

    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
      const hasChanged = locationValue !== initialState.location ||
                         aboutMe !== initialState.aboutMe ||
                         profilePicture instanceof File;
      setIsEditing(hasChanged);
  }, [locationValue, aboutMe, profilePicture, initialState]);

  // NEW FUNCTION: Fetch user's badges
  const fetchUserBadges = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      // Fetch user profile with populated badges.
      // This assumes your /api/auth/me or a new dedicated profile endpoint
      // is updated to populate the 'badges' field.
      // For this example, we'll assume /api/auth/me returns populated badges.
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.user && response.data.user.badges) {
        setEarnedBadges(response.data.user.badges);
      }
    } catch (err) {
      console.error('Failed to fetch user badges:', err);
    }
  };


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

  const handleDiscardChanges = () => {
    if (user) {
        setLocationValue(initialState.location);
        setAboutMe(initialState.aboutMe);
        setProfilePicture(initialState.profilePicture);
    }
  };

  const handleSaveChanges = async (e) => {
      e.preventDefault();
      try {
          const formData = new FormData();
          formData.append('location', locationValue);
          formData.append('aboutMe', aboutMe);
          if (profilePicture instanceof File) {
              formData.append('profilePicture', profilePicture);
          }

          const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/profile/update`, formData, {
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
              }
          });

          const updatedUser = {
              ...user,
              location: response.data.location,
              aboutMe: response.data.aboutMe,
              profilePicture: response.data.profilePicture
          };

          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));

          setInitialState({
              location: updatedUser.location,
              aboutMe: updatedUser.aboutMe,
              profilePicture: updatedUser.profilePicture
          });
          setIsEditing(false);

      } catch (error) {
          console.error("Error updating profile:", error);
          if (error.response) {
              console.error("Error response data:", error.response.data);
              console.error("Error response status:", error.response.status);
          }
      }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
    }
  };

  if (!user) {
    return null;
  }

  const currentPath = location.pathname;

  const getProfilePictureUrl = (user, profilePictureState) => {
      if (profilePictureState instanceof File) {
          return URL.createObjectURL(profilePictureState);
      }
      if (user && user.profilePicture) {
          return `${process.env.REACT_APP_API_URL}/${user.profilePicture.replace(/\\/g, '/')}`;
      }
      return defaultProfilePicture;
  };

  return (
    <div className="dashboard-page-container">
      <Navbar onHelplineClick={openHelplinePopup} onLogout={handleLogout} user={user} profilePictureUrl={getProfilePictureUrl(user, profilePicture)} />

      <div className="dashboard-main-content">
        <aside className="dashboard-sidebar">
          <nav className="dashboard-nav">
            <Link to="/dashboard" className={`dashboard-nav-item ${currentPath === '/dashboard' ? 'active' : ''}`}>
              <Home size={20} />
              {t('navbar_dashboard')}
            </Link>
            <Link to="/dashboard/profile" className={`dashboard-nav-item ${currentPath === '/dashboard/profile' ? 'active' : ''}`}>
              <User size={20} />
              {t('navbar_my_profile')}
            </Link>
            <Link to="/dashboard/my-skills" className={`dashboard-nav-item ${currentPath === '/dashboard/my-skills' ? 'active' : ''}`}>
              <Settings size={20} />
              {t('navbar_my_skills')}
            </Link>
            <Link to="/marketplace" className={`dashboard-nav-item ${currentPath === '/marketplace' ? 'active' : ''}`}>
              <ShoppingCart size={20} />
              {t('navbar_marketplace')}
            </Link>
            {user.gender === 'Female' && (
              <Link to="/women-zone" className={`dashboard-nav-item ${currentPath === '/women-zone' ? 'active' : ''}`}>
                <Shield size={20} />
                {t('navbar_women_zone')}
              </Link>
            )}
            <Link to="/dashboard/received-requests" className={`dashboard-nav-item ${currentPath === '/dashboard/received-requests' ? 'active' : ''}`}>
              <Mail size={20} />
              {t('received_requests_page_title')}
            </Link>
            {/* New Links for Messages and Reviews */}
            <Link to="/dashboard/messages" className={`dashboard-nav-item ${currentPath === '/dashboard/messages' ? 'active' : ''}`}>
              <MessageSquare size={20} />
              {t('Messages')}
            </Link>
            <Link to="/dashboard/reviews" className={`dashboard-nav-item ${currentPath === '/dashboard/reviews' ? 'active' : ''}`}>
              <StarIcon size={20} />
              {t('Reviews')}
            </Link>
          </nav>
        </aside>

        <section className="dashboard-content-area">
          <h1 className="profile-heading">{t('profile_page_title')}</h1>
          <form className="profile-form" onSubmit={handleSaveChanges}>
            <div className="profile-header-card">
              <img
                src={getProfilePictureUrl(user, profilePicture)}
                alt="Profile"
                className="profile-image"
              />
              <div className="profile-info-text">
                <h3 className="profile-name">{user.firstName} {user.lastName}</h3>
                <p className="profile-update-prompt">{t('profile_update_prompt')}</p>
              </div>
              <label htmlFor="profile-picture-input" className="btn btn-secondary-outline change-picture-btn">
                {t('change_picture_btn')}
                <input
                  id="profile-picture-input"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <div className="profile-details-grid">
              <div className="form-group-readonly">
                <label htmlFor="fullName">{t('full_name_label')}</label>
                <input type="text" id="fullName" value={fullName} readOnly />
              </div>

              <div className="form-group-readonly">
                <label htmlFor="emailAddress">{t('email_address_label')}</label>
                <input type="email" id="emailAddress" value={email} readOnly />
              </div>

              <div className="form-group-readonly">
                <label htmlFor="phoneNumber">{t('phone_number_label')}</label>
                <input type="tel" id="phoneNumber" value={phoneNumber} readOnly />
              </div>

              <div className="form-group">
                <label htmlFor="location">{t('location_label')}</label>
                <input
                  type="text"
                  id="location"
                  value={locationValue}
                  onChange={(e) => setLocationValue(e.target.value)}
                />
              </div>

              <div className="form-group-full-width">
                <label htmlFor="aboutMe">{t('about_me_label')}</label>
                <textarea
                  id="aboutMe"
                  value={aboutMe}
                  onChange={(e) => setAboutMe(e.target.value)}
                  rows="5"
                  className="about-me-textarea"
                ></textarea>
              </div>
            </div>

            {isEditing && (
              <div className="profile-action-buttons">
                  <button type="button" className="btn btn-secondary-outline" onClick={handleDiscardChanges}>{t('discard_changes_btn')}</button>
                  <button type="submit" className="btn btn-primary-orange">{t('save_changes_btn')}</button>
              </div>
            )}
          </form>

          {/* NEW SECTION: Display Badges */}
          {earnedBadges.length > 0 && (
            <div className="profile-badges-section">
              <h2>{t('my_badges_title')}</h2>
              <div className="badges-grid">
                {earnedBadges.map(badge => (
                  <div key={badge._id} className="badge-item">
                    {/* Render Lucide icon dynamically */}
                    {React.createElement(
                        // Dynamically get the Lucide icon component
                        (require('lucide-react'))[badge.icon] || Award, // Fallback to Award if icon not found
                        { size: 32, className: "badge-icon" }
                    )}
                    <span className="badge-name">{badge.name}</span>
                    <p className="badge-description">{badge.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>
      </div>

      {/* Pass onChatbotToggle to the Footer component */}
      <Footer onChatbotToggle={onChatbotToggle} />

      {showHelplinePopup && (
        <HelplinePopup onClose={closeHelplinePopup} />
      )}
    </div>
  );
}

export default ProfilePage;