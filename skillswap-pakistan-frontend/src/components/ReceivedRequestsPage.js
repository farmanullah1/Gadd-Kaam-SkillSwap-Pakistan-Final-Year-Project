import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';
import LoadingSpinner from './LoadingSpinner';
import '../styles/dashboard.css';
import '../styles/requests.css'; // This CSS file is now provided
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next'; // Import useTranslation

// Import icons from lucide-react for consistent styling
import {
  Home, User, Settings, ShoppingCart, Shield, Mail, MessageSquare, Star
} from 'lucide-react';

const RequestCard = ({ request, onAccept, onCancel }) => {
  const { t } = useTranslation(); // Use translation hook
  const placeholderProfilePic = 'https://placehold.co/50x50/e0e0e0/666666?text=User';
  // Use process.env.REACT_APP_API_URL for image paths
  const profilePicUrl = request.sender.profilePicture
    ? `${process.env.REACT_APP_API_URL}${request.sender.profilePicture}`
    : placeholderProfilePic;

  return (
    <div className="request-card">
      <div className="request-card-header">
        <img
          src={profilePicUrl}
          alt={request.sender.username}
          className="request-profile-pic"
          onError={(e) => { e.target.onerror = null; e.target.src = placeholderProfilePic; }}
        />
        <div className="request-info">
          <h3>{request.sender.username}</h3>
          <p>{t("requested_your_skill")}: <strong>{request.skillOffer.skills.join(', ')}</strong></p>
          <p>{t("sender_offers_in_return")}: <strong>{request.skillRequested}</strong></p>
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

const AcceptedRequestNotification = ({ request }) => {
  const { t } = useTranslation(); // Use translation hook
  const placeholderProfilePic = 'https://placehold.co/50x50/e0e0e0/666666?text=User';
  // Use process.env.REACT_APP_API_URL for image paths
  const profilePicUrl = request.receiver.profilePicture
    ? `${process.env.REACT_APP_API_URL}${request.receiver.profilePicture}`
    : placeholderProfilePic;

  return (
    <div className="accepted-request-card">
      <div className="accepted-request-header">
        <div className="accepted-request-info">
          <h3>{t("request_accepted_by", { username: request.receiver.username })} 🎉</h3>
          <p>{t("contact_them_to_coordinate")}</p>
        </div>
      </div>
      <div className="accepted-request-details">
        <div className="user-details-section">
          <img
            src={profilePicUrl}
            alt={request.receiver.username}
            className="user-profile-pic"
            onError={(e) => { e.target.onerror = null; e.target.src = placeholderProfilePic; }}
          />
          <div className="contact-info">
            <h4>{t("contact_details_heading")}</h4>
            <p><strong>{t("name_label")}:</strong> {request.receiver.username}</p>
            <p><strong>{t("phone_label")}:</strong> {request.receiver.phoneNumber || t('not_specified')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

function ReceivedRequestsPage({ onChatbotToggle }) {
  const { t } = useTranslation(); // Use translation hook
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchRequests();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      // Fetch received requests
      const receivedResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/requests/received`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(receivedResponse.data.filter(req => req.status === 'pending'));

      // Fetch accepted requests where I am the sender
      const acceptedResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/requests/sent`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAcceptedRequests(acceptedResponse.data.filter(req => req.status === 'accepted'));
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
      await axios.post(`${process.env.REACT_APP_API_URL}/api/requests/${requestId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(t('request_accepted_notification'));
      fetchRequests(); // Refresh requests after action
    } catch (err) {
      console.error('Failed to accept request:', err);
      setError(t('failed_to_accept_request_error'));
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/requests/${requestId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(t('request_cancelled_notification'));
      fetchRequests(); // Refresh requests after action
    } catch (err) {
      console.error('Failed to cancel request:', err);
      setError(t('failed_to_cancel_request_error'));
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
    return null; // Or a loading state/redirect to login
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
          <h1 className="dashboard-welcome-heading">{t("received_requests_page_title")}</h1>
          <p className="dashboard-sub-heading">{t("received_requests_page_subtitle")}</p>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="requests-container">
              {requests.length > 0 && (
                <>
                  <h2 className="section-title">{t("pending_requests_section_title")}</h2>
                  {requests.map((request) => (
                    <RequestCard
                      key={request._id}
                      request={request}
                      onAccept={handleAcceptRequest}
                      onCancel={handleCancelRequest}
                    />
                  ))}
                </>
              )}

              {acceptedRequests.length > 0 && (
                <>
                  <h2 className="section-title">{t("accepted_requests_section_title")}</h2>
                  {acceptedRequests.map((request) => (
                    <AcceptedRequestNotification
                      key={request._id}
                      request={request}
                    />
                  ))}
                </>
              )}

              {requests.length === 0 && acceptedRequests.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', fontSize: '1.1em', color: '#555' }}>
                  <p>{t("no_new_requests_message_p1")}</p>
                  <p>{t("no_new_requests_message_p2")}</p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      <Footer onChatbotToggle={onChatbotToggle} />

      {showHelplinePopup && (
        <HelplinePopup onClose={closeHelplinePopup} />
      )}
    </div>
  );
}

export default ReceivedRequestsPage;
