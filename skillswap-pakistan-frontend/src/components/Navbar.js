// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n'; // Import i18n instance
import { Link } from 'react-router-dom'; // Import Link for navigation

// Navbar now accepts a prop 'onHelplineClick'
function Navbar(props) { // Added 'props' to the function signature
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      return JSON.parse(savedMode);
    }
    // Default to dark mode if user's system prefers it
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const selectLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setShowLanguageOptions(false);
  };

  return (
    <>
      {/* Top Bar for Utility Buttons */}
      <div className="top-utility-bar">
        <div className="top-utility-bar-content">
          <div className="top-left-utility"></div>
          <div className="top-right-utility">
            {/* Dark Mode Toggle */}
            <button className="utility-btn top-utility-btn dark-mode-toggle" onClick={toggleDarkMode} aria-label={t("dark_mode_toggle")}>
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              )}
            </button>
            {/* Language Change Button with Dropdown */}
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
            {/* Phone Call Button - Now correctly calls the prop function */}
            <button className="utility-btn top-utility-btn call-helpline" onClick={props.onHelplineClick} aria-label={t("call_helpline")}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="navbar sticky-header">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo"> {/* Link to homepage */}
            <img
              src="/Gadd_Kaam.jpg"
              alt="Gadd Kaam Logo"
              className="logo-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/48x48?text=GK";
              }}
            />
            Gadd Kaam
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
            <Link to="/" className="nav-link">{t("navbar_marketplace")}</Link>
            <Link to="/about" className="nav-link">{t("navbar_about_us")}</Link>
            <Link to="/women-zone" className="nav-link">{t("navbar_women_zone")}</Link>
            <Link to="/contact" className="nav-link">{t("navbar_contact")}</Link>
            <Link to="/login" className="btn btn-login">{t("navbar_login_btn")}</Link>
            <Link to="/signup" className="btn btn-signup">{t("navbar_signup_btn")}</Link>
          </div>
        </div>

        {isMenuOpen && (
          <div className="navbar-mobile-menu">
            <Link to="/" className="nav-link-mobile">{t("navbar_marketplace")}</Link>
            <Link to="/about" className="nav-link-mobile">{t("navbar_about_us")}</Link>
            <Link to="/women-zone" className="nav-link-mobile">{t("navbar_women_zone")}</Link>
            <Link to="/contact" className="nav-link-mobile">{t("navbar_contact")}</Link>
            <Link to="/login" className="btn btn-login-mobile">{t("navbar_login_btn")}</Link>
            <Link to="/signup" className="btn btn-signup-mobile">{t("navbar_signup_btn")}</Link>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;