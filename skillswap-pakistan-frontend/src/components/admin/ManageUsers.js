import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/admin.css';

const UserCard = ({ u, onBan, onDelete, onView }) => (
  <div className={`card user-card ${u.isBanned ? 'banned-user' : ''}`}>
    <div className="status-indicator" title={u.isBanned ? "Banned" : "Active"}></div>
    <img
      className="user-avatar"
      src={u.profilePicture ? `${process.env.REACT_APP_API_URL}/${u.profilePicture}` : `https://placehold.co/128x128`}
      alt={u.username}
    />
    <div className="user-info">
      <h4>{u.firstName} {u.lastName}</h4>
      <p className="muted">@{u.username}</p>
      <p className="role-tag">{u.role}</p>
    </div>
    <div className="card-actions">
      <button className="btn" onClick={() => onView(u)}>View</button>
      {u.role !== 'admin' && (
        <button 
            className={`btn ${u.isBanned ? 'btn-success' : 'btn-danger'}`} 
            onClick={() => onBan(u)}
        >
            {u.isBanned ? "Unban" : "Ban"}
        </button>
      )}
    </div>
  </div>
);

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const base = process.env.REACT_APP_API_URL || '';

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
      u.email.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q)
    ));
  }, [query, users]);

  const toggleBan = async (user) => {
    const action = user.isBanned ? "activate" : "BAN";
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      const res = await axios.put(`${base}/api/admin/users/${user._id}/ban`, {}, { 
          headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.map(u => u._id === user._id ? { ...u, isBanned: res.data.isBanned } : u));
    } catch (err) {
      alert('Failed to change user status');
    }
  };

  return (
    <div className="manage-users">
      <h2>Manage Users</h2>
      <div className="toolbar">
        <input
          type="search"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading ? <div>Loading users...</div> : (
        <div className="user-grid">
          {filtered.map(u => (
            <UserCard key={u._id} u={u} onBan={toggleBan} onView={setSelected} />
          ))}
        </div>
      )}

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <img className="modal-avatar" src={selected.profilePicture ? `${base}/${selected.profilePicture}` : `https://placehold.co/150x150`} alt="avatar" />
            <h3>{selected.firstName} {selected.lastName}</h3>
            <p><strong>Email:</strong> {selected.email}</p>
            <p><strong>Phone:</strong> {selected.phoneNumber}</p>
            <p><strong>Status:</strong> <span style={{color: selected.isBanned ? 'red' : 'green'}}>{selected.isBanned ? 'Banned' : 'Active'}</span></p>
            <div className="modal-actions">
              <button className="btn" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;