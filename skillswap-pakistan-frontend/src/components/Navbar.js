// src/components/Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { Link, useNavigate } from 'react-router-dom';
import LogoutConfirmationModal from './LogoutConfirmationModal';

function Navbar(props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      return JSON.parse(savedMode);
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isSindhiMode, setIsSindhiMode] = useState(i18n.language === 'sd'); // New state for Sindhi mode

  const profileMenuRef = useRef(null);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Effect to update Sindhi mode based on language change
  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setIsSindhiMode(lng === 'sd');
    };
    i18n.on('languageChanged', handleLanguageChange);
    // Initial check in case component mounts after i18n is initialized
    setIsSindhiMode(i18n.language === 'sd');

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuRef]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const selectLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setShowLanguageOptions(false);
    // The useEffect above will handle setting isSindhiMode
  };

  const handleProfileClick = () => {
    setShowProfileMenu(prev => !prev);
  };

  const handleLogoutClick = () => {
    setShowProfileMenu(false);
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    props.onLogout();
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Handler for Women-Only Zone link
  const handleWomenZoneClick = (e) => {
    // Only proceed if a user is logged in
    if (props.user) {
      // Check if the user is female
      if (props.user.gender !== 'Female') {
        e.preventDefault(); // Prevent navigation for non-female users
        console.log("This is a women-only zone. You must be a female user to access it."); // Replaced alert with console.log
      }
    } else {
      e.preventDefault(); // Prevent default link navigation
      navigate('/login'); // Redirect to login page
    }
  };

  const profilePicUrl = props.user && props.user.profilePicture
    ? `http://localhost:5000/${props.user.profilePicture.replace(/\\/g, '/')}`
    : 'https://placehold.co/150x150/cccccc/ffffff?text=No+Pic';

  // Condition to check if the women-zone link should be visible
  const shouldShowWomenZone = !props.user || (props.user && props.user.gender === 'Female');

  // Define inline style for Sindhi mode background
  const sindhiNavbarStyle = isSindhiMode ? {
    backgroundImage: `url(${process.env.PUBLIC_URL}/Navbar-sindhi.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transition: 'background-image 0.5s ease-in-out',
  } : {};

  return (
    <>
      <div className="top-utility-bar">
        <div className="top-utility-bar-content">
          <div className="top-left-utility"></div>
          <div className="top-right-utility">
            <button className="utility-btn top-utility-btn dark-mode-toggle" onClick={toggleDarkMode} aria-label={t("dark_mode_toggle")}>
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              )}
            </button>
            <div className="language-selector-wrapper">
              <button className="utility-btn top-utility-btn language-toggle"
                      onClick={() => setShowLanguageOptions(prev => !prev)}
                      aria-label={t("change_language")}
                      aria-haspopup="true"
                      aria-expanded={showLanguageOptions}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-globe"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                <span className="current-lang-text">{i18n.language.toUpperCase()}</span>
              </button>
              {showLanguageOptions && (
                <div className="language-options">
                  <button onClick={() => selectLanguage('sd')} className={i18n.language === 'sd' ? 'active' : ''}>{t('lang_sd')}</button>
                  <button onClick={() => selectLanguage('ur')} className={i18n.language === 'ur' ? 'active' : ''}>{t('lang_ur')}</button>
                  <button onClick={() => selectLanguage('en')} className={i18n.language === 'en' ? 'active' : ''}>{t('lang_en')}</button>
                </div>
              )}
            </div>
            <button className="utility-btn top-utility-btn call-helpline" onClick={props.onHelplineClick} aria-label={t("call_helpline")}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </button>
          </div>
        </div>
      </div>

      <nav className={`navbar sticky-header ${isSindhiMode ? 'sindhi-navbar-mode' : ''}`} style={sindhiNavbarStyle}>
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            <img
              src="/Gadd_Kaam.jpg"
              alt="Gadd Kaam Logo"
              className="logo-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/48x48?text=GK";
              }}
            />
            <span>Gadd Kaam</span>
          </Link>

          <div className="navbar-mobile-menu-button">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="menu-button"
              aria-label="Toggle navigation"
            >
              <svg
                className="menu-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                )}
              </svg>
            </button>
          </div>

          <div className="navbar-links-desktop">
            <Link to="/marketplace" className="nav-link">{t("navbar_marketplace")}</Link>
            <Link to="/about-us" className="nav-link">{t("navbar_about_us")}</Link>
            {shouldShowWomenZone && (
              <Link to="/women-zone" className="nav-link" onClick={handleWomenZoneClick}>{t("navbar_women_zone")}</Link>
            )}
            <Link to="/contact-us" className="nav-link">{t("navbar_contact")}</Link>

            {props.user ? (
              <div className="profile-dropdown-container" ref={profileMenuRef}>
                <button className="profile-picture-button" onClick={handleProfileClick} aria-label="User Profile Menu">
                  <img
                    src={profilePicUrl}
                    alt={`${props.user.username}'s Profile`}
                    className="nav-profile-picture"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/40x40/cccccc/ffffff?text=User';
                    }}
                  />
                </button>
                {showProfileMenu && (
                  <div className="profile-dropdown-menu">
                    <Link to="/dashboard" className="dropdown-item" onClick={() => setShowProfileMenu(false)}>Dashboard</Link>
                    <button onClick={handleLogoutClick} className="dropdown-item logout-item">Log Out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-login">{t("navbar_login_btn")}</Link>
                <Link to="/signup" className="btn btn-signup">{t("navbar_signup_btn")}</Link>
              </>
            )}
          </div>
        </div>

        {isMenuOpen && (
          <div className="navbar-mobile-menu">
            <Link to="/marketplace" className="nav-link-mobile">{t("navbar_marketplace")}</Link>
            <Link to="/about-us" className="nav-link-mobile">{t("navbar_about_us")}</Link>
            {shouldShowWomenZone && (
              <Link to="/women-zone" className="nav-link-mobile" onClick={handleWomenZoneClick}>{t("navbar_women_zone")}</Link>
            )}
            <Link to="/contact-us" className="nav-link-mobile">{t("navbar_contact")}</Link>
            {props.user ? (
              <>
                <Link to="/dashboard" className="btn btn-login-mobile">Dashboard</Link>
                <button onClick={handleLogoutClick} className="btn btn-signup-mobile">Log Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-login-mobile">{t("navbar_login_btn")}</Link>
                <Link to="/signup" className="btn btn-signup-mobile">{t("navbar_signup_btn")}</Link>
              </>
            )}
          </div>
        )}
      </nav>

      <LogoutConfirmationModal
        isOpen={showLogoutConfirm}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </>
  );
}

export default Navbar;
