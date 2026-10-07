// src/components/HelplinePopup.js
import React from 'react';
import { useTranslation } from 'react-i18next'; // Assuming you might translate popup content later

function HelplinePopup({ onClose }) {
  const { t } = useTranslation(); // For future translation of popup text

  return (
    <div className="helpline-popup-overlay" onClick={onClose}>
      <div className="helpline-popup-content" onClick={e => e.stopPropagation()}>
        <button className="helpline-popup-close-btn" onClick={onClose} aria-label="Close popup">
          &times;
        </button>
        <h3 className="helpline-popup-title">Helpline Number</h3>
        <p className="helpline-number">+923113147029</p>
        <p className="helpline-note">Please call us for immediate assistance.</p>
      </div>
    </div>
  );
}

export default HelplinePopup;