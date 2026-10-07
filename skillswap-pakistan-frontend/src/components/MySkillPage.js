import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';
import LoadingSpinner from './LoadingSpinner';
import SuccessMessageModal from './SuccessMessageModal'; // Import SuccessMessageModal
import '../styles/my-skills.css';
import '../styles/marketplace.css';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { FaTrashAlt, FaEdit, FaTimes } from 'react-icons/fa';

// Import icons from lucide-react for consistent styling
import {
  Home, User, Settings, ShoppingCart, Shield, Mail, MessageSquare, Star
} from 'lucide-react'; // Added MessageSquare and Star

// Shared SkillCard component
const SkillCard = ({ skill, onViewDetails, onDeleteOffer }) => {
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
        <p className="skill-card-author">{t('offer_skill_label')}</p>
        <p className="skill-card-description">{skill.description}</p>
        <div className="skill-card-tags">
          {skill.remotely && <span className="skill-card-tag">{t('remotely_label')}</span>}
          {skill.anonymous && <span className="skill-card-tag">{t('anonymous_label')}</span>}
          {skill.shareWithWomenZone && <span className="skill-card-tag">{t('step2_women_zone_switch')}</span>}
        </div>
        <div className="skill-card-actions">
          <button className="btn-view-details" onClick={() => onViewDetails(skill)}>
            {t('view_full_details_btn')}
          </button>
          <button className="btn-delete-offer" onClick={() => onDeleteOffer(skill._id)}>
            <FaTrashAlt />
          </button>
        </div>
      </div>
    </div>
  );
};

// FullDetailsModal component
const FullDetailsModal = ({ skill, onClose, onDelete }) => {
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
          <div className="full-details-info-box">
            <h3 className="full-details-info-label">{t('location_label')}</h3>
            <p className="full-details-info-value">{skill.location || t('not_specified')}</p>
          </div>
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
              <h3 className="full-details-info-label">{t('step2_women_zone_switch')}</h3>
              <p className="full-details-info-value">{skill.shareWithWomenZone ? t('yes') : t('no')}</p>
            </div>
          )}
          <div className="full-details-info-box">
            <h3 className="full-details-info-label">{t('swap_skill_label')}</h3>
            <p className="full-details-info-value">{skill.skillsToSwap.join(', ') || t('skill_not_specified')}</p>
          </div>
          <div className="full-details-info-box">
            <h3 className="full-details-info-label">{t('phone_label')}</h3>
            <p className="full-details-info-value">{skill.phoneNumber || t('not_specified')}</p>
          </div>
        </div>
        <div className="full-details-actions">
          <button className="btn-delete-offer" onClick={() => onDelete(skill._id)}>
            <FaTrashAlt style={{ marginRight: '8px' }} />{t('delete_offer_btn')}
          </button>
        </div>
      </div>
    </div>
  );
};

// Accept onChatbotToggle as a prop
function MySkillPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false); // State for confirmation modal
  const [skillToDeleteId, setSkillToDeleteId] = useState(null); // State to store ID of skill to delete

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchMySkills();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchMySkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/skill-offers/my-skills`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSkills(response.data);
    } catch (err) {
      console.error('Failed to fetch my skills:', err);
      setError(t('failed_to_load_my_skills_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (skillId) => {
    setSkillToDeleteId(skillId);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteOffer = async () => {
    setShowDeleteConfirmModal(false); // Close modal
    if (!skillToDeleteId) return; // Should not happen if triggered by modal

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/skill-offers/${skillToDeleteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(t('skill_offer_deleted_success')); // Log success
      fetchMySkills(); // Refresh the list of skills
      setSelectedSkill(null); // Close the full details modal if it was open
    } catch (err) {
      console.error('Failed to delete skill offer:', err); // Log the actual error
      setError(t('failed_to_delete_skill_offer_error'));
    } finally {
      setLoading(false);
      setSkillToDeleteId(null); // Clear the ID after operation
    }
  };

  const cancelDeleteOffer = () => {
    setShowDeleteConfirmModal(false);
    setSkillToDeleteId(null); // Clear the ID
  };

  const openHelplinePopup = () => setShowHelplinePopup(true);
  const closeHelplinePopup = () => setShowHelplinePopup(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const currentPath = location.pathname;

  if (!user) {
    return null; // Don't render if user is not logged in
  }

  return (
    <div className="dashboard-page-container">
      <Navbar onHelplineClick={openHelplinePopup} onLogout={handleLogout} user={user} />

      <div className="dashboard-main-content">
        <aside className="dashboard-sidebar">
          <nav className="dashboard-nav">
            <Link to="/dashboard" className={`dashboard-nav-item ${currentPath === '/dashboard' ? 'active' : ''}`}>
              <Home size={20} /> {/* Replaced SVG with Lucide React Home icon */}
              {t("navbar_dashboard")}
            </Link>
            <Link to="/dashboard/profile" className={`dashboard-nav-item ${currentPath === '/dashboard/profile' ? 'active' : ''}`}>
              <User size={20} /> {/* Replaced SVG with Lucide React User icon */}
              {t("navbar_my_profile")}
            </Link>
            <Link to="/dashboard/my-skills" className={`dashboard-nav-item ${currentPath === '/dashboard/my-skills' ? 'active' : ''}`}>
              <Settings size={20} /> {/* Replaced SVG with Lucide React Settings icon (wrench) */}
              {t("navbar_my_skills")}
            </Link>
            <Link to="/marketplace" className={`dashboard-nav-item ${currentPath === '/marketplace' ? 'active' : ''}`}>
              <ShoppingCart size={20} /> {/* Replaced SVG with Lucide React ShoppingCart icon */}
              {t("navbar_marketplace")}
            </Link>
            {user.gender === 'Female' && (
              <Link to="/women-zone" className={`dashboard-nav-item ${currentPath === '/women-zone' ? 'active' : ''}`}>
                <Shield size={20} /> {/* Replaced SVG with Lucide React Shield icon */}
                {t("navbar_women_zone")}
              </Link>
            )}
            <Link to="/dashboard/received-requests" className={`dashboard-nav-item ${currentPath === '/dashboard/received-requests' ? 'active' : ''}`}>
              <Mail size={20} /> {/* Replaced SVG with Lucide React Mail icon */}
              {t("received_requests_page_title")}
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
          <div className="my-skills-page">
            <div className="my-skills-header">
              <h1>{t('my_skills_page_title')}</h1>
              <p>{t('my_skills_page_subtitle')}</p>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : skills.length === 0 ? (
              <p className="no-skills-message">{t('no_skills_offered')}</p>
            ) : (
              <div className="skill-card-container">
                {skills.map((skill) => (
                  <SkillCard
                    key={skill._id}
                    skill={skill}
                    onViewDetails={setSelectedSkill}
                    onDeleteOffer={handleDeleteClick} // Use new handler for confirmation
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
          onDelete={handleDeleteClick} // Use new handler for confirmation
        />
      )}

      {showDeleteConfirmModal && (
        <SuccessMessageModal
          isOpen={showDeleteConfirmModal}
          title={t("delete_confirm_title")}
          message={t("delete_confirm_message")}
          onClose={cancelDeleteOffer} // Use onClose to cancel
          onConfirm={confirmDeleteOffer} // Add onConfirm for deletion
          type="confirm" // New type for confirmation modal
        />
      )}
    </div>
  );
}

export default MySkillPage;