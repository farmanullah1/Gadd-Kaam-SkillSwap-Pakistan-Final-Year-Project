import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'; // Import Link if you want footer links to use router

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-top-section">
        <div className="footer-logo-main">
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
            className="footer-logo-icon"
          >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-2.46 2.46a7 7 0 0 1-9.86 0L1 13V2l11 11 3.7-3.7z" />
            <path d="M21 21l-1.5-1.5" />
          </svg>
          <span className="footer-logo-text-main">Gadd Kaam – SkillSwap</span>
        </div>
        <p className="footer-main-tagline">{t("footer_tagline")}</p>
      </div>

      <div className="footer-links-columns">
        <div className="footer-column">
          <h4 className="footer-heading">{t("footer_quick_links")}</h4>
          <ul>
            <li><Link to="/" className="footer-link">{t("navbar_marketplace")}</Link></li>
            <li><Link to="/about" className="footer-link">{t("navbar_about_us")}</Link></li>
            <li><Link to="/offer-skill" className="footer-link">{t("hero_offer_skill_btn")}</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4 className="footer-heading">{t("footer_support")}</h4>
          <ul>
            <li><Link to="/faq" className="footer-link">FAQ</Link></li>
            <li><Link to="/contact" className="footer-link">{t("navbar_contact")}</Link></li>
            <li><Link to="/dispute" className="footer-link">Dispute Resolution</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4 className="footer-heading">{t("footer_follow_us")}</h4>
          <div className="social-icons">
            <a href="#" className="social-icon-link" aria-label="Follow us on Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="#" className="social-icon-link" aria-label="Follow us on Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 5 8.2 12 7c-.6 1.6.6 3 2 3 .9 0 1.7-.6 2-1.5 1-.3 2-.7 3-1.3z"></path></svg>
            </a>
            <a href="#" className="social-icon-link" aria-label="Follow us on Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom-links">
        <p className="footer-copyright">&copy; {new Date().getFullYear()} {t("footer_copyright")}</p>
        <div className="footer-legal-links">
          <Link to="/privacy-policy" className="footer-link">{t("footer_privacy_policy")}</Link>
          <span className="footer-link-separator">|</span>
          <Link to="/terms-of-service" className="footer-link">{t("footer_terms_of_service")}</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;