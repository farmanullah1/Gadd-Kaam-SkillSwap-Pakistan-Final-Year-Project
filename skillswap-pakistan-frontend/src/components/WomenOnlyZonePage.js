// src/components/WomenOnlyZonePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';
import LoadingSpinner from './LoadingSpinner';
import '../styles/marketplace.css';
import '../styles/my-skills.css';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';

// SkillCard component
const SkillCard = ({ skill, onViewDetails }) => {
  const { t } = useTranslation();
  const placeholderImage = 'https://placehold.co/400x240/e0e0e0/666666?text=No+Image';
  const imageUrl = skill.photo ? `${process.env.REACT_APP_API_URL}${skill.photo}` : placeholderImage;

  return (
    <div className="skill-card">
      <div className="skill-card-image-wrapper">
        <img
          src={imageUrl}
          alt={skill.skills.join(', ')}
          className="skill-card-image"
          onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }}
        />
      </div>
      <div className="skill-card-content">
        <h3 className="skill-card-title">{skill.skills.join(', ')}</h3>
        <p className="skill-card-author">
          {t('offer_skill_label')} by {skill.anonymous ? t('anonymous_label') : skill.username}
        </p>
        <p className="skill-card-description">{skill.description}</p>
        <div className="skill-card-tags">
          {skill.remotely && <span className="skill-card-tag">{t('remotely_label')}</span>}
          {skill.anonymous && <span className="skill-card-tag">{t('anonymous_label')}</span>}
          <span className="skill-card-tag">{t('step2_women_zone_switch')}</span>
        </div>
        <div className="skill-card-actions">
          <button className="btn-view-details" onClick={() => onViewDetails(skill)}>
            {t('view_full_details_btn')}
          </button>
        </div>
      </div>
    </div>
  );
};

// FullDetailsModal component
const FullDetailsModal = ({ skill, onClose, onRequest }) => {
  const { t } = useTranslation();
  const placeholderImage = 'https://placehold.co/800x480/e0e0e0/666666?text=No+Image';
  const imageUrl = skill.photo ? `${process.env.REACT_APP_API_URL}${skill.photo}` : placeholderImage;

  if (!skill) return null;

  return (
    <div className="full-details-modal-overlay">
      <div className="full-details-modal-content">
        <button className="full-details-modal-close-btn" onClick={onClose}><FaTimes /></button>
        <div className="full-details-header">
          <h2 className="full-details-title">{skill.skills.join(', ')}</h2>
          <p className="full-details-author">
            {t('offer_skill_label')} by {skill.anonymous ? t('anonymous_label') : skill.username}
          </p>
        </div>
        <img
          src={imageUrl}
          alt={skill.skills.join(', ')}
          className="full-details-image"
          onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }}
        />
        <div className="full-details-grid">
          <div className="full-details-info-box full-details-description-box">
            <h3 className="full-details-info-label">{t('description_label')}</h3>
            <p className="full-details-info-value">{skill.description}</p>
          </div>
          {!skill.anonymous && (
            <div className="full-details-info-box">
              <h3 className="full-details-info-label">{t('location_label')}</h3>
              <p className="full-details-info-value">{skill.location || t('not_specified')}</p>
            </div>
          )}
          <div className="full-details-info-box">
            <h3 className="full-details-info-label">{t('remotely_label')}</h3>
            <p className="full-details-info-value">{skill.remotely ? t('yes') : t('no')}</p>
          </div>
          <div className="full-details-info-box">
            <h3 className="full-details-info-label">{t('anonymous_label')}</h3>
            <p className="full-details-info-value">{skill.anonymous ? t('yes') : t('no')}</p>
          </div>
          <div className="full-details-info-box">
            <h3 className="full-details-info-label">{t('step2_women_zone_switch')}</h3>
            <p className="full-details-info-value">{t('yes')}</p>
          </div>
          <div className="full-details-info-box">
            <h3 className="full-details-info-label">{t('swap_skill_label')}</h3>
            <p className="full-details-info-value">{skill.skillsToSwap.join(', ') || t('skill_not_specified')}</p>
          </div>
          {!skill.anonymous && (
            <div className="full-details-info-box">
              <h3 className="full-details-info-label">{t('phone_label')}</h3>
              <p className="full-details-info-value">{skill.phoneNumber || t('not_specified')}</p>
            </div>
          )}
        </div>
        <div className="full-details-actions">
          <button className="btn-request-offer" onClick={() => onRequest(skill)}>
            <FaPaperPlane style={{ marginRight: '8px' }} /> {t('request_btn')}
          </button>
        </div>
      </div>
    </div>
  );
};

// ... (The rest of the WomenOnlyZonePage.js component remains the same)
function WomenOnlyZonePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation(); // Added useLocation hook
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.gender !== 'Female') {
        alert('Access Denied: This zone is for female users only.');
        navigate('/marketplace');
      } else {
        fetchWomenOnlySkills();
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchWomenOnlySkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/skill-offers/women-only`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSkills(response.data);
    } catch (err) {
      console.error('Failed to fetch women-only skills:', err);
      setError('Failed to load women-only skills. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOffer = (skill) => {
    alert(`You are requesting the skill: "${skill.skills.join(', ')}" from "${skill.username}".`);
  };

  const openHelplinePopup = () => setShowHelplinePopup(true);
  const closeHelplinePopup = () => setShowHelplinePopup(false);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  if (!user || user.gender !== 'Female') {
    return null;
  }

  const currentPath = location.pathname; // Get current path

  return (
    <div className="dashboard-page-container">
      <Navbar onHelplineClick={openHelplinePopup} onLogout={handleLogout} user={user} />

      <div className="dashboard-main-content">
        <aside className="dashboard-sidebar">
          <nav className="dashboard-nav">
            <Link to="/dashboard" className={`dashboard-nav-item ${currentPath === '/dashboard' ? 'active' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              Dashboard
            </Link>
            <Link to="/dashboard/profile" className={`dashboard-nav-item ${currentPath === '/dashboard/profile' ? 'active' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Profile
            </Link>
            <Link to="/dashboard/my-skills" className={`dashboard-nav-item ${currentPath === '/dashboard/my-skills' ? 'active' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-tool"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z"></path></svg>
              My Skills
            </Link>
            <Link to="/marketplace" className={`dashboard-nav-item ${currentPath === '/marketplace' ? 'active' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-shopping-bag"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              Marketplace
            </Link>
            {user.gender === 'Female' && (
              <Link to="/women-zone" className={`dashboard-nav-item ${currentPath === '/women-zone' ? 'active' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-shield"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                Women's Zone
              </Link>
            )}
            <Link to="/dashboard/received-requests" className={`dashboard-nav-item ${currentPath === '/dashboard/received-requests' ? 'active' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              Received Requests
            </Link>
          </nav>
        </aside>

        <section className="dashboard-content-area">
          <div className="women-only-zone-page">
            <div className="women-only-zone-header">
              <h1>{t('women_only_zone_page_title')}</h1>
              <p>{t('women_only_zone_page_subtitle')}</p>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : skills.length === 0 ? (
              <p className="no-skills-message">{t('no_women_zone_skills_available')}</p>
            ) : (
              <div className="women-only-skill-card-container">
                {skills.map((skill) => (
                  <SkillCard
                    key={skill._id}
                    skill={skill}
                    onViewDetails={setSelectedSkill}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
      
      {showHelplinePopup && (
        <HelplinePopup onClose={closeHelplinePopup} />
      )}

      {selectedSkill && (
        <FullDetailsModal
          skill={selectedSkill}
          onClose={() => setSelectedSkill(null)}
          onRequest={handleRequestOffer}
        />
      )}
    </div>
  );
}

export default WomenOnlyZonePage;