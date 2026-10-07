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
import {
  Home, User, Settings, ShoppingCart, Shield, Mail, MessageSquare, Star
} from 'lucide-react';

const getPlaceholderImage = (size = 50) =>
  `https://placehold.co/${size}x${size}/e0e0e0/666666?text=User`;

const RequestCard = ({ request, onAccept, onCancel }) => {
  const { t } = useTranslation();
  const sender = request.sender || {};
  const profilePicUrl = sender.profilePicture
    ? `${process.env.REACT_APP_API_URL}${sender.profilePicture.replace(/\\/g, '/')}`
    : getPlaceholderImage(50);

  const displayName = sender.firstName || sender.lastName
    ? `${sender.firstName || ''} ${sender.lastName || ''} (${sender.username || t('anonymous_label')})`
    : sender.username || t('anonymous_label');

  return (
    <div className="request-card">
      <div className="request-card-header">
        <img
          src={profilePicUrl}
          alt={displayName}
          className="request-profile-pic"
          onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(50); }}
        />
        <div className="request-info">
          <h3>{displayName}</h3>
          <p>{t("requested_your_skill")}: <strong>{request.skillOffer.skills.join(', ')}</strong></p>
          <p>{t("sender_offers_in_return")}: <strong>{request.skillRequested}</strong></p>
          {request.isRemote ? (
            <p><strong>{t('remotely_label')}:</strong> {t('yes')}</p>
          ) : (
            <p><strong>{t('location_label')}:</strong> {request.location || t('not_specified')}</p>
          )}
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
  const otherParticipant = request.sender._id === currentUserId ? request.receiver : request.sender;

  const profilePicUrl = otherParticipant.profilePicture
    ? `${process.env.REACT_APP_API_URL}${otherParticipant.profilePicture.replace(/\\/g, '/')}`
    : getPlaceholderImage(70);

  const displayName = otherParticipant.firstName || otherParticipant.lastName
    ? `${otherParticipant.firstName || ''} ${otherParticipant.lastName || ''} (${otherParticipant.username || t('anonymous_label')})`
    : otherParticipant.username || t('anonymous_label');

  const handleMessageClick = () => {
    navigate('/dashboard/messages', { state: { activeConversationRequestId: request._id } });
  };

  return (
    <div className="accepted-request-card">
      <div className="accepted-request-header">
        <div className="accepted-request-info">
          <h3>
            {request.sender._id === currentUserId
              ? t("your_request_accepted_by", { username: displayName })
              : t("request_accepted_by", { username: displayName })
            } 🎉
          </h3>
          <p>{t("contact_them_to_coordinate")}</p>
        </div>
      </div>
      <div className="accepted-request-details">
        <div className="user-details-section">
          <img
            src={profilePicUrl}
            alt={displayName}
            className="user-profile-pic"
            onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(70); }}
          />
          <div className="contact-info">
            <h4>{t("contact_details_heading")}</h4>
            <p><strong>{t("name_label")}:</strong> {displayName}</p>
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
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeRequests, setActiveRequests] = useState([]);
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
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/requests/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const pending = [];
      const active = [];
      res.data.forEach(req => {
        const isSender = req.sender._id === currentUserId;
        const isReceiver = req.receiver._id === currentUserId;
        if (req.status === 'pending' && isReceiver) pending.push(req);
        if ((req.status === 'accepted' || req.status === 'completed') && (isSender || isReceiver))
          active.push({ ...req, isCurrentUserSender: isSender });
      });
      setPendingRequests(pending);
      setActiveRequests(active);
    } catch (err) {
      setError(t('failed_to_load_requests_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/requests/${id}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRequests(user.id);
    } catch (err) {
      setError(err.response?.data?.msg || t('failed_to_accept_request_error'));
    }
  };

  const handleCancelRequest = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/requests/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRequests(user.id);
    } catch (err) {
      setError(err.response?.data?.msg || t('failed_to_cancel_request_error'));
    }
  };

  const currentPath = location.pathname;
  if (!user) return null;

  return (
    <div className="dashboard-page-container">
      <Navbar onHelplineClick={() => setShowHelplinePopup(true)} onLogout={() => {
        localStorage.clear(); setUser(null); navigate('/login');
      }} user={user} />

      <div className="dashboard-main-content">
        <aside className="dashboard-sidebar">
          <nav className="dashboard-nav">
            <Link to="/dashboard" className={`dashboard-nav-item ${currentPath === '/dashboard' ? 'active' : ''}`}>
              <Home size={20} /> {t("navbar_dashboard")}
            </Link>
            <Link to="/dashboard/profile" className={`dashboard-nav-item ${currentPath === '/dashboard/profile' ? 'active' : ''}`}>
              <User size={20} /> {t("navbar_my_profile")}
            </Link>
            <Link to="/dashboard/my-skills" className={`dashboard-nav-item ${currentPath === '/dashboard/my-skills' ? 'active' : ''}`}>
              <Settings size={20} /> {t("navbar_my_skills")}
            </Link>
            <Link to="/marketplace" className={`dashboard-nav-item ${currentPath === '/marketplace' ? 'active' : ''}`}>
              <ShoppingCart size={20} /> {t("navbar_marketplace")}
            </Link>
            {user.gender === 'Female' && (
              <Link to="/women-zone" className={`dashboard-nav-item ${currentPath === '/women-zone' ? 'active' : ''}`}>
                <Shield size={20} /> {t("navbar_women_zone")}
              </Link>
            )}
            <Link to="/dashboard/received-requests" className={`dashboard-nav-item ${currentPath === '/dashboard/received-requests' ? 'active' : ''}`}>
              <Mail size={20} /> {t("received_requests_page_title")}
            </Link>
            <Link to="/dashboard/messages" className={`dashboard-nav-item ${currentPath === '/dashboard/messages' ? 'active' : ''}`}>
              <MessageSquare size={20} /> {t('navbar_messages')}
            </Link>
            <Link to="/dashboard/reviews" className={`dashboard-nav-item ${currentPath === '/dashboard/reviews' ? 'active' : ''}`}>
              <Star size={20} /> {t('navbar_reviews')}
            </Link>
          </nav>
        </aside>

        <section className="dashboard-content-area">
          <h1>{t("received_requests_page_title")}</h1>
          <p>{t("received_requests_page_subtitle")}</p>
          {loading ? <LoadingSpinner /> : error ? <p className="error-message">{error}</p> : (
            <div className="requests-container">
              {pendingRequests.length > 0 && <>
                <h2>{t("pending_requests_section_title")}</h2>
                {pendingRequests.map(req =>
                  <RequestCard key={req._id} request={req} onAccept={handleAcceptRequest} onCancel={handleCancelRequest} />
                )}
              </>}
              {activeRequests.length > 0 && <>
                <h2>{t("accepted_requests_section_title")}</h2>
                {activeRequests.map(req =>
                  <AcceptedRequestNotification key={req._id} request={req} currentUserId={user.id} />
                )}
              </>}
              {pendingRequests.length === 0 && activeRequests.length === 0 &&
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <p>{t("no_new_requests_message_p1")}</p>
                  <p>{t("no_new_requests_message_p2")}</p>
                </div>}
            </div>
          )}
        </section>
      </div>
      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={() => setShowHelplinePopup(false)} />}
    </div>
  );
}
export default ReceivedRequestsPage;
