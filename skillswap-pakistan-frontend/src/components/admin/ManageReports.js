// src/components/admin/ManageReports.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/admin.css';

const ManageReports = () => {
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const base = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${base}/api/admin/reports`, { headers: { Authorization: `Bearer ${token}` } });
        setReports(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const updateStatus = async (id, status) => {
    if (!window.confirm(`Change status to "${status}"?`)) return;
    try {
      await axios.put(`${base}/api/admin/reports/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      setReports(reports.map(r => r._id === id ? { ...r, status } : r));
    } catch (err) {
      console.error(err);
      alert('Failed to update report status');
    }
  };

  return (
    <div className="manage-reports">
      <h2>Manage Reports</h2>
      {loading ? <div>Loading reports…</div> : (
        <>
          {reports.length === 0 && <div>No reports found.</div>}
          <div className="report-list">
            {reports.map(r => (
              <div key={r._id} className="report-card">
                <div className="report-body">
                  <div className="report-title">{r.title || 'User report'}</div>
                  <div className="report-desc">{r.description || r.reason || 'No description provided.'}</div>
                  <div className="muted">Status: {r.status || 'open'}</div>
                </div>
                <div className="report-actions">
                  <button className="btn" onClick={() => setSelected(r)}>View</button>
                  <button className="btn btn-success" onClick={() => updateStatus(r._id, 'resolved')}>Resolve</button>
                  <button className="btn btn-secondary" onClick={() => updateStatus(r._id, 'dismissed')}>Dismiss</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Report Details</h3>
            <p><strong>Reporter:</strong> {selected.reporter?.username || selected.reporter?.email || '—'}</p>
            <p><strong>Reported User:</strong> {selected.reportedUser?.username || '—'}</p>
            <p><strong>Reported Skill:</strong> {selected.reportedSkill?.title || '—'}</p>
            <p><strong>Description:</strong> {selected.description || '—'}</p>
            <p><strong>Status:</strong> {selected.status}</p>
            <div className="modal-actions">
              <button className="btn" onClick={() => setSelected(null)}>Close</button>
              <button className="btn btn-success" onClick={() => { updateStatus(selected._id, 'resolved'); setSelected(null); }}>Resolve</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReports;
