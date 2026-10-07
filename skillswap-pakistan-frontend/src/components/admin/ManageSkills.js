// src/components/admin/ManageSkills.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/admin.css';

const ManageSkills = () => {
  const [skills, setSkills] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const base = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${base}/api/admin/skills`, { headers: { Authorization: `Bearer ${token}` } });
        setSkills(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const deleteSkill = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    try {
      await axios.delete(`${base}/api/admin/skills/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setSkills(skills.filter(s => s._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete skill');
    }
  };

  return (
    <div className="manage-skills">
      <h2>Manage Skills</h2>
      {loading ? <div>Loading skills…</div> : (
        <>
          {skills.length === 0 && <div>No skills available.</div>}
          <div className="skill-list">
            {skills.map(s => (
              <div className="skill-card" key={s._id}>
                <div className="skill-card-body">
                  <div className="skill-title">{s.skills ? s.skills.join(', ') : (s.title || 'Skill')}</div>
                  <div className="skill-desc">{s.description || 'No description'}</div>
                </div>
                <div className="skill-actions">
                  <button className="btn" onClick={() => setSelected(s)}>View</button>
                  <button className="btn btn-danger" onClick={() => deleteSkill(s._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Skill Details</h3>
            <p><strong>Skills:</strong> {selected.skills ? selected.skills.join(', ') : '—'}</p>
            <p><strong>Description:</strong> {selected.description || '—'}</p>
            <p><strong>Location:</strong> {selected.location || '—'}</p>
            <p><strong>Anonymous:</strong> {selected.anonymous ? 'Yes' : 'No'}</p>
            <div className="modal-actions">
              <button className="btn" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSkills;
