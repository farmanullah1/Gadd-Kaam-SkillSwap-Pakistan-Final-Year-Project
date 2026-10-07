import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bell, Menu, X, Globe, Moon, Sun, Phone, LogOut, LayoutDashboard, User } from 'lucide-react'; 
import LogoutConfirmationModal from './LogoutConfirmationModal';
import NotificationDropdown from './NotificationDropdown';
import '../styles/navbar.css';
import '../styles/notifications.css';

function Navbar(props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false); // New State for Sticky
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isSindhiMode, setIsSindhiMode] = useState(i18n.language === 'sd');
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const profileMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const languageRef = useRef(null);

  // --- SCROLL HANDLER FOR STICKY NAVBAR ---
  useEffect(() => {
    const handleScroll = () => {
      // If user scrolls past 40px (height of utility bar), make navbar sticky
      if (window.scrollY > 40) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Poll for notifications
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!props.user) return;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/notifications?page=1`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUnreadCount(res.data.unreadCount);
      } catch (e) { }
    };

    if (props.user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 15000); 
      return () => clearInterval(interval);
    }
  }, [props.user]);

  useEffect(() => {
    if (isDarkMode) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    const handleLanguageChange = (lng) => setIsSindhiMode(lng === 'sd');
    i18n.on('languageChanged', handleLanguageChange);
    setIsSindhiMode(i18n.language === 'sd');
    return () => i18n.off('languageChanged', handleLanguageChange);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) setShowProfileMenu(false);
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setShowNotifications(false);
      if (languageRef.current && !languageRef.current.contains(event.target)) setShowLanguageOptions(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode);
  const selectLanguage = (langCode) => { i18n.changeLanguage(langCode); setShowLanguageOptions(false); };
  const handleProfileClick = () => setShowProfileMenu(prev => !prev);
  const handleLogoutClick = () => { setShowProfileMenu(false); setIsMenuOpen(false); setShowLogoutConfirm(true); };
  const confirmLogout = () => { props.onLogout(); setShowLogoutConfirm(false); };
  const cancelLogout = () => setShowLogoutConfirm(false);

  const handleWomenZoneClick = (e) => {
    if (props.user && props.user.gender !== 'Female') {
        e.preventDefault();
        alert("This is a women-only zone. You must be a female user to access it.");
    } else if (!props.user) {
        e.preventDefault();
        navigate('/login');
    }
    setIsMenuOpen(false);
  };

  const getProfileUrl = () => {
    if (props.user && props.user.profilePicture) {
        if(props.user.profilePicture.startsWith('http')) return props.user.profilePicture;
        return `${process.env.REACT_APP_API_URL}/${props.user.profilePicture.replace(/\\/g, '/')}`;
    }
    return 'https://placehold.co/150x150/cccccc/ffffff?text=User';
  };

  const shouldShowWomenZone = !props.user || (props.user && props.user.gender === 'Female');
  
  const sindhiNavbarStyle = isSindhiMode ? {
    backgroundImage: `url(/Navbar-sindhi.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } : {};

  return (
    <>
      {/* 1. TOP UTILITY BAR (Scrolls Away) */}
      <div className="top-utility-bar">
        <div className="top-utility-content">
          <div className="utility-actions">
            <button className="utility-btn" onClick={toggleDarkMode} title="Toggle Theme">
              {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            <div className="language-wrapper" ref={languageRef}>
              <button className="utility-btn lang-btn" onClick={() => setShowLanguageOptions(!showLanguageOptions)}>
                <Globe size={16} />
                <span>{i18n.language.toUpperCase()}</span>
              </button>
              {showLanguageOptions && (
                <div className="language-dropdown">
                  <button onClick={() => selectLanguage('en')}>English</button>
                  <button onClick={() => selectLanguage('ur')}>Urdu</button>
                  <button onClick={() => selectLanguage('sd')}>Sindhi</button>
                </div>
              )}
            </div>

            <button className="utility-btn helpline-btn" onClick={props.onHelplineClick} title="Helpline">
              <Phone size={16} />
              <span>Helpline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Placeholder div to prevent content jumping when navbar becomes fixed 
         It only renders height when isSticky is true
      */}
      <div style={{ height: isSticky ? '70px' : '0' }}></div>

      {/* 2. MAIN NAVBAR (Becomes Fixed on Scroll) */}
      <nav 
        className={`main-navbar ${isSticky ? 'fixed-nav' : ''} ${isSindhiMode ? 'sindhi-mode' : ''}`} 
        style={sindhiNavbarStyle}
      >
        <div className="navbar-container">
          
          {/* Logo */}
          <Link to="/" className="navbar-brand" onClick={() => setIsMenuOpen(false)}>
            <img src="/Gadd_Kaam.jpg" alt="Gadd Kaam" className="brand-logo" onError={(e) => {e.target.onerror=null; e.target.src="https://placehold.co/40x40?text=GK";}} />
            <span className="brand-text">Gadd Kaam</span>
          </Link>

          {/* Mobile Menu Button */}
          <div className="navbar-mobile-toggle">
            {props.user && (
               <Link to="/dashboard/profile" className="mobile-profile-icon">
                  <img src={getProfileUrl()} alt="Profile" />
               </Link>
            )}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="menu-button">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="navbar-menu-desktop">
            <Link to="/marketplace" className="nav-item">{t("navbar_marketplace")}</Link>
            {shouldShowWomenZone && (
               <Link to="/women-zone" className="nav-item" onClick={handleWomenZoneClick}>{t("navbar_women_zone")}</Link>
            )}
            <Link to="/about" className="nav-item">{t("navbar_about_us")}</Link>
            <Link to="/contact" className="nav-item">{t("navbar_contact")}</Link>
          </div>

          {/* Desktop Actions */}
          <div className="navbar-actions-desktop">
            {props.user ? (
              <>
                <div className="notification-container" ref={notificationRef}>
                  <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
                    <Bell size={22} />
                    {unreadCount > 0 && <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                  </button>
                  {showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
                </div>

                <div className="profile-container" ref={profileMenuRef}>
                  <button className="profile-btn" onClick={handleProfileClick}>
                    <img src={getProfileUrl()} alt="Profile" />
                  </button>
                  {showProfileMenu && (
                    <div className="dropdown-menu">
                      <div className="dropdown-header">
                        <span className="user-name">Hi, {props.user.firstName}</span>
                      </div>
                      <Link to="/dashboard" className="dropdown-link" onClick={() => setShowProfileMenu(false)}>
                        <LayoutDashboard size={16}/> Dashboard
                      </Link>
                      <Link to="/dashboard/profile" className="dropdown-link" onClick={() => setShowProfileMenu(false)}>
                        <User size={16}/> My Profile
                      </Link>
                      <button onClick={handleLogoutClick} className="dropdown-link logout">
                        <LogOut size={16}/> Log Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-login">{t("navbar_login_btn")}</Link>
                <Link to="/signup" className="btn btn-signup">{t("navbar_signup_btn")}</Link>
              </div>
            )}
          </div>
        </div>

        {/* 3. MOBILE MENU OVERLAY */}
        <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            <Link to="/marketplace" className="mobile-link" onClick={() => setIsMenuOpen(false)}>{t("navbar_marketplace")}</Link>
            {shouldShowWomenZone && (
               <Link to="/women-zone" className="mobile-link" onClick={(e) => {handleWomenZoneClick(e); setIsMenuOpen(false);}}>{t("navbar_women_zone")}</Link>
            )}
            <Link to="/about" className="mobile-link" onClick={() => setIsMenuOpen(false)}>{t("navbar_about_us")}</Link>
            <Link to="/contact" className="mobile-link" onClick={() => setIsMenuOpen(false)}>{t("navbar_contact")}</Link>
            
            <div className="mobile-divider"></div>

            {props.user ? (
              <>
                <Link to="/dashboard" className="mobile-link highlight" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                <Link to="/dashboard/profile" className="mobile-link" onClick={() => setIsMenuOpen(false)}>My Profile</Link>
                <button className="mobile-link logout" onClick={handleLogoutClick}>Log Out</button>
              </>
            ) : (
              <div className="mobile-auth">
                <Link to="/login" className="btn btn-login-mobile" onClick={() => setIsMenuOpen(false)}>{t("navbar_login_btn")}</Link>
                <Link to="/signup" className="btn btn-signup-mobile" onClick={() => setIsMenuOpen(false)}>{t("navbar_signup_btn")}</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <LogoutConfirmationModal isOpen={showLogoutConfirm} onConfirm={confirmLogout} onCancel={cancelLogout} />
    </>
  );
}

export default Navbar;