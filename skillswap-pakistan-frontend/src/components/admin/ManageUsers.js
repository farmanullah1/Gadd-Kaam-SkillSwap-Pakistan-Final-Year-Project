import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/admin.css';

const UserCard = ({ u, onDelete, onView }) => (
  <div className="card user-card">
    <img
      className="user-avatar"
      src={u.profilePicture ? `${process.env.REACT_APP_API_URL}/${u.profilePicture}` : `https://placehold.co/128x128`}
      alt={u.username}
    />
    <div className="user-info">
      <h4>{u.firstName} {u.lastName}</h4>
      <p className="muted">@{u.username}</p>
      <p>{u.email}</p>
    </div>
    <div className="card-actions">
      <button className="btn" onClick={() => onView(u)}>View</button>
      <button className="btn btn-danger" onClick={() => onDelete(u._id)}>Delete</button>
    </div>
  </div>
);

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullImage, setFullImage] = useState(null);

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
    if (!window.confirm('⚠️ Are you sure you want to delete this user? This action cannot be undone.')) return;
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
        <input
          type="search"
          placeholder="Search by name, email, CNIC or username"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn" onClick={exportCSV}>Export</button>
      </div>

      {loading ? <div>Loading users…</div> : (
        <>
          {filtered.length === 0 && <div>No users found.</div>}
          <div className="user-grid">
            {filtered.map(u => (
              <UserCard key={u._id} u={u} onDelete={deleteUser} onView={setSelected} />
            ))}
          </div>
        </>
      )}

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <img
              className="modal-avatar"
              src={selected.profilePicture ? `${base}/${selected.profilePicture}` : `https://placehold.co/150x150`}
              alt="avatar"
            />
            <h3>{selected.firstName} {selected.lastName}</h3>
            <p className="muted">@{selected.username}</p>
            <p><strong>Email:</strong> {selected.email}</p>
            <p><strong>Phone:</strong> {selected.phoneNumber}</p>
            <p><strong>Date of Birth:</strong> {selected.dateOfBirth ? new Date(selected.dateOfBirth).toLocaleDateString() : '—'}</p>
            <p><strong>Gender:</strong> {selected.gender}</p>
            <p><strong>CNIC:</strong> {selected.cnicNumber}</p>

            <div className="cnic-pics">
              {selected.cnicFrontPicture && (
                <img
                  src={`${base}/${selected.cnicFrontPicture}`}
                  alt="CNIC Front"
                  onClick={() => setFullImage(`${base}/${selected.cnicFrontPicture}`)}
                />
              )}
              {selected.cnicBackPicture && (
                <img
                  src={`${base}/${selected.cnicBackPicture}`}
                  alt="CNIC Back"
                  onClick={() => setFullImage(`${base}/${selected.cnicBackPicture}`)}
                />
              )}
            </div>

            <div className="modal-actions">
              <button className="btn" onClick={() => setSelected(null)}>Close</button>
              <button className="btn btn-danger" onClick={() => { setSelected(null); deleteUser(selected._id); }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {fullImage && (
        <div className="fullscreen-backdrop" onClick={() => setFullImage(null)}>
          <img className="fullscreen-img" src={fullImage} alt="Full CNIC" />
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
