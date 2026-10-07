import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/admin.css';

const ManageReports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);

  const token = localStorage.getItem('token');
  const base = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    fetchReports();
  }, []);

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

  const updateStatus = async (id, status) => {
    if (!window.confirm(`Change status to "${status}"?`)) return;
    try {
      await axios.put(`${base}/api/admin/reports/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      setReports(reports.map(r => r._id === id ? { ...r, status } : r));
      if (selectedReport && selectedReport._id === id) {
        setSelectedReport({ ...selectedReport, status });
      }
    } catch (err) {
      alert('Failed to update report status');
    }
  };

  const viewConversation = async (report) => {
    setSelectedReport(report);
    setChatLoading(true);
    setConversation([]);
    
    if (!report.requestId) {
        setChatLoading(false);
        return;
    }

    try {
      const res = await axios.get(`${base}/api/admin/reports/${report._id}/conversation`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversation(res.data.messages || []);
    } catch (err) {
      console.error("Could not load chat", err);
    } finally {
      setChatLoading(false);
    }
  };

  const banUser = async (userId) => {
    if (!window.confirm("🚨 Are you sure you want to BAN this user?")) return;
    try {
      await axios.put(`${base}/api/admin/users/${userId}/ban`, {}, { headers: { Authorization: `Bearer ${token}` }});
      alert("User has been BANNED.");
      updateStatus(selectedReport._id, 'resolved'); 
    } catch (err) {
      alert("Failed to ban user.");
    }
  };

  return (
    <div className="manage-reports">
      <h2>Manage Reports</h2>
      {loading ? <div>Loading reports...</div> : (
        <div className="report-list">
          {reports.length === 0 && <p>No reports found.</p>}
          {reports.map(r => (
            <div key={r._id} className="report-card">
              <div className="report-body">
                <div className="report-header-row">
                    <span className={`status-badge status-${r.status}`}>{r.status}</span>
                    <span className="report-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <h4>Report Against: <strong>{r.reportedUser?.username || 'Unknown'}</strong></h4>
                <p><strong>Reason:</strong> {r.description}</p>
                <p className="muted">Reported by: {r.reporter?.username}</p>
              </div>
              <div className="report-actions">
                <button className="btn btn-primary" onClick={() => viewConversation(r)}>Review Case</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedReport && (
        <div className="modal-backdrop" onClick={() => setSelectedReport(null)}>
          <div className="modal-card wide-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
                <h3>Case Review: {selectedReport.reportedUser?.username}</h3>
                <button className="close-btn" onClick={() => setSelectedReport(null)}>×</button>
            </div>
            
            <div className="case-details">
                <p><strong>Accusation:</strong> {selectedReport.description}</p>
                <div className="admin-chat-viewer">
                    <h4>Conversation Evidence</h4>
                    {chatLoading ? <div className="spinner"></div> : (
                        <div className="chat-logs">
                            {conversation.length === 0 ? (
                                <p className="no-data">No conversation log available for this report.</p>
                            ) : (
                                conversation.map((msg, idx) => (
                                    <div key={idx} className={`chat-log-msg ${msg.sender._id === selectedReport.reportedUser?._id ? 'reported-user' : 'other-user'}`}>
                                        <strong>{msg.sender.username}:</strong> {msg.text}
                                        <span className="time">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="modal-actions-bar">
              <button className="btn btn-secondary" onClick={() => updateStatus(selectedReport._id, 'dismissed')}>Dismiss Report</button>
              <button className="btn btn-danger" onClick={() => banUser(selectedReport.reportedUser?._id)}>🚨 Ban User</button>
              <button className="btn btn-success" onClick={() => updateStatus(selectedReport._id, 'resolved')}>Mark Resolved</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReports;