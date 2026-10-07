import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../styles/notifications.css';

const getProfileImageUrl = (path) => {
  if (!path) return 'https://placehold.co/40x40/e0e0e0/666666?text=U';
  if (path.startsWith('http')) return path;
  let rawPath = path.replace(/\\/g, '/');
  const formattedPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
  return `${process.env.REACT_APP_API_URL}${formattedPath}`;
};

const NotificationDropdown = ({ onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications(1, true);
  }, []);

  const fetchNotifications = async (pageNum, reset = false) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/notifications?page=${pageNum}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (reset) setNotifications(res.data.notifications);
      else setNotifications(prev => [...prev, ...res.data.notifications]);
      setHasMore(res.data.hasMore);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load notifications", err);
      setLoading(false);
    }
  };

  const handleLoadMore = (e) => {
    e.stopPropagation();
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage);
  };

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.REACT_APP_API_URL}/api/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) { console.error(err); }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`${process.env.REACT_APP_API_URL}/api/notifications/${notif._id}/read`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {}
    }
    onClose();
    switch (notif.type) {
      case 'request_received':
      case 'request_accepted':
      case 'skill_confirmed':
        navigate('/dashboard/received-requests'); break;
      case 'message':
        navigate('/dashboard/messages', { state: { activeConversationRequestId: notif.referenceId } }); break;
      case 'review_received':
        navigate('/dashboard/reviews'); break;
      default:
        navigate('/dashboard');
    }
  };

  const getTimeAgo = (dateStr) => {
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <div className="notif-header">
        <h3>{t('navbar_notifications', 'Notifications')}</h3>
        <button onClick={markAllRead} className="mark-read-btn">Mark all read</button>
      </div>
      <div className="notif-list">
        {notifications.length === 0 && !loading && (
          <div className="no-notifs"><Bell size={24} className="muted-icon" /><p>No notifications yet.</p></div>
        )}
        {notifications.map(n => (
          <div key={n._id} className={`notif-item ${!n.isRead ? 'unread' : ''}`} onClick={() => handleNotificationClick(n)}>
            <img src={getProfileImageUrl(n.sender?.profilePicture)} alt="User" className="notif-avatar" onError={(e)=>{e.target.onerror=null; e.target.src='https://placehold.co/40x40?text=U'}}/>
            <div className="notif-content">
              <p className="notif-text">{n.text}</p>
              <span className="notif-time">{getTimeAgo(n.createdAt)}</span>
            </div>
            {!n.isRead && <div className="unread-dot"></div>}
          </div>
        ))}
        {loading && <div className="notif-loading">Loading...</div>}
        {!loading && hasMore && <button className="load-more-notifs" onClick={handleLoadMore}>Load More</button>}
      </div>
    </div>
  );
};

export default NotificationDropdown;