// src/components/Footer.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n'; 
import { Link, useNavigate } from 'react-router-dom';
import '../styles/footer.css'; // Ensure CSS is imported

function Footer({ user, onChatbotToggle }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSindhiMode, setIsSindhiMode] = useState(i18n.language === 'sd');

  useEffect(() => {
    const handleLanguageChange = (lng) => setIsSindhiMode(lng === 'sd');
    i18n.on('languageChanged', handleLanguageChange);
    setIsSindhiMode(i18n.language === 'sd');
    return () => i18n.off('languageChanged', handleLanguageChange);
  }, []);

  const handleMarketplaceClick = (e) => {
    if (!user) {
      e.preventDefault();
      navigate('/login');
    }
  };

  const sindhiFooterStyle = isSindhiMode ? {
    backgroundImage: `url(/Footer-sindhi.png)`, // Ensure path is correct in public folder
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  } : {};

  return (
    <footer className={`footer ${isSindhiMode ? 'sindhi-footer-mode' : ''}`} style={sindhiFooterStyle}>
      <div className="footer-container">
        
        {/* Top Section: Grid Layout */}
        <div className="footer-top-section">
          
          {/* Column 1: Brand */}
          <div className="footer-brand-column">
            <div className="footer-logo-main">
              <img src="/Gadd_Kaam.jpg" alt="Logo" style={{width:'32px', height:'32px', borderRadius:'6px'}} onError={(e)=>{e.target.onerror=null; e.target.src="https://placehold.co/32x32?text=GK"}}/>
              <span className="footer-logo-text-main">Gadd Kaam</span>
            </div>
            <p className="footer-main-tagline">
              SkillSwap Pakistan is a community where you can exchange your talents for the help you need, all without money.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-column">
            <h4 className="footer-heading">{t("footer_quick_links")}</h4>
            <ul>
              <li><Link to="/marketplace" className="footer-link" onClick={handleMarketplaceClick}>{t("navbar_marketplace")}</Link></li>
              <li><Link to="/about-us" className="footer-link">{t("navbar_about_us")}</Link></li>
              <li><Link to="/offer-skill" className="footer-link">{t("post_a_skill")}</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="footer-column">
            <h4 className="footer-heading">{t("footer_support")}</h4>
            <ul>
              <li><Link to="/faq-page" className="footer-link">{t("faq_link")}</Link></li>
              <li><Link to="/contact-us" className="footer-link">{t("navbar_contact")}</Link></li>
              <li><Link to="/dispute-resolution-page" className="footer-link">{t("dispute_resolution_link")}</Link></li>
            </ul>
          </div>

          {/* Column 4: Socials */}
          <div className="footer-column">
            <h4 className="footer-heading">{t("footer_follow_us")}</h4>
            <div className="social-icons">
              <a href="https://facebook.com/" className="social-icon-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://twitter.com/" className="social-icon-link" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 5 8.2 12 7c-.6 1.6.6 3 2 3 .9 0 1.7-.6 2-1.5 1-.3 2-.7 3-1.3z"></path></svg>
              </a>
              <a href="https://instagram.com/" className="social-icon-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="footer-bottom-section">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Gadd Kaam. {t("all_rights_reserved")}. 
            <span style={{margin: '0 8px'}}>|</span>
            <Link to="/privacy-policy">{t("footer_privacy_policy")}</Link> 
            <span style={{margin: '0 8px'}}>|</span>
            <Link to="/terms-of-service">{t("footer_terms_of_service")}</Link>
          </p>
        </div>

        {/* Chatbot Toggle */}
        <div className="chatbot-icon-container" onClick={onChatbotToggle}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>

      </div>
    </footer>
  );
}

export default Footer;