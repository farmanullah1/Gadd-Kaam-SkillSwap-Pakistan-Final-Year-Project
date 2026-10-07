// src/components/LogoutConfirmationModal.js
import React from 'react';
import '../styles/popup.css'; // Reusing your existing popup styles

function LogoutConfirmationModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3 className="popup-title">Confirm Logout</h3>
        <p className="popup-message">Are you sure you want to log out?</p>
        <div className="popup-actions">
          <button onClick={onCancel} className="btn btn-secondary-light popup-btn">
            No, Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-primary-orange popup-btn">
            Yes, Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutConfirmationModal;