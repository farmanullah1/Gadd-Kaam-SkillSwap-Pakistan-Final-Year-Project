// src/components/SuccessPopup.js
import React from 'react';

function SuccessPopup({ message, onClose }) {
  return (
    <div className="success-popup-overlay" onClick={onClose}>
      <div className="success-popup-content" onClick={e => e.stopPropagation()}>
        <button className="success-popup-close-btn" onClick={onClose} aria-label="Close popup">
          &times;
        </button>
        <h3 className="success-popup-title">Success!</h3>
        <p className="success-popup-message">{message}</p>
      </div>
    </div>
  );
}

export default SuccessPopup;