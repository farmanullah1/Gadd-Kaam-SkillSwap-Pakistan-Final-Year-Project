// src/components/SuccessMessageModal.js

import React from 'react';
import { VscClose } from 'react-icons/vsc';
import '../styles/popup.css';

// This is the correct and only declaration of the component
function SuccessMessageModal({ isOpen, title, message, onClose, type = 'info' }) {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className={`popup-content ${type}`} onClick={e => e.stopPropagation()}>
        <button className="popup-close-btn" onClick={onClose} aria-label="Close popup">
          <VscClose />
        </button>
        <h3 className="popup-title">{title}</h3>
        <p className="popup-message">{message}</p>
        <div className="popup-actions">
          <button onClick={onClose} className="btn-primary-orange popup-btn">
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessMessageModal;