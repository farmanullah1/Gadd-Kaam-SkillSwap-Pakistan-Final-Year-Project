import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';
import LoadingSpinner from './LoadingSpinner';
import SuccessMessageModal from './SuccessMessageModal'; // Re-using for confirmation/error modals
import '../styles/my-skills.css'; // Assuming some shared styles for dashboard layout
import '../styles/messages.css';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  Home, User, Settings, ShoppingCart, Shield, Mail, MessageSquare, Star, Search, Send, CheckCircle, XCircle
} from 'lucide-react';

// Helper for placeholder images
const getPlaceholderImage = (size = 50) => `https://placehold.co/${size}x${size}/e0e0e0/666666?text=User`;

// Chat Message Bubble Component
const ChatMessage = ({ message, currentUserId }) => {
  const { t } = useTranslation();
  // Determine if the message sender is the current logged-in user
  const isCurrentUser = message.sender._id === currentUserId; // Access _id for comparison
  const messageTime = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`chat-message ${isCurrentUser ? 'current-user' : 'other-user'}`}>
      <div className="message-content">{message.text}</div>
      <div className="message-time">{messageTime}</div>
    </div>
  );
};

// Conversation Interface Component
const ConversationInterface = ({ activeConversation, onSkillReceivedConfirmed, currentUserId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const messagesEndRef = useRef(null); // Ref for scrolling to latest message

  // Scroll to bottom of messages display
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch messages for the active conversation
  const fetchMessages = useCallback(async () => {
    if (!activeConversation) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/requests/${activeConversation.requestId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Sort messages by timestamp to ensure correct order
      const sortedMessages = response.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setMessages(sortedMessages);
      // Removed immediate scrollToBottom() call here to prevent multiple scrolls if data loads in quick succession
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      // Handle error gracefully, maybe show a message to the user
    }
  }, [activeConversation]);

  // Effect to fetch messages when activeConversation changes
  useEffect(() => {
    setMessages([]); // Clear messages when conversation changes
    if (activeConversation) {
      fetchMessages();
      // Set up polling for new messages (e.g., every 5 seconds)
      const pollingInterval = setInterval(fetchMessages, 5000);
      return () => clearInterval(pollingInterval); // Clear interval on unmount or activeConversation change
    }
  }, [activeConversation, fetchMessages]);

  // Effect to scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || activeConversation.status === 'completed') return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/requests/${activeConversation.requestId}/messages`,
        { text: newMessage }, // Sender ID is automatically added by backend auth middleware
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      // Add the new message to the local state (response.data is the new message object)
      // The backend now returns the message with populated sender, so use that directly
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
      scrollToBottom(); // Scroll to bottom after sending message
    } catch (err) {
      console.error('Failed to send message:', err);
      const msg = err.response?.data?.msg || t('failed_to_send_message_error'); // Assuming you add this translation key
      setErrorMessage(msg);
      setShowErrorModal(true);
    }
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

      // Call the parent function to update conversation status
      // This response.data.request contains the updated request object from backend
      onSkillReceivedConfirmed(response.data.request, response.data.request.status === 'completed');

      // If the exchange is completed by both, redirect to reviews
      if (response.data.request.status === 'completed') {
        navigate(`/dashboard/reviews?requestId=${response.data.request._id}`, { replace: true });
      }

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
        <MessageSquare size={64} className="no-conversation-icon" />
        <p>{t('select_conversation_message')}</p>
        <p className="no-conversation-subtext">{t('choose_chat_to_start')}</p>
      </div>
    );
  }

  // Determine if the current user still needs to confirm skill received
  const needsConfirmation = (activeConversation.isCurrentUserSender && !activeConversation.senderConfirmed) ||
                            (!activeConversation.isCurrentUserSender && !activeConversation.receiverConfirmed);

  const isExchangeCompleted = activeConversation.status === 'completed';

  return (
    <div className="conversation-container">
      <div className="chat-header">
        <div className="chat-partner-info">
          <img
            src={activeConversation.profilePicUrl}
            alt={activeConversation.participant}
            className="chat-partner-avatar"
            onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(45); }}
          />
          <h3>{activeConversation.participant}</h3>
        </div>
        <div className="chat-actions">
          {needsConfirmation && ( // Show button only if user hasn't confirmed and exchange isn't completed
            <button
              className="btn btn-primary-orange chat-action-btn"
              onClick={() => setShowConfirmModal(true)}
              disabled={isExchangeCompleted} // Disable if already completed
            >
              <CheckCircle size={16} /> {t('skill_received_btn')}
            </button>
          )}
          <button className="btn btn-secondary-outline chat-action-btn">
            <XCircle size={16} /> {t('report_btn')}
          </button>
        </div>
      </div>
      <div className="messages-display">
        {messages.map(msg => (
          // Pass currentUserId to ChatMessage to determine if sender is current user
          <ChatMessage key={msg._id || Math.random()} message={msg} currentUserId={currentUserId} />
        ))}
        {/* Placeholder for scrolling to bottom */}
        <div ref={messagesEndRef} />
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
  const { t } = useTranslation();
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
  useEffect(() => {
    if (conversations.length > 0 && location.state?.activeConversationRequestId) {
      const { activeConversationRequestId } = location.state;

      const foundConv = conversations.find(conv => conv.requestId === activeConversationRequestId);
      if (foundConv) {
        setActiveConversation(foundConv);
        // Clear the state after use to prevent re-activation on subsequent visits
        navigate(location.pathname, { replace: true, state: {} });
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

      // Fetch all requests where the current user is either sender or receiver
      const requestsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/requests/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allRequests = requestsResponse.data;

      const uniqueConversationsMap = new Map();

      allRequests.forEach(req => {
        // Only consider 'accepted' or 'completed' requests for ongoing conversations
        if (req.status === 'accepted' || req.status === 'completed') {
          const isCurrentUserSender = req.sender._id === currentUserId;
          // Determine the other participant based on current user's role
          const otherParticipant = isCurrentUserSender ? req.receiver : req.sender;

          // Ensure otherParticipant is valid and has a username before proceeding
          if (!otherParticipant || !otherParticipant.username) {
              console.warn("Skipping conversation due to missing participant data for request:", req._id);
              return; // Skip this request if participant data is incomplete
          }

          const participantName = otherParticipant.username || t('anonymous_label');
          const conversationId = req._id; // Using request ID as the unique conversation ID

          // Determine the most recent message for lastMessage preview
          const lastMsg = req.messages && req.messages.length > 0
            ? req.messages[req.messages.length - 1].text // Get last actual message
            : (req.status === 'completed' ? t('exchange_completed_chat_summary') : t('chat_message_initial')); // Fallback for no messages or completed

          if (!uniqueConversationsMap.has(conversationId)) {
            uniqueConversationsMap.set(conversationId, {
              id: conversationId,
              requestId: req._id,
              participant: participantName,
              profilePicUrl: otherParticipant.profilePicture
                ? `${process.env.REACT_APP_API_URL}${otherParticipant.profilePicture.replace(/\\/g, '/')}`
                : getPlaceholderImage(),
              lastMessage: lastMsg,
              status: req.status,
              senderConfirmed: req.senderConfirmedReceived,
              receiverConfirmed: req.receiverConfirmedReceived,
              isCurrentUserSender: isCurrentUserSender,
              participantId: otherParticipant._id, // Store participant's actual ID
              skillOfferSkills: req.skillOffer && req.skillOffer.skills ? req.skillOffer.skills.join(', ') : ''
            });
          }
        }
      });

      const sortedConversations = Array.from(uniqueConversationsMap.values()).sort((a, b) => {
        // For accurate sorting by last activity, it's best if backend provides an 'updatedAt' field
        // reflecting changes to messages or status. Assuming 'id' (MongoDB ObjectId) implies creation time.
        // A more robust sort would be by last message timestamp if available directly in the conversation object,
        // or by a dedicated `lastActivityAt` field on the Request model.
        return b.id.localeCompare(a.id); // Fallback to string comparison of _id for consistent ordering
      });

      setConversations(sortedConversations);

    } catch (err) {
      console.error('Failed to fetch conversations:', err);
      // Optionally set an error state here to display to the user
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const participant = conv.participant || '';
    const lastMessage = conv.lastMessage || '';
    const skillOfferSkills = conv.skillOfferSkills || '';

    return participant.toLowerCase().includes(searchQuery.toLowerCase()) ||
           lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
           skillOfferSkills.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSkillReceivedConfirmation = (updatedRequest, completed) => {
    // Update the conversation list with the new status and confirmation flags
    setConversations(prevConversations =>
      prevConversations.map(conv => {
        if (conv.requestId === updatedRequest._id) {
          const updatedConv = {
            ...conv,
            status: updatedRequest.status,
            senderConfirmed: updatedRequest.senderConfirmedReceived,
            receiverConfirmed: updatedRequest.receiverConfirmedReceived,
            // Update lastMessage based on completion status
            lastMessage: completed ? t('exchange_completed_chat_summary') : conv.lastMessage
          };
          // If the currently active conversation is the one that was updated, also update it
          if (activeConversation && activeConversation.id === conv.id) {
              setActiveConversation(updatedConv);
          }
          return updatedConv;
        }
        return conv;
      })
    );

    // If exchange is now completed by both parties, redirect to reviews
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

        <section className="dashboard-content-area messages-page"> {/* Added messages-page class */}
          <h1 className="dashboard-welcome-heading">{t("messages_page_title")}</h1>
          <p className="dashboard-sub-heading">{t("messages_page_subtitle")}</p>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="messages-page-wrapper">
              <div className="messages-list-sidebar">
                <div className="messages-header">
                  <h1>{t('navbar_messages')}</h1>
                  <p>{t('messages_page_subtitle')}</p>
                </div>
                <div className="conversation-search">
                  <Search size={20} className="search-icon" />
                  <input
                    type="text"
                    placeholder={t('search_messages_placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field" // Use global input style
                  />
                </div>
                <div className="messages-list">
                  {filteredConversations.length > 0 ? (
                    filteredConversations.map(conv => (
                      <div
                        key={conv.id}
                        className={`conversation-list-item ${activeConversation?.id === conv.id ? 'active' : ''}`}
                        onClick={() => setActiveConversation(conv)}
                      >
                        <img
                          src={conv.profilePicUrl}
                          alt={conv.participant}
                          className="conversation-item-avatar"
                          onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(50); }}
                        />
                        <div className="conversation-item-info">
                          <h4>{conv.participant}</h4>
                          <p className="last-message-preview">{conv.lastMessage}</p>
                          {conv.status === 'accepted' && (
                            <span className={`status-badge ${
                              (conv.isCurrentUserSender && !conv.senderConfirmed) || (!conv.isCurrentUserSender && !conv.receiverConfirmed)
                                ? 'pending-confirmation-badge'
                                : '' // No badge if already confirmed by current user but not yet completed
                            }`}>
                              { (conv.isCurrentUserSender && !conv.senderConfirmed) && t('your_confirmation_pending')}
                              { (!conv.isCurrentUserSender && !conv.receiverConfirmed) && t('partner_confirmation_pending')}
                            </span>
                          )}
                           {conv.status === 'completed' && (
                            <span className="status-badge completed-badge">
                              {t('exchange_completed_label')}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-messages-found">
                      {searchQuery ? t('no_messages_found') : t('no_messages_yet')}
                    </p>
                  )}
                </div>
              </div>

              <div className="active-conversation-area">
                <ConversationInterface
                  activeConversation={activeConversation}
                  onSkillReceivedConfirmed={handleSkillReceivedConfirmation}
                  currentUserId={user.id} // Pass current user's ID for message styling
                />
              </div>
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

export default MessagesPage;
