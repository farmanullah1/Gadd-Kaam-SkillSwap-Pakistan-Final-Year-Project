import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';
import LoadingSpinner from './LoadingSpinner';
import SuccessMessageModal from './SuccessMessageModal'; // Import SuccessMessageModal
import '../styles/marketplace.css';
import '../styles/my-skills.css'; // Import my-skills styles for dashboard layout and sidebar
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { FaPaperPlane, FaTimes } from 'react-icons/fa'; // Only FaPaperPlane and FaTimes are needed now

// Import icons from lucide-react for consistent styling
import {
  Home, User, Settings, ShoppingCart, Shield, Mail, MessageSquare, Star
} from 'lucide-react';

// Shared SkillCard component
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
          {t('offer_skill_label')} {t('by_label')} {skill.anonymous ? t('anonymous_label') : skill.username}
        </p>
        <div className="skill-card-description">{skill.description}</div>
        <div className="skill-card-tags">
          {skill.remotely && <span className="skill-card-tag">{t('remotely_label')}</span>}
          {skill.anonymous && <span className="skill-card-tag">{t('anonymous_label')}</span>}
          {skill.shareWithWomenZone && <span className="skill-card-tag">{t('women_only_zone_tag')}</span>}
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
const FullDetailsModal = ({ skill, onClose }) => {
  const { t } = useTranslation();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestSkill, setRequestSkill] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const placeholderImage = 'https://placehold.co/800x480/e0e0e0/666666?text=No+Image';
  const imageUrl = skill.photo ? `${process.env.REACT_APP_API_URL}${skill.photo}` : placeholderImage;

  const handleSendRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/requests/send`, {
        receiverId: skill.user, // ID of the user offering the skill
        skillOfferId: skill._id, // ID of the specific skill offer
        skillRequested: requestSkill
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMessage(t('request_sent_success_message'));
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Failed to send request:', err);
      setErrorMessage(t('request_sent_error_message'));
      setShowErrorModal(true);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onClose(); // Close the FullDetailsModal after success modal
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
  };

  if (!skill) return null;

  return (
    <div className="full-details-modal-overlay">
      <div className="full-details-modal-content">
        <button className="full-details-modal-close-btn" onClick={onClose}><FaTimes /></button>
        <div className="full-details-header">
          <h2 className="full-details-title">{skill.skills.join(', ')}</h2>
          <p className="full-details-author">
            {t('offer_skill_label')} {t('by_label')} {skill.anonymous ? t('anonymous_label') : skill.username}
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
          {skill.shareWithWomenZone && (
            <div className="full-details-info-box">
              <h3 className="full-details-info-label">{t('women_only_zone_tag')}</h3>
              <p className="full-details-info-value">{t('yes')}</p>
            </div>
          )}
          <div className="full-details-info-box">
            <h3 className="full-details-info-label">{t('swap_skill_label')}</h3>
            <p className="full-details-info-value">{skill.skillsToSwap.join(', ') || t('skill_not_specified')}</p>
          </div>
        </div>
        <div className="full-details-actions">
          {!showRequestForm ? (
            <button className="btn-request-offer" onClick={() => setShowRequestForm(true)}>
              <FaPaperPlane style={{ marginRight: '8px' }} /> {t('request_btn')}
            </button>
          ) : (
            <div className="request-form-section">
              <label htmlFor="requestSkillInput">{t('specify_skill_wanted_label')}</label>
              <textarea
                id="requestSkillInput"
                placeholder={t('request_skill_placeholder')}
                value={requestSkill}
                onChange={(e) => setRequestSkill(e.target.value)}
                rows="4"
              ></textarea>
              <button className="btn-send-request" onClick={handleSendRequest}>
                {t('send_request_btn')}
              </button>
            </div>
          )}
        </div>
      </div>

      {showSuccessModal && (
        <SuccessMessageModal
          isOpen={showSuccessModal}
          title={t("request_sent_success_title")}
          message={successMessage}
          onClose={handleSuccessModalClose}
        />
      )}

      {showErrorModal && (
        <SuccessMessageModal
          isOpen={showErrorModal}
          title={t("request_sent_error_title")}
          message={errorMessage}
          onClose={handleErrorModalClose}
          type="error"
        />
      )}
    </div>
  );
};


function MarketplacePage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchAllSkills();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchAllSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/skill-offers/marketplace`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSkills(response.data);
    } catch (err) {
      console.error('Failed to fetch marketplace skills:', err);
      setError(t('failed_to_load_marketplace_skills_error'));
    } finally {
      setLoading(false);
    }
  };

  const openHelplinePopup = () => setShowHelplinePopup(true);
  const closeHelplinePopup = () => setShowHelplinePopup(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  const currentPath = location.pathname;

  return (
    <div className="dashboard-page-container">
      <Navbar onHelplineClick={openHelplinePopup} onLogout={handleLogout} user={user} />

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
              {t('navbar_messages')}
            </Link>
            <Link to="/dashboard/reviews" className={`dashboard-nav-item ${currentPath === '/dashboard/reviews' ? 'active' : ''}`}>
              <Star size={20} />
              {t('navbar_reviews')}
            </Link>
          </nav>
        </aside>

        <section className="dashboard-content-area">
          <div className="marketplace-page">
            <div className="marketplace-header">
              <h1>{t('marketplace_page_title')}</h1>
              <p>{t('marketplace_page_subtitle')}</p>
            </div>
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : skills.length === 0 ? (
              <p className="no-skills-message">{t('no_skills_available')}</p>
            ) : (
              <div className="skill-card-container">
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

      <Footer onChatbotToggle={onChatbotToggle} user={user} />

      {showHelplinePopup && (
        <HelplinePopup onClose={closeHelplinePopup} />
      )}

      {selectedSkill && (
        <FullDetailsModal
          skill={selectedSkill}
          onClose={() => setSelectedSkill(null)}
        />
      )}
    </div>
  );
}

export default MarketplacePage;