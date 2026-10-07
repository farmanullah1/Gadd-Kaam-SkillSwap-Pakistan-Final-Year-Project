// src/components/admin/ManageUsers.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/admin.css';
import { User, Mail, Phone, Slash, CheckCircle } from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const base = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${base}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!query) return setFiltered(users);
    const q = query.toLowerCase();
    setFiltered(users.filter(u =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    ));
  }, [query, users]);

  const toggleBan = async (user) => {
    if (!window.confirm(`Are you sure you want to ${user.isBanned ? "unban" : "ban"} this user?`)) return;
    try {
      const res = await axios.put(`${base}/api/admin/users/${user._id}/ban`, {}, { 
          headers: { Authorization: `Bearer ${token}` }
      });
      // Update local state
      const updatedList = users.map(u => u._id === user._id ? { ...u, isBanned: res.data.isBanned } : u);
      setUsers(updatedList);
      setFiltered(updatedList); // Update filtered list too
    } catch (err) {
      alert('Failed to change user status');
    }
  };

  return (
    <div className="manage-users">
      <h2 className="admin-page-title">Manage Users</h2>
      
      <div className="search-bar-admin">
        <input
          type="search"
          placeholder="Search by name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="admin-search-input"
        />
      </div>

      {loading ? <div className="admin-loading">Loading users...</div> : (
        <div className="user-grid">
          {filtered.map(u => (
            <div key={u._id} className={`admin-user-card ${u.isBanned ? 'banned' : ''}`}>
              <div className="card-header-user">
                  <div className={`status-dot ${u.isBanned ? 'red' : 'green'}`}></div>
                  <span className="role-badge">{u.role}</span>
              </div>
              
              <div className="user-avatar-section">
                  <img 
                    src={u.profilePicture ? `${base}/${u.profilePicture}` : `https://placehold.co/100x100?text=${u.firstName?.charAt(0)}`} 
                    alt={u.username} 
                    className="avatar-lg"
                  />
                  <h3>{u.firstName} {u.lastName}</h3>
                  <p className="username">@{u.username}</p>
              </div>

              <div className="user-details-list">
                  <div className="detail-row">
                      <Mail size={14} /> <span>{u.email}</span>
                  </div>
                  <div className="detail-row">
                      <Phone size={14} /> <span>{u.phoneNumber || 'N/A'}</span>
                  </div>
              </div>

              <div className="card-footer-actions">
                  {u.role !== 'admin' && (
                    <button 
                        className={`btn-admin full-width ${u.isBanned ? 'btn-success' : 'btn-danger'}`} 
                        onClick={() => toggleBan(u)}
                    >
                        {u.isBanned ? <><CheckCircle size={16}/> Unban User</> : <><Slash size={16}/> Ban User</>}
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageUsers;