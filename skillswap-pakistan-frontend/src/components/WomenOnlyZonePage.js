import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';
import LoadingSpinner from './LoadingSpinner';
import SuccessMessageModal from './SuccessMessageModal'; 
import '../styles/marketplace.css';
import '../styles/WomenOnlyZonePage.css'; 
import '../styles/forms.css'; 
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import {
  Home, User, Settings, ShoppingCart, Shield, Mail, MessageSquare, Star, Search, Tag, X, Lightbulb, MapPin, Send
} from 'lucide-react';

const getPlaceholderImage = (width = 280, height = 180) =>
  `https://placehold.co/${width}x${height}/e0e0e0/666666?text=Skill`;

// ✅ SHARED SKILL CARD WITH REVIEW DISPLAY
const SkillCard = ({ skillOffer, onViewDetails }) => {
  const { t } = useTranslation();
  const imageUrl = skillOffer.photo ? `${process.env.REACT_APP_API_URL}${skillOffer.photo.replace(/\\/g, '/')}` : getPlaceholderImage();
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

        {/* ✅ REVIEW DISPLAY */}
        <div className="skill-card-review-section" style={{ 
            backgroundColor: '#f9f9f9', 
            padding: '10px', 
            borderRadius: '8px', 
            margin: '10px 0', 
            fontSize: '0.85rem' 
        }}>
          {skillOffer.latestReview ? (
            <div>
              <div style={{display:'flex', alignItems:'center', gap:'5px', marginBottom:'4px'}}>
                 <Star size={14} fill="#e38b40" stroke="#e38b40" /> 
                 <strong>{skillOffer.latestReview.rating}/5</strong>
              </div>
              <p style={{fontStyle:'italic', margin:0}}>
                "{skillOffer.latestReview.comment.length > 50 ? skillOffer.latestReview.comment.substring(0, 50) + '...' : skillOffer.latestReview.comment}"
              </p>
              <p style={{margin:'4px 0 0', fontWeight:'bold', color:'#666'}}>
                - {skillOffer.latestReview.reviewerName}
              </p>
            </div>
          ) : (
            <p style={{color: '#999', fontStyle: 'italic', margin:0}}>No review</p>
          )}
        </div>

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

// ... (Keep the FullDetailsModal component exactly as it is in your MarketplacePage.js file or copy it here) ...
// Since it's large and identical, I'll assume you can copy it from MarketplacePage.js to here. 
// Just ensure FullDetailsModal is defined before WomenOnlyZonePage use it.

const FullDetailsModal = ({ skillOffer, onClose, currentUserId, onSendRequestSuccess }) => {
  // ... Paste the same FullDetailsModal logic from MarketplacePage.js here ...
  // For brevity, I'm just including the functional shell. You MUST copy the full logic.
  
  const { t } = useTranslation();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [skillRequested, setSkillRequested] = useState('');
  const [isRemote, setIsRemote] = useState(true);
  const [location, setLocation] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
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

    setSendingRequest(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        receiverId: skillOffer.user._id,
        skillOfferId: skillOffer._id,
        skillRequested: skillRequested,
        message: t('initial_request_message', { skill: skillOffer.skills.join(', ') }),
        isRemote: isRemote,
        location: isRemote ? '' : location,
      };

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/requests`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Request sent:', response.data);
      setSuccessMessage(t('request_sent_success_message'));
      setShowSuccessModal(true);
      onSendRequestSuccess();
    } catch (err) {
      console.error('Failed to send request:', err.response?.data || err);
      setErrorMessage(err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg || t('failed_to_send_request_error'));
      setShowErrorModal(true);
    } finally {
      setSendingRequest(false);
    }
  };

  const authorName = skillOffer.anonymous ? t('anonymous_label') : (skillOffer.user?.username || t('anonymous_label'));
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
                      if (e.target.checked) setLocation(''); 
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
                    className="input-field" 
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
            onClose(); 
          }}
          type="success"
        />
      )}

      {showErrorModal && (
        <SuccessMessageModal
          isOpen={showErrorModal}
          title={t("error_title")} 
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
          type="error"
        />
      )}
    </div>
  );
};


function WomenOnlyZonePage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [allSkills, setAllSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSkillOffer, setSelectedSkillOffer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);


  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.gender !== 'Female') {
        console.log(t('access_denied_female_only'));
        navigate('/marketplace');
        return;
      }
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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/skill-offers/women-only`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllSkills(response.data);

      const categories = new Set();
      response.data.forEach(offer => {
        offer.skills.forEach(skill => categories.add(skill));
      });
      setAvailableCategories([...categories]);

    } catch (err) {
      console.error('Failed to fetch women-only skill offers:', err);
      setError(t('failed_to_load_women_only_skills_error'));
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
          <div className="women-only-zone-page">
            <div className="women-only-zone-header">
              <h1>{t('women_only_zone_page_title')}</h1>
              <p>{t('women_only_zone_page_subtitle')}</p>
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
                  ? t('no_skills_available_women_zone')
                  : t('no_skills_match_filters')}
              </p>
            ) : (
              <div className="skill-card-container women-only-skill-card-container">
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

export default WomenOnlyZonePage;