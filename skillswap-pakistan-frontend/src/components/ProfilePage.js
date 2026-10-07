// src/components/ProfilePage.js

import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';
import '../styles/profile.css';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; // Import useTranslation

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

  const defaultProfilePicture = 'https://placehold.co/150x150/cccccc/ffffff?text=No+Pic';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      console.log('User data from localStorage:', parsedUser);

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
          
          // --- BEGIN DEBUGGING LOGS ---
          console.log("Saving changes...");
          console.log("Location value being sent:", locationValue);
          console.log("About Me value being sent:", aboutMe);
          console.log("Profile picture is a new file:", profilePicture instanceof File);
          // You can also loop through the FormData to see what's inside
          for (let pair of formData.entries()) {
              console.log(pair[0] + ': ' + pair[1]);
          }
          // --- END DEBUGGING LOGS ---

          const response = await axios.put('http://localhost:5000/api/profile/update', formData, {
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  // Axios automatically sets 'Content-Type' to 'multipart/form-data'
                  // with the correct boundary when you pass a FormData object.
                  // Manually setting it can sometimes cause issues.
              }
          });
          
          console.log("Profile updated successfully:", response.data);
          
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
              console.error("Error response headers:", error.response.headers);
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
          return `http://localhost:5000/${user.profilePicture.replace(/\\/g, '/')}`;
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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              {t('navbar_dashboard')}
            </Link>
            <Link to="/dashboard/profile" className={`dashboard-nav-item ${currentPath === '/dashboard/profile' ? 'active' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              {t('navbar_my_profile')}
            </Link>
            <Link to="/dashboard/my-skills" className={`dashboard-nav-item ${currentPath === '/dashboard/my-skills' ? 'active' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-tool"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z"></path></svg>
              {t('navbar_my_skills')}
            </Link>
            <Link to="/marketplace" className={`dashboard-nav-item ${currentPath === '/marketplace' ? 'active' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-shopping-bag"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              {t('navbar_marketplace')}
            </Link>
            {user.gender === 'Female' && (
              <Link to="/women-only-zone" className={`dashboard-nav-item ${currentPath === '/women-only-zone' ? 'active' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-shield"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                {t('navbar_women_zone')}
              </Link>
            )}
            <Link to="/dashboard/received-requests" className={`dashboard-nav-item ${currentPath === '/dashboard/received-requests' ? 'active' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              {t('received_requests_page_title')}
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
