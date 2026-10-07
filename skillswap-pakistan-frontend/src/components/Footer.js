// src/components/Footer.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

function Footer(props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // New handler for the Marketplace link
  const handleMarketplaceClick = (e) => {
    // If no user is logged in (props.user is null),
    // prevent the default link behavior and navigate to login.
    if (!props.user) {
      e.preventDefault();
      navigate('/login');
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top-section">
          <div className="footer-logo-main">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="#e38b40"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="footer-logo-icon"
              style={{ verticalAlign: 'middle', marginRight: '8px' }}
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 1 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z"/>
            </svg>
            <span className="footer-logo-text-main">Gadd Kaam – SkillSwap</span>
          </div>
          <div className="footer-links-columns">
            <div className="footer-column">
              <h4 className="footer-heading">{t("Quick Links")}</h4>
              <ul>
                {/* UPDATED: Add the onClick handler to the Marketplace link */}
                <li><Link to="/marketplace" className="nav-link-mobile">{t("navbar_marketplace")}</Link></li>
                <li><Link to="/about" className="footer-link">{t("About Us")}</Link></li>
                <li><Link to="/offer-skill" className="footer-link">{t("Post a Skill")}</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-heading">{t("Support")}</h4>
              <ul>
                <li><Link to="/faq" className="footer-link">FAQ</Link></li>
                <li><Link to="/contact" className="footer-link">{t("Contact Us")}</Link></li>
                <li><Link to="/dispute" className="footer-link">Dispute Resolution</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-heading">{t("Follow Us")}</h4>
              <div className="social-icons">
                <a
                  href="https://facebook.com/"
                  className="social-icon-link"
                  aria-label="Follow us on Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a
                  href="https://twitter.com/"
                  className="social-icon-link"
                  aria-label="Follow us on Twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 5 8.2 12 7c-.6 1.6.6 3 2 3 .9 0 1.7-.6 2-1.5 1-.3 2-.7 3-1.3z"></path></svg>
                </a>
                <a
                  href="https://instagram.com/"
                  className="social-icon-link"
                  aria-label="Follow us on Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom-section">
            <p className="footer-copyright">
              © 2025 Gadd Kaam – SkillSwap Pakistan. All rights reserved. Privacy Policy Terms of Service.
            </p>
          </div>
        </div>
        <div className="chatbot-icon-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
