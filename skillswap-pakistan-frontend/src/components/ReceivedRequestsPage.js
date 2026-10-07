import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';
import LoadingSpinner from './LoadingSpinner';
import '../styles/dashboard.css';
import '../styles/requests.css';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

// Import icons from lucide-react for consistent styling
import {
  Home, User, Settings, ShoppingCart, Shield, Mail, MessageSquare, Star
} from 'lucide-react';

// Helper for placeholder images
const getPlaceholderImage = (size = 50) => `https://placehold.co/${size}x${size}/e0e0e0/666666?text=User`;

// StarRatingDisplay component (can be shared)
const StarRatingDisplay = ({ rating }) => {
  return (
    <div className="star-rating-display">
      {[...Array(5)].map((_, index) => (
        <Star key={index} size={18} className={index < rating ? 'star-filled' : 'star-empty'} />
      ))}
    </div>
  );
};

const RequestCard = ({ request, onAccept, onCancel }) => {
  const { t } = useTranslation();
  const profilePicUrl = request.sender.profilePicture
    ? `${process.env.REACT_APP_API_URL}${request.sender.profilePicture.replace(/\\/g, '/')}`
    : getPlaceholderImage(50);

  return (
    <div className="request-card">
      <div className="request-card-header">
        <img
          src={profilePicUrl}
          alt={request.sender.username || t('anonymous_label')}
          className="request-profile-pic"
          onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(50); }}
        />
        <div className="request-info">
          <h3>{request.sender.username || t('anonymous_label')}</h3>
          <p>
            {t("requested_your_skill")}: <strong>{request.skillOffer.skills.join(', ')}</strong>
          </p>
          <p>
            {t("sender_offers_in_return")}: <strong>{request.skillRequested}</strong>
          </p>
          {request.isRemote ? (
            <p><strong>{t('remotely_label')}:</strong> {t('yes')}</p>
          ) : (
            <p><strong>{t('location_label')}:</strong> {request.location || t('not_specified')}</p>
          )}
          {/* Add review display here if `request.sender.averageRating` is available */}
          {/* {request.sender.averageRating && <StarRatingDisplay rating={request.sender.averageRating} />} */}
        </div>
      </div>
      <div className="request-card-actions">
        <button className="btn btn-accept" onClick={() => onAccept(request._id)}>
          <FaCheckCircle /> {t("accept_btn")}
        </button>
        <button className="btn btn-cancel" onClick={() => onCancel(request._id)}>
          <FaTimesCircle /> {t("cancel_btn")}
        </button>
      </div>
    </div>
  );
};

const AcceptedRequestNotification = ({ request, currentUserId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Determine the 'otherParticipant' in the exchange
  const otherParticipant = request.sender._id === currentUserId ? request.receiver : request.sender;

  const profilePicUrl = otherParticipant.profilePicture
    ? `${process.env.REACT_APP_API_URL}${otherParticipant.profilePicture.replace(/\\/g, '/')}`
    : getPlaceholderImage(70);

  const handleMessageClick = () => {
    navigate('/dashboard/messages', { state: { activeConversationRequestId: request._id } });
  };

  return (
    <div className="accepted-request-card">
      <div className="accepted-request-header">
        <div className="accepted-request-info">
          <h3>
            {t(
              request.sender._id === currentUserId // If current user is the sender of this accepted request
                ? "your_request_accepted_by" // Display "Your request accepted by..."
                : "request_accepted_by", // Else, display "Request accepted by..." (means current user is receiver)
              { username: otherParticipant.username || t('anonymous_label') }
            )}{" "}
            🎉
          </h3>
          <p>{t("contact_them_to_coordinate")}</p>
        </div>
      </div>
      <div className="accepted-request-details">
        <div className="user-details-section">
          <img
            src={profilePicUrl}
            alt={otherParticipant.username || t('anonymous_label')}
            className="user-profile-pic"
            onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(70); }}
          />
          <div className="contact-info">
            <h4>{t("contact_details_heading")}</h4>
            <p><strong>{t("name_label")}:</strong> {otherParticipant.username || t('anonymous_label')}</p>
            <p><strong>{t("phone_label")}:</strong> {otherParticipant.phoneNumber || t('not_specified')}</p>
            <p><strong>{t("location_label")}:</strong> {otherParticipant.location || t('not_specified')}</p>
          </div>
        </div>
        <button className="btn btn-primary-orange message-user-btn" onClick={handleMessageClick}>
          <MessageSquare size={16} /> {t('message_btn')}
        </button>
      </div>
    </div>
  );
};

function ReceivedRequestsPage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState([]); // For pending requests received by current user
  const [activeRequests, setActiveRequests] = useState([]); // For all accepted/completed requests where current user is sender or receiver
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchRequests(parsedUser.id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchRequests = async (currentUserId) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      // Fetch all requests where current user is either sender or receiver
      const allRequestsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/requests/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allRequests = allRequestsResponse.data;

      const pending = [];
      const active = [];

      allRequests.forEach(req => {
        const isCurrentUserSender = req.sender._id === currentUserId;
        const isCurrentUserReceiver = req.receiver._id === currentUserId;

        if (req.status === 'pending' && isCurrentUserReceiver) {
          pending.push(req);
        }
        else if ((req.status === 'accepted' || req.status === 'completed') && (isCurrentUserSender || isCurrentUserReceiver)) {
            // Add a flag to indicate if the current user sent this request (for display purposes)
            active.push({ ...req, isCurrentUserSender: isCurrentUserSender });
        }
      });

      setPendingRequests(pending);
      setActiveRequests(active);

    } catch (err) {
      console.error('Failed to fetch requests:', err);
      setError(t('failed_to_load_requests_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/requests/${requestId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(t('request_accepted_notification'), response.data);
      fetchRequests(user.id); // Refresh requests after action
    } catch (err) {
      console.error('Failed to accept request:', err);
      setError(err.response?.data?.msg || t('failed_to_accept_request_error'));
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/requests/${requestId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(t('request_cancelled_notification'), response.data);
      fetchRequests(user.id); // Refresh requests after action
    } catch (err) {
      console.error('Failed to cancel request:', err);
      setError(err.response?.data?.msg || t('failed_to_cancel_request_error'));
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
              <Home size={20} />
              {t("navbar_dashboard")}
            </Link>
            <Link to="/dashboard/profile" className={`dashboard-nav-item ${currentPath === '/dashboard/profile' ? 'active' : ''}`}>
              <User size={20} />
              {t("navbar_my_profile")}
            </Link>
            <Link to="/dashboard/my-skills" className={`dashboard-nav-item ${currentPath === '/dashboard/my-skills' ? 'active' : ''}`}>
              <Settings size={20} />
              {t("navbar_my_skills")}
            </Link>
            <Link to="/marketplace" className={`dashboard-nav-item ${currentPath === '/marketplace' ? 'active' : ''}`}>
              <ShoppingCart size={20} />
              {t("navbar_marketplace")}
            </Link>
            {user.gender === 'Female' && (
              <Link to="/women-zone" className={`dashboard-nav-item ${currentPath === '/women-zone' ? 'active' : ''}`}>
                <Shield size={20} />
                {t("navbar_women_zone")}
              </Link>
            )}
            <Link to="/dashboard/received-requests" className={`dashboard-nav-item ${currentPath === '/dashboard/received-requests' ? 'active' : ''}`}>
              <Mail size={20} />
              {t("received_requests_page_title")}
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
          <h1 className="dashboard-welcome-heading">{t("received_requests_page_title")}</h1>
          <p className="dashboard-sub-heading">{t("received_requests_page_subtitle")}</p>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="requests-container">
              {pendingRequests.length > 0 && (
                <>
                  <h2 className="section-title">{t("pending_requests_section_title")}</h2>
                  {pendingRequests.map((request) => (
                    <RequestCard
                      key={request._id}
                      request={request}
                      onAccept={handleAcceptRequest}
                      onCancel={handleCancelRequest}
                    />
                  ))}
                </>
              )}

              {activeRequests.length > 0 && (
                <>
                  <h2 className="section-title">{t("accepted_requests_section_title")}</h2>
                  {activeRequests.map((request) => (
                    <AcceptedRequestNotification
                      key={request._id}
                      request={request}
                      currentUserId={user.id} // Pass current user ID to determine roles
                    />
                  ))}
                </>
              )}

              {pendingRequests.length === 0 && activeRequests.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', fontSize: '1.1em', color: '#555' }}>
                  <p>{t("no_new_requests_message_p1")}</p>
                  <p>{t("no_new_requests_message_p2")}</p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      <Footer onChatbotToggle={onChatbotToggle} user={user} />

      {showHelplinePopup && (
        <HelplinePopup onClose={closeHelplinePopup} />
      )}
    </div>
  );
}

export default ReceivedRequestsPage;
