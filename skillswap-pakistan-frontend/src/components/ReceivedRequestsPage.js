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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              {t("navbar_dashboard")}
            </Link>
            <Link to="/dashboard/profile" className={`dashboard-nav-item ${currentPath === '/dashboard/profile' ? 'active' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              {t("navbar_my_profile")}
            </Link>
            <Link to="/dashboard/my-skills" className={`dashboard-nav-item ${currentPath === '/dashboard/my-skills' ? 'active' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-tool"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z"></path></svg>
              {t("navbar_my_skills")}
            </Link>
            <Link to="/marketplace" className={`dashboard-nav-item ${currentPath === '/marketplace' ? 'active' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-shopping-bag"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              {t("navbar_marketplace")}
            </Link>
            {user.gender === 'Female' && (
              <Link to="/women-zone" className={`dashboard-nav-item ${currentPath === '/women-zone' ? 'active' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-shield"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                {t("navbar_women_zone")}
              </Link>
            )}
            <Link to="/dashboard/received-requests" className={`dashboard-nav-item ${currentPath === '/dashboard/received-requests' ? 'active' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              {t("received_requests_page_title")}
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
