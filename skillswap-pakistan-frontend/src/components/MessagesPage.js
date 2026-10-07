// src/components/MessagesPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';
import LoadingSpinner from './LoadingSpinner';
import SuccessMessageModal from './SuccessMessageModal';
import '../styles/my-skills.css';
import '../styles/messages.css';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  Home, User, Settings, ShoppingCart, Shield, Mail, MessageSquare, Star, Search, Send, CheckCircle, XCircle, User as UserIcon, Phone, MessageCircleMore
} from 'lucide-react';

// Helper for placeholder images
const getPlaceholderImage = (size = 50) => `https://placehold.co/${size}x${size}/e0e0e0/666666?text=User`;

// Chat Message Bubble Component
const ChatMessage = ({ message, isCurrentUser }) => {
  return (
    <div className={`chat-message ${isCurrentUser ? 'current-user' : 'other-user'}`}>
      <div className="message-content">{message.text}</div>
      <div className="message-time">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    </div>
  );
};

// Conversation Interface Component
const ConversationInterface = ({ activeConversation, onSkillReceivedConfirmed }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (activeConversation) {
      // In a real app, you would fetch actual messages for this conversation ID from your chat backend.
      // For now, we simulate a few messages.
      setMessages([
        { id: 1, text: t('chat_initial_greeting'), timestamp: new Date(Date.now() - 600000), isCurrentUser: false },
        { id: 2, text: t('chat_how_can_i_help'), timestamp: new Date(Date.now() - 540000), isCurrentUser: false },
        { id: 3, text: t('chat_user_response'), timestamp: new Date(Date.now() - 480000), isCurrentUser: true },
      ]);
    } else {
      setMessages([]);
    }
  }, [activeConversation, t]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    const newMsg = { id: Date.now(), text: newMessage, timestamp: new Date(), isCurrentUser: true };
    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    // In a real app, this would send the message to a chat backend (e.g., WebSocket or a REST endpoint)
  };

  const handleConfirmSkillReceived = async () => {
    setShowConfirmModal(false);

    try {
      const token = localStorage.getItem('token');
      const requestIdToConfirm = activeConversation?.requestId;
      if (!requestIdToConfirm) {
        setErrorMessage(t('error_no_request_id'));
        setShowErrorModal(true);
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/requests/${requestIdToConfirm}/confirm-skill-received`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      onSkillReceivedConfirmed(response.data.request, response.data.request.status === 'completed');

    } catch (err) {
      console.error('Error confirming skill received:', err);
      const msg = err.response?.data?.msg || t('error_confirming_skill_received_generic');
      setErrorMessage(msg);
      setShowErrorModal(true);
    }
  };

  if (!activeConversation) {
    return (
      <div className="no-active-conversation">
        <MessageCircleMore size={64} className="no-conversation-icon" />
        <p>{t('select_conversation_message')}</p>
        <p className="no-conversation-subtext">{t('choose_chat_to_start')}</p>
      </div>
    );
  }

  const showSkillReceivedButton = activeConversation.status === 'accepted' && (
    (activeConversation.isCurrentUserSender && !activeConversation.senderConfirmed) ||
    (!activeConversation.isCurrentUserSender && !activeConversation.receiverConfirmed)
  );

  const isExchangeCompleted = activeConversation.status === 'completed';

  return (
    <div className="conversation-container">
      <div className="chat-header">
        <div className="chat-partner-info">
          <img
            src={activeConversation.profilePicUrl}
            alt={activeConversation.participant}
            className="chat-partner-avatar"
          />
          <h3>{activeConversation.participant}</h3>
        </div>
        <div className="chat-actions">
          {showSkillReceivedButton && (
            <button
              className="btn btn-primary-orange chat-action-btn"
              onClick={() => setShowConfirmModal(true)}
            >
              <CheckCircle size={16} style={{ marginRight: '5px' }} /> {t('skill_received_btn')}
            </button>
          )}
          <button className="btn btn-secondary-outline chat-action-btn">
            <XCircle size={16} style={{ marginRight: '5px' }} /> {t('report_btn')}
          </button>
        </div>
      </div>
      <div className="messages-display">
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} isCurrentUser={msg.isCurrentUser} />
        ))}
        {isExchangeCompleted && <p className="exchange-completed-banner">{t('exchange_completed_chat_view_only')}</p>}
      </div>
      {!isExchangeCompleted && (
        <div className="message-input-area">
          <input
            type="text"
            placeholder={t('type_your_message_placeholder')}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
          />
          <button className="btn-send" onClick={handleSendMessage}>
            <Send size={20} />
          </button>
        </div>
      )}

      {showConfirmModal && (
        <SuccessMessageModal
          isOpen={showConfirmModal}
          title={t('confirm_skill_received_title')}
          message={t('confirm_skill_received_message')}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmSkillReceived}
          type="confirm"
        />
      )}
      {showErrorModal && (
        <SuccessMessageModal
          isOpen={showErrorModal}
          title={t('error_title')}
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
          type="error"
        />
      )}
    </div>
  );
};


function MessagesPage({ onChatbotToggle }) {
  const { t = () => {} } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Effect to set the user and fetch conversations
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchConversations(parsedUser.id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Effect to handle automatic conversation selection based on navigation state
  // This effect should run *after* conversations are loaded
  useEffect(() => {
    if (conversations.length > 0 && location.state) {
      const { activeConversationRequestId } = location.state;

      if (activeConversationRequestId) {
        const foundConv = conversations.find(conv => conv.requestId === activeConversationRequestId);
        if (foundConv) {
          setActiveConversation(foundConv);
          // Clear the state after use to prevent re-activation on subsequent visits
          navigate(location.pathname, { replace: true, state: {} });
        }
      }
    }
  }, [conversations, location.state, navigate, location.pathname]);


  const fetchConversations = async (currentUserId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No token found for authentication.");
        setLoading(false);
        navigate('/login');
        return;
      }

      // Fetch received requests
      const receivedResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/requests/received`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const receivedRequests = receivedResponse.data;

      // Fetch sent requests
      const sentResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/requests/sent`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const sentRequests = sentResponse.data;

      // Consolidate requests into a single list of conversations
      const allRequests = [...receivedRequests, ...sentRequests];
      const uniqueConversationsMap = new Map();

      allRequests.forEach(req => {
        // Only consider 'accepted' or 'completed' requests for ongoing conversations
        if (req.status === 'accepted' || req.status === 'completed') {
          const isCurrentUserSender = req.sender._id === currentUserId;
          const otherParticipant = isCurrentUserSender ? req.receiver : req.sender;

          const participantName = otherParticipant && otherParticipant.username ? otherParticipant.username : 'Unknown User';
          const conversationId = req._id; // Using request ID as the unique conversation ID

          if (!uniqueConversationsMap.has(conversationId)) {
            uniqueConversationsMap.set(conversationId, {
              id: conversationId,
              requestId: req._id,
              participant: participantName,
              profilePicUrl: otherParticipant && otherParticipant.profilePicture
                ? `${process.env.REACT_APP_API_URL}${otherParticipant.profilePicture.replace(/\\/g, '/')}`
                : getPlaceholderImage(),
              lastMessage: req.status === 'completed' ? t('exchange_completed_chat_summary') : t('chat_message_initial'),
              status: req.status,
              senderConfirmed: req.senderConfirmedReceived,
              receiverConfirmed: req.receiverConfirmedReceived,
              isCurrentUserSender: isCurrentUserSender,
              // Add participantId for direct lookup if needed, though requestId is primary
              participantId: otherParticipant._id,
              skillOfferSkills: req.skillOffer && req.skillOffer.skills ? req.skillOffer.skills.join(', ') : ''
            });
          }
        }
      });

      const sortedConversations = Array.from(uniqueConversationsMap.values()).sort((a, b) => {
        return new Date(b.requestId).getTime() - new Date(a.requestId).getTime();
      });

      setConversations(sortedConversations);

    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const participant = typeof conv.participant === 'string' ? conv.participant : '';
    const lastMessage = typeof conv.lastMessage === 'string' ? conv.lastMessage : '';
    const skillOfferSkills = typeof conv.skillOfferSkills === 'string' ? conv.skillOfferSkills : '';

    return participant.toLowerCase().includes(searchQuery.toLowerCase()) ||
           lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
           skillOfferSkills.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSkillReceivedConfirmation = (updatedRequest, completed) => {
    setConversations(prevConversations =>
      prevConversations.map(conv => {
        if (conv.requestId === updatedRequest._id) {
          const updatedConv = {
            ...conv,
            status: updatedRequest.status,
            senderConfirmed: updatedRequest.senderConfirmedReceived,
            receiverConfirmed: updatedRequest.receiverConfirmedReceived,
            lastMessage: completed ? t('exchange_completed_chat_summary') : conv.lastMessage
          };
          if (activeConversation && activeConversation.id === conv.id) {
              setActiveConversation(updatedConv);
          }
          return updatedConv;
        }
        return conv;
      })
    );

    if (completed) {
      navigate(`/dashboard/reviews?requestId=${updatedRequest._id}`);
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
              <Star size={20} />
              {t('navbar_reviews')}
            </Link>
          </nav>
        </aside>

        <section className="dashboard-content-area">
          <div className="messages-page-wrapper">
            <div className="messages-list-sidebar">
              <div className="messages-header">
                <h1>{t('messages_page_title')}</h1>
                <p>{t('messages_page_subtitle')}</p>
              </div>

              <div className="conversation-search">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder={t('search_messages_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {loading ? (
                <LoadingSpinner />
              ) : filteredConversations.length === 0 ? (
                <p className="no-messages-found">{t('no_messages_found')}</p>
              ) : (
                <div className="messages-list">
                  {filteredConversations.map(conv => (
                    <div
                      key={conv.id}
                      className={`conversation-list-item ${activeConversation?.id === conv.id ? 'active' : ''}`}
                      onClick={() => setActiveConversation(conv)}
                    >
                      <img
                        src={conv.profilePicUrl}
                        alt={conv.participant}
                        className="conversation-item-avatar"
                        onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(); }}
                      />
                      <div className="conversation-item-info">
                        <h4>{conv.participant}</h4>
                        <p className="last-message-preview">{conv.lastMessage}</p>
                        {conv.status === 'accepted' && (conv.isCurrentUserSender && !conv.senderConfirmed || !conv.isCurrentUserSender && !conv.receiverConfirmed) &&
                          <span className="status-badge pending-confirmation-badge">{t('your_confirmation_pending')}</span>}
                        {conv.status === 'accepted' && (conv.isCurrentUserSender && conv.receiverConfirmed && !conv.senderConfirmed || !conv.isCurrentUserSender && conv.senderConfirmed && !conv.receiverConfirmed) &&
                          <span className="status-badge pending-confirmation-badge">{t('partner_confirmation_pending')}</span>}
                        {conv.status === 'completed' && <span className="status-badge completed-badge">{t('exchange_completed_label')}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="active-conversation-area">
              <ConversationInterface
                activeConversation={activeConversation}
                onSkillReceivedConfirmed={handleSkillReceivedConfirmation}
              />
            </div>
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

export default MessagesPage;
