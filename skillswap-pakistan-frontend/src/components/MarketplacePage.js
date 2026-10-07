import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';
import LoadingSpinner from './LoadingSpinner';
import SuccessMessageModal from './SuccessMessageModal';
import '../styles/marketplace.css';
import '../styles/forms.css'; // For remote switch
import axios from 'axios';
import { useTranslation } from 'react-i18next';

// Import icons from lucide-react for consistent styling
import {
  Home, User, Settings, ShoppingCart, Shield, Mail, MessageSquare, Star, Search, Tag, X, Lightbulb, MapPin, Send
} from 'lucide-react';

// Helper for placeholder images
const getPlaceholderImage = (width = 280, height = 180) =>
  `https://placehold.co/${width}x${height}/e0e0e0/666666?text=Skill`;

// Shared SkillCard component
const SkillCard = ({ skillOffer, onViewDetails }) => {
  const { t } = useTranslation();
  const imageUrl = skillOffer.photo ? `${process.env.REACT_APP_API_URL}${skillOffer.photo.replace(/\\/g, '/')}` : getPlaceholderImage();

  // Determine author name: if anonymous flag is true, show 'Anonymous'.
  // Otherwise, use the populated username from skillOffer.user, falling back to 'Anonymous' if somehow missing.
  const authorName = skillOffer.anonymous ? t('anonymous_label') : (skillOffer.user?.username || t('anonymous_label'));

  return (
    <div className="skill-card">
      <div className="skill-card-image-wrapper">
        <img
          src={imageUrl}
          alt={skillOffer.skills.join(', ')}
          className="skill-card-image"
          onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(); }}
        />
      </div>
      <div className="skill-card-content">
        <h3 className="skill-card-title">{skillOffer.skills.join(', ')}</h3>
        <p className="skill-card-author">
          {t('offer_skill_label')} {t('by_label')} {authorName}
        </p>
        <p className="skill-card-description">{skillOffer.description}</p>
        <div className="skill-card-tags">
          {skillOffer.remotely && <span className="skill-card-tag">{t('remotely_label')}</span>}
          {skillOffer.anonymous && <span className="skill-card-tag">{t('anonymous_label')}</span>}
          {skillOffer.shareWithWomenZone && <span className="skill-card-tag">{t('women_only_zone_tag')}</span>}
        </div>
        <div className="skill-card-actions">
          <button className="btn-view-details" onClick={() => onViewDetails(skillOffer)}>
            {t('view_full_details_btn')}
          </button>
        </div>
      </div>
    </div>
  );
};

// FullDetailsModal component - ENHANCED for Request Logic
const FullDetailsModal = ({ skillOffer, onClose, currentUserId, onSendRequestSuccess }) => {
  const { t } = useTranslation();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [skillRequested, setSkillRequested] = useState('');
  const [isRemote, setIsRemote] = useState(true); // Default to remote work
  const [location, setLocation] = useState(''); // State for location
  const [sendingRequest, setSendingRequest] = useState(false); // State to manage button disabled status
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // ADDED: successMessage state
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const imageUrl = skillOffer.photo ? `${process.env.REACT_APP_API_URL}${skillOffer.photo.replace(/\\/g, '/')}` : getPlaceholderImage(750, 350);

  const handleSendRequest = async () => {
    if (!skillRequested.trim()) {
      setErrorMessage(t('please_specify_skill_error'));
      setShowErrorModal(true);
      return;
    }
    if (!isRemote && (!location || location.trim() === '')) {
      setErrorMessage(t('location_required_non_remote_error'));
      setShowErrorModal(true);
      return;
    }

    setSendingRequest(true); // Disable button immediately
    try {
      const token = localStorage.getItem('token');
      const payload = {
        receiverId: skillOffer.user._id, // ID of the user offering the skill
        skillOfferId: skillOffer._id, // ID of the specific skill offer
        skillRequested: skillRequested,
        message: t('initial_request_message', { skill: skillOffer.skills.join(', ') }),
        isRemote: isRemote,
        location: isRemote ? '' : location, // Send empty string if remote
      };

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/requests`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Request sent:', response.data);
      setSuccessMessage(t('request_sent_success_message')); // Set translated success message
      setShowSuccessModal(true);
      onSendRequestSuccess();
    } catch (err) {
      console.error('Failed to send request:', err.response?.data || err);
      // Use err.response?.data?.msg for backend validation messages
      setErrorMessage(err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg || t('failed_to_send_request_error'));
      setShowErrorModal(true);
    } finally {
      setSendingRequest(false); // Re-enable button
    }
  };

  // Determine author name for display in modal
  const authorName = skillOffer.anonymous ? t('anonymous_label') : (skillOffer.user?.username || t('anonymous_label'));

  // Prevent current user from requesting their own skill
  const isOwnSkill = currentUserId === skillOffer.user?._id;

  if (!skillOffer) return null;

  return (
    <div className="full-details-modal-overlay">
      <div className="full-details-modal-content">
        <button className="full-details-modal-close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        <div className="full-details-header">
          <h2 className="full-details-title">{skillOffer.skills.join(', ')}</h2>
          <p className="full-details-author">
            {t('offer_skill_label')} {t('by_label')} {authorName}
          </p>
        </div>
        <img
          src={imageUrl}
          alt={skillOffer.skills.join(', ')}
          className="full-details-image"
          onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(750, 350); }}
        />
        <div className="full-details-grid">
          <div className="full-details-info-box full-details-description-box">
            <h3 className="full-details-info-label">{t('description_label')}</h3>
            <p className="full-details-info-value">{skillOffer.description}</p>
          </div>
          {/* Show location ONLY if the skill is NOT remotely offered */}
          {!skillOffer.remotely && (
            <div className="full-details-info-box">
              <h3 className="full-details-info-label">{t('location_label')}</h3>
              <p className="full-details-info-value">{skillOffer.location || t('not_specified')}</p>
            </div>
          )}
          <div className="full-details-info-box">
            <h3 className="full-details-info-label">{t('remotely_label')}</h3>
            <p className="full-details-info-value">{skillOffer.remotely ? t('yes') : t('no')}</p>
          </div>
          <div className="full-details-info-box">
            <h3 className="full-details-info-label">{t('anonymous_label')}</h3>
            <p className="full-details-info-value">{skillOffer.anonymous ? t('yes') : t('no')}</p>
          </div>
          {skillOffer.shareWithWomenZone && (
            <div className="full-details-info-box">
              <h3 className="full-details-info-label">{t('women_only_zone_tag')}</h3>
              <p className="full-details-info-value">{t('yes')}</p>
            </div>
          )}
          <div className="full-details-info-box">
            <h3 className="full-details-info-label">{t('swap_skill_label')}</h3>
            <p className="full-details-info-value">{skillOffer.skillsToSwap?.join(', ') || t('skill_not_specified')}</p>
          </div>
          {/* Show phone number ONLY if the skill is NOT anonymous */}
          {!skillOffer.anonymous && skillOffer.user?.phoneNumber && (
            <div className="full-details-info-box">
              <h3 className="full-details-info-label">{t('phone_label')}</h3>
              <p className="full-details-info-value">{skillOffer.user.phoneNumber}</p>
            </div>
          )}
        </div>
        <div className="full-details-actions">
          {isOwnSkill ? (
            <p className="info-message">{t('cannot_request_own_skill')}</p>
          ) : !showRequestForm ? (
            <button className="btn-request-offer" onClick={() => setShowRequestForm(true)}>
              <Lightbulb size={18} style={{ marginRight: '8px' }} /> {t('request_btn')}
            </button>
          ) : (
            <div className="request-form-section">
              <label htmlFor="requestSkillInput">{t('specify_skill_wanted_label')}</label>
              <textarea
                id="requestSkillInput"
                placeholder={t('request_skill_placeholder')}
                value={skillRequested}
                onChange={(e) => setSkillRequested(e.target.value)}
                rows="4"
              ></textarea>

              <div className="remote-switch-container">
                <label className="remote-switch">
                  <input
                    type="checkbox"
                    checked={isRemote}
                    onChange={(e) => {
                      setIsRemote(e.target.checked);
                      if (e.target.checked) setLocation(''); // Clear location if remote
                    }}
                  />
                  <span className="slider round"></span>
                </label>
                <span>{t('work_can_be_remote_label')}</span>
              </div>

              {!isRemote && (
                <div className="location-input-container">
                  <label htmlFor="locationInput">{t('location_label')}</label>
                  <input
                    type="text"
                    id="locationInput"
                    placeholder={t('enter_location_placeholder')}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="input-field" // Use global input style
                  />
                </div>
              )}

              <button className="btn-send-request" onClick={handleSendRequest} disabled={sendingRequest}>
                {sendingRequest ? <LoadingSpinner size={20} color="#fff" /> : <Send size={18} style={{ marginRight: '8px' }} />}
                {sendingRequest ? t('sending_request_btn') : t('send_request_btn')}
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
          onClose={() => {
            setShowSuccessModal(false);
            onClose(); // Close the FullDetailsModal after success
          }}
          type="success"
        />
      )}

      {showErrorModal && (
        <SuccessMessageModal
          isOpen={showErrorModal}
          title={t("error_title")} // Use translation key directly
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
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
  const [allSkills, setAllSkills] = useState([]); // Stores all skills fetched from API
  const [filteredSkills, setFilteredSkills] = useState([]); // Skills after applying search/filters
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSkillOffer, setSelectedSkillOffer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchAllSkills();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    applyFilters();
  }, [allSkills, searchTerm, selectedCategories]);

  const fetchAllSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/skill-offers/marketplace`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllSkills(response.data);

      const categories = new Set();
      response.data.forEach(offer => {
        offer.skills.forEach(skill => categories.add(skill));
      });
      setAvailableCategories([...categories]);

    } catch (err) {
      console.error('Failed to fetch marketplace skills:', err);
      setError(t('failed_to_load_marketplace_skills_error'));
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let currentFiltered = allSkills;

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentFiltered = currentFiltered.filter(offer =>
        offer.skills.some(s => s.toLowerCase().includes(lowerCaseSearchTerm)) ||
        offer.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        (offer.user?.username && offer.user.username.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    if (selectedCategories.length > 0) {
      currentFiltered = currentFiltered.filter(offer =>
        offer.skills.some(s => selectedCategories.includes(s))
      );
    }
    setFilteredSkills(currentFiltered);
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
  };

  const openHelplinePopup = () => setShowHelplinePopup(true);
  const closeHelplinePopup = () => setShowHelplinePopup(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleSendRequestSuccess = () => {
    setSelectedSkillOffer(null);
    fetchAllSkills();
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

            <div className="marketplace-filters-search">
              <div className="search-bar">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder={t('search_skills_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="category-filters">
                <Tag size={20} className="filter-icon" />
                {availableCategories.length > 0 ? (
                  availableCategories.map(category => (
                    <button
                      key={category}
                      className={`filter-tag ${selectedCategories.includes(category) ? 'active' : ''}`}
                      onClick={() => handleCategoryToggle(category)}
                    >
                      {category}
                      {selectedCategories.includes(category) && <X size={14} className="clear-filter-icon" />}
                    </button>
                  ))
                ) : (
                  <p>{t('no_categories_available')}</p>
                )}
                {(searchTerm || selectedCategories.length > 0) && (
                  <button className="clear-filters-btn" onClick={clearFilters}>
                    {t('clear_all_filters')}
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : filteredSkills.length === 0 ? (
              <p className="no-skills-message">
                {allSkills.length === 0
                  ? t('no_skills_available_from_others')
                  : t('no_skills_match_filters')}
              </p>
            ) : (
              <div className="skill-card-container">
                {filteredSkills.map((offer) => (
                  <SkillCard
                    key={offer._id}
                    skillOffer={offer}
                    onViewDetails={setSelectedSkillOffer}
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

      {selectedSkillOffer && (
        <FullDetailsModal
          skillOffer={selectedSkillOffer}
          onClose={() => setSelectedSkillOffer(null)}
          currentUserId={user?.id}
          onSendRequestSuccess={handleSendRequestSuccess}
        />
      )}
    </div>
  );
}

export default MarketplacePage;
