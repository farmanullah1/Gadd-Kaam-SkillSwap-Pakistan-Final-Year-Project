// src/components/SuccessMessageModal.js
import React from 'react';
import '../styles/popup.css';

function SuccessMessageModal({ isOpen, title, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3 className="popup-title">{title}</h3>
        <p className="popup-message">{message}</p>
        <div className="popup-actions">
          <button onClick={onClose} className="btn btn-primary-orange popup-btn">
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessMessageModal;