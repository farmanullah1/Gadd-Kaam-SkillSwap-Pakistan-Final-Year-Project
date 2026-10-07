import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';
import LoadingSpinner from './LoadingSpinner';
import '../styles/my-skills.css'; // Import my-skills styles for dashboard layout and sidebar
import '../styles/reviews.css'; // Dedicated CSS for reviews page
import { useTranslation } from 'react-i18next';
import axios from 'axios';

// Import icons from lucide-react for consistent styling
import {
  Home, User, Settings, ShoppingCart, Shield, Mail, MessageSquare, Star as StarIcon, ThumbsUp
} from 'lucide-react';

// Helper for placeholder images
const getPlaceholderImage = (size = 50) => `https://placehold.co/${size}x${size}/e0e0e0/666666?text=User`;

// Component to render star rating
const StarRatingDisplay = ({ rating }) => {
  return (
    <div className="star-rating-display">
      {[...Array(5)].map((_, index) => (
        <StarIcon
          key={index}
          size={18}
          className={index < rating ? 'star-filled' : 'star-empty'}
        />
      ))}
    </div>
  );
};

// Component for a received review card
const ReceivedReviewCard = ({ review }) => {
  const { t } = useTranslation();
  const reviewerProfilePicUrl = review.reviewer.profilePicture
    ? `${process.env.REACT_APP_API_URL}${review.reviewer.profilePicture.replace(/\\/g, '/')}`
    : getPlaceholderImage();

  return (
    <div className="review-card-item">
      <div className="review-card-header">
        <img
          src={reviewerProfilePicUrl}
          alt={review.reviewer.username}
          className="review-profile-pic"
          onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(); }}
        />
        <div className="reviewer-info">
          <h4>{t('by_reviewer_name', { username: review.reviewer.username })}</h4>
          <StarRatingDisplay rating={review.rating} />
        </div>
      </div>
      <p className="review-comment">{review.comment}</p>
      {review.endorsedSkills && review.endorsedSkills.length > 0 && (
        <div className="review-endorsed-skills">
          <strong>{t('endorse_skills_label', { username: review.reviewer.username })}:</strong>
          {review.endorsedSkills.map((skill, idx) => (
            <span key={idx} className="endorsed-skill-tag">{skill}</span>
          ))}
        </div>
      )}
      <p className="review-date">{new Date(review.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

// Component for a pending review opportunity card
const PendingReviewCard = ({ pendingReview, onWriteReview }) => {
  const { t } = useTranslation();
  const otherUser = pendingReview.otherParticipant;
  const otherUserProfilePicUrl = otherUser.profilePicture
    ? `${process.env.REACT_APP_API_URL}${otherUser.profilePicture.replace(/\\/g, '/')}`
    : getPlaceholderImage();

  return (
    <div className="review-card-item pending-review-item">
      <div className="review-card-header">
        <img
          src={otherUserProfilePicUrl}
          alt={otherUser.username}
          className="review-profile-pic"
          onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(); }}
        />
        <div className="reviewer-info">
          <h4>{t('review_for_exchange_with', { username: otherUser.username })}</h4>
          <p className="skills-involved-text">
            <strong>{t('skills_involved')}:</strong>{' '}
            {pendingReview.skillOffer?.skills?.join(', ') || t('not_specified')} / {pendingReview.skillRequested || t('not_specified')}
          </p>
        </div>
      </div>
      <button className="btn btn-primary-orange" onClick={() => onWriteReview(pendingReview.requestId)}>
        {t('write_a_review_tab')}
      </button>
    </div>
  );
};


function ReviewsPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'write'
  const [receivedReviews, setReceivedReviews] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [currentRequestIdToReview, setCurrentRequestIdToReview] = useState(null); // ID of request being reviewed
  const [reviewSubmitted, setReviewSubmitted] = useState(false); // State to track if review is submitted
  const [rating, setRating] = useState(0); // For star rating
  const [reviewText, setReviewText] = useState(''); // For review comment
  const [exchangeDetails, setExchangeDetails] = useState(null); // Details of the completed exchange
  const [endorsableSkills, setEndorsableSkills] = useState([]); // Skills to endorse
  const [endorsementCounts, setEndorsementCounts] = useState({}); // Local counts for endorsements

  // Get requestId from URL query parameters (for direct link from messages)
  const urlParams = new URLSearchParams(location.search);
  const initialRequestId = urlParams.get('requestId');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (initialRequestId) {
        setActiveTab('write'); // If coming from a direct link, go to write review tab
        fetchExchangeDetailsForReview(initialRequestId, parsedUser.id);
      } else {
        // Fetch reviews for the active tab
        if (activeTab === 'received') {
          fetchReceivedReviews(parsedUser.id);
        } else { // activeTab === 'write'
          fetchPendingReviews(parsedUser.id);
        }
      }
    } else {
      navigate('/login');
    }
  }, [navigate, initialRequestId, activeTab]); // Include activeTab in dependency array

  // Function to fetch received reviews
  const fetchReceivedReviews = async (userId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/reviews/received`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReceivedReviews(response.data);
    } catch (err) {
      console.error('Failed to fetch received reviews:', err);
      // Handle error (e.g., set error state)
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch pending reviews
  const fetchPendingReviews = async (userId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/reviews/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingReviews(response.data);
    } catch (err) {
      console.error('Failed to fetch pending reviews:', err);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch details for a specific exchange when writing a review
  const fetchExchangeDetailsForReview = async (requestId, userId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Fetch details of this specific completed request
      // We need an endpoint for this, or adapt /api/requests/sent or /api/requests/received to filter by ID
      // For now, let's assume `api/reviews/pending` can be used to get details for *one* request
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/reviews/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const pendingReq = response.data.find(req => req.requestId === requestId);

      if (pendingReq) {
        setCurrentRequestIdToReview(requestId);
        setExchangeDetails(pendingReq);

        // Combine skills from offer and requested for endorsement
        const skillsFromExchange = [
          ...(pendingReq.skillOffer?.skills || []),
          pendingReq.skillRequested
        ].filter(Boolean); // Filter out null/undefined
        setEndorsableSkills([...new Set(skillsFromExchange)]); // Unique skills
      } else {
        console.warn('Request not found in pending reviews or already reviewed.');
        // Optionally redirect to main reviews page if request already reviewed or invalid
        navigate('/dashboard/reviews');
      }
    } catch (err) {
      console.error('Failed to fetch exchange details for review:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  const handleEndorseClick = (skill) => {
    setEndorsementCounts(prev => ({
      ...prev,
      [skill]: (prev[skill] || 0) + 1
    }));
  };

  const handleSubmitReview = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/reviews`, {
        requestId: currentRequestIdToReview,
        rating,
        comment: reviewText,
        endorsedSkills: Object.keys(endorsementCounts).filter(skill => endorsementCounts[skill] > 0),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Review submitted:', response.data);
      setReviewSubmitted(true); // Show success message
      // After submission, clear form and refresh pending/received lists
      setRating(0);
      setReviewText('');
      setEndorsementCounts({});
      setCurrentRequestIdToReview(null);
      setExchangeDetails(null);
      // Re-fetch data for both tabs
      fetchReceivedReviews(user.id);
      fetchPendingReviews(user.id);

    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.response?.data?.msg || t('failed_to_submit_review')); // Use alert for now
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
            <Link to="/dashboard/messages" className={`dashboard-nav-item ${currentPath === '/dashboard/messages' ? 'active' : ''}`}>
              <MessageSquare size={20} />
              {t('navbar_messages')}
            </Link>
            <Link to="/dashboard/reviews" className={`dashboard-nav-item ${currentPath === '/dashboard/reviews' ? 'active' : ''}`}>
              <StarIcon size={20} />
              {t('navbar_reviews')}
            </Link>
          </nav>
        </aside>

        <section className="dashboard-content-area">
          <div className="reviews-page">
            <div className="reviews-header">
              <h1>{t('reviews_page_title')}</h1>
              <p>{t('reviews_page_subtitle')}</p>
            </div>

            <div className="review-tabs">
              <button
                className={`tab-button ${activeTab === 'received' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('received');
                  setReviewSubmitted(false); // Reset review form status
                  setCurrentRequestIdToReview(null); // Clear active review form
                  if (user) fetchReceivedReviews(user.id);
                }}
              >
                {t('reviews_received_tab')}
              </button>
              <button
                className={`tab-button ${activeTab === 'write' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('write');
                  setReviewSubmitted(false); // Reset review form status
                  setCurrentRequestIdToReview(null); // Clear active review form
                  if (user) fetchPendingReviews(user.id);
                }}
              >
                {t('write_a_review_tab')}
              </button>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="tab-content">
                {activeTab === 'received' && (
                  <div className="reviews-received-section">
                    {receivedReviews.length === 0 ? (
                      <p className="no-reviews-message">{t('no_received_reviews_yet')}</p>
                    ) : (
                      <div className="reviews-list-grid">
                        {receivedReviews.map(review => (
                          <ReceivedReviewCard key={review._id} review={review} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'write' && (
                  <div className="write-review-section">
                    {reviewSubmitted ? (
                      <div className="review-success-message">
                        <StarIcon size={48} color="#f5c242" />
                        <h2>{t('review_submitted_title')}</h2>
                        <p>{t('review_submitted_message')}</p>
                        <button className="btn btn-primary-orange" onClick={() => {
                          setReviewSubmitted(false);
                          setActiveTab('received'); // Go back to received reviews after submitting
                          if (user) fetchReceivedReviews(user.id);
                        }}>
                          {t('back_to_dashboard_btn')}
                        </button>
                      </div>
                    ) : currentRequestIdToReview ? (
                      // Show the review form if a request is selected
                      <div className="review-form-container">
                        <h2>{t('rate_skill_exchange_with', { username: exchangeDetails?.otherParticipant?.username || 'the user' })}</h2>
                        <p className="review-form-subtext">
                          <strong>{t('skills_involved')}:</strong>{' '}
                          {exchangeDetails?.skillOffer?.skills?.join(', ') || t('not_specified')} / {exchangeDetails?.skillRequested || t('not_specified')}
                        </p>
                        <div className="star-rating">
                          {[...Array(5)].map((_, index) => (
                            <StarIcon
                              key={index}
                              size={32}
                              className={index < rating ? 'star-filled' : 'star-empty'}
                              onClick={() => handleStarClick(index)}
                            />
                          ))}
                        </div>

                        <div className="form-group">
                          <label htmlFor="reviewText">{t('your_review_label')}</label>
                          <textarea
                            id="reviewText"
                            rows="5"
                            placeholder={t('review_placeholder')}
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                          ></textarea>
                        </div>

                        {endorsableSkills.length > 0 && (
                          <div className="endorsements-section">
                            <h3>{t('endorse_skills_label', { username: exchangeDetails?.otherParticipant?.username || 'them' })}</h3>
                            <div className="skills-to-endorse">
                              {endorsableSkills.map((skill, index) => (
                                <div key={index} className="skill-endorsement-item">
                                  <span>{skill}</span>
                                  <button
                                    className="btn btn-secondary-outline btn-endorse"
                                    onClick={() => handleEndorseClick(skill)}
                                  >
                                    <ThumbsUp size={16} /> {t('endorse_btn')} ({endorsementCounts[skill] || 0})
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <button
                          className="btn btn-primary-orange submit-review-btn"
                          onClick={handleSubmitReview}
                          disabled={rating === 0 || reviewText.trim() === ''}
                        >
                          {t('submit_review_btn')}
                        </button>
                      </div>
                    ) : (
                      // Show list of pending reviews if no request is selected
                      <div className="pending-reviews-list">
                        {pendingReviews.length === 0 ? (
                          <p className="no-reviews-message">{t('no_pending_reviews')}</p>
                        ) : (
                          <div className="reviews-list-grid">
                            {pendingReviews.map(pendingReview => (
                              <PendingReviewCard
                                key={pendingReview.requestId}
                                pendingReview={pendingReview}
                                onWriteReview={setCurrentRequestIdToReview} // Set the requestId to open the form
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />

      {showHelplinePopup && (
        <HelplinePopup onClose={closeHelplinePopup} />
      )}
    </div>
  );
}

export default ReviewsPage;
