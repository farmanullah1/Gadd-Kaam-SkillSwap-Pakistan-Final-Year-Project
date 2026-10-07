import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';
import { useTranslation } from 'react-i18next'; // Import useTranslation

// Import icons from lucide-react for consistent styling
import {
  Home, User, Settings, ShoppingCart, Shield, Mail, MessageSquare, Star
} from 'lucide-react'; // Added MessageSquare and Star

// Accept onChatbotToggle as a prop
function DashboardPage({ onChatbotToggle }) {
  const { t } = useTranslation(); // Initialize the translation hook
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

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

  const currentPath = location.pathname;

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-page-container">
      <Navbar onHelplineClick={openHelplinePopup} onLogout={handleLogout} user={user} />

      <div className="dashboard-main-content">
        <aside className="dashboard-sidebar">
          <nav className="dashboard-nav">
            <Link to="/dashboard" className={`dashboard-nav-item ${currentPath === '/dashboard' ? 'active' : ''}`}>
              <Home size={20} /> {/* Replaced SVG with Lucide React Home icon */}
              {t('navbar_dashboard')}
            </Link>
            <Link to="/dashboard/profile" className={`dashboard-nav-item ${currentPath === '/dashboard/profile' ? 'active' : ''}`}>
              <User size={20} /> {/* Replaced SVG with Lucide React User icon */}
              {t('navbar_my_profile')}
            </Link>
            <Link to="/dashboard/my-skills" className={`dashboard-nav-item ${currentPath === '/dashboard/my-skills' ? 'active' : ''}`}>
              <Settings size={20} /> {/* Replaced SVG with Lucide React Settings icon (wrench) */}
              {t('navbar_my_skills')}
            </Link>
            <Link to="/marketplace" className={`dashboard-nav-item ${currentPath === '/marketplace' ? 'active' : ''}`}>
              <ShoppingCart size={20} /> {/* Replaced SVG with Lucide React ShoppingCart icon */}
              {t('navbar_marketplace')}
            </Link>
            {user.gender === 'Female' && (
              <Link to="/women-zone" className={`dashboard-nav-item ${currentPath === '/women-zone' ? 'active' : ''}`}>
                <Shield size={20} /> {/* Replaced SVG with Lucide React Shield icon */}
                {t('navbar_women_zone')}
              </Link>
            )}
            <Link to="/dashboard/received-requests" className={`dashboard-nav-item ${currentPath === '/dashboard/received-requests' ? 'active' : ''}`}>
              <Mail size={20} /> {/* Replaced SVG with Lucide React Mail icon */}
              {t('received_requests_page_title')}
            </Link>
            {/* New Links for Messages and Reviews */}
            <Link to="/dashboard/messages" className={`dashboard-nav-item ${currentPath === '/dashboard/messages' ? 'active' : ''}`}>
              <MessageSquare size={20} /> {/* Lucide React MessageSquare icon */}
              {t('Messages')}
            </Link>
            <Link to="/dashboard/reviews" className={`dashboard-nav-item ${currentPath === '/dashboard/reviews' ? 'active' : ''}`}>
              <Star size={20} /> {/* Lucide React Star icon */}
              {t('Reviews')}
            </Link>
          </nav>
        </aside>

        <section className="dashboard-content-area">
          <h1 className="dashboard-welcome-heading">
            {t('dashboard_welcome_heading', { username: user.username })}
          </h1>
          <p className="dashboard-sub-heading">
            {t('dashboard_sub_heading')}
          </p>

          <div className="dashboard-summary-grid">
            <div className="summary-card">
              <div className="summary-icon check-icon">
                {/* Ensure these summary icons are also consistent if they are meant to be */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-8.5"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <h3 className="summary-title">{t('skills_offered_title')}</h3>
              <p className="summary-value">0</p>
              <p className="summary-detail">{t('skills_offered_detail')}</p>
            </div>

            <div className="summary-card">
              <div className="summary-icon star-icon">
                {/* This icon is already consistent (feather-star is Star in Lucide) */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </div>
              <h3 className="summary-title">{t('skills_received_title')}</h3>
              <p className="summary-value">0</p>
              <p className="summary-detail">{t('skills_received_detail')}</p>
            </div>

            <div className="summary-card">
              <div className="summary-icon message-icon">
                {/* This icon is already consistent (feather-message-square is MessageSquare in Lucide) */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <h3 className="summary-title">{t('unread_messages_title')}</h3>
              <p className="summary-value">0</p>
              <p className="summary-detail">{t('unread_messages_detail')}</p>
            </div>
          </div>

          <div className="dashboard-action-cards">
            <div className="action-card">
              <div className="action-icon search-icon">
                {/* Ensure these action card icons are also consistent if they are meant to be */}
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <h3 className="action-title">{t('find_skill_title')}</h3>
              <p className="action-description">{t('find_skill_description')}</p>
              <Link to="/marketplace" className="btn btn-primary-orange action-button">
                {t('browse_marketplace_btn')} <span className="arrow-right">→</span>
              </Link>
            </div>

            <div className="action-card">
              <div className="action-icon plus-icon">
                {/* Ensure these action card icons are also consistent if they are meant to be */}
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
              </div>
              <h3 className="action-title">{t('offer_skill_title_card')}</h3>
              <p className="action-description">{t('offer_skill_description_card')}</p>
              <Link to="/offer-skill" className="btn btn-primary-orange action-button">
                {t('post_new_skill_btn')} <span className="arrow-right">→</span>
              </Link>
            </div>
          </div>
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

export default DashboardPage;
