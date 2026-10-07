// src/components/admin/ManageUsers.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/admin.css';

const UserCard = ({ u, onDelete, onView }) => (
  <div className="user-card">
    <div className="user-card-left">
      <img className="user-avatar" src={u.profilePicture ? `${process.env.REACT_APP_API_URL}/${u.profilePicture}` : `https://placehold.co/64x64`} alt={u.username} />
    </div>
    <div className="user-card-body">
      <div className="user-name">{u.firstName} {u.lastName} <span className="muted">(@{u.username})</span></div>
      <div className="user-meta">{u.email} · {u.phoneNumber}</div>
      <div className="user-meta">CNIC: {u.cnicNumber}</div>
    </div>
    <div className="user-card-actions">
      <button className="btn btn-sm" onClick={() => onView(u)}>View</button>
      <button className="btn btn-danger btn-sm" onClick={() => onDelete(u._id)}>Delete</button>
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
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!query) return setFiltered(users);
    const q = query.toLowerCase();
    setFiltered(users.filter(u =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.cnicNumber || '').toLowerCase().includes(q) ||
      (u.username || '').toLowerCase().includes(q)
    ));
  }, [query, users]);

  const deleteUser = async (id) => {
    if (!window.confirm('Delete user? This action is irreversible.')) return;
    try {
      await axios.delete(`${base}/api/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` }});
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete user');
    }
  };

  const exportCSV = () => {
    const csv = [
      ['firstName','lastName','username','email','phoneNumber','cnicNumber','gender','registrationDate'],
      ...users.map(u => [
        u.firstName, u.lastName, u.username, u.email, u.phoneNumber, u.cnicNumber, u.gender, u.registrationDate
      ])
    ].map(r => r.map(v => `"${(v||'').toString().replace(/"/g,'""')}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'users_export.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="manage-users">
      <h2>Manage Users</h2>

      <div className="toolbar">
        <input type="search" placeholder="Search by name, email, CNIC or username" value={query} onChange={(e) => setQuery(e.target.value)} />
        <div>
          <button className="btn" onClick={exportCSV}>Export</button>
        </div>
      </div>

      {loading ? <div>Loading users…</div> : (
        <>
          {filtered.length === 0 && <div>No users found.</div>}
          <div className="user-list">
            {filtered.map(u => (
              <UserCard key={u._id} u={u} onDelete={deleteUser} onView={setSelected} />
            ))}
          </div>
        </>
      )}

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>{selected.firstName} {selected.lastName} (@{selected.username})</h3>
            <img className="modal-avatar" src={selected.profilePicture ? `${base}/${selected.profilePicture}` : `https://placehold.co/128x128`} alt="avatar" />
            <p><strong>Email:</strong> {selected.email}</p>
            <p><strong>Phone:</strong> {selected.phoneNumber}</p>
            <p><strong>CNIC:</strong> {selected.cnicNumber}</p>
            <p><strong>Gender:</strong> {selected.gender}</p>
            <p><strong>Location:</strong> {selected.location || '—'}</p>
            <p><strong>About:</strong> {selected.aboutMe || '—'}</p>
            <div className="modal-actions">
              <button className="btn" onClick={() => setSelected(null)}>Close</button>
              <button className="btn btn-danger" onClick={() => { setSelected(null); deleteUser(selected._id); }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
