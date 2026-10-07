// src/components/Footer.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n'; 
import { Link, useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, MessageSquare, Heart } from 'lucide-react'; 
import '../styles/footer.css';

function Footer({ user, onChatbotToggle }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSindhiMode, setIsSindhiMode] = useState(i18n.language === 'sd');

  // --- Typewriter State ---
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [typingClass, setTypingClass] = useState('typing');

  // The rotating taglines
  const taglines = [
    "Empowering communities by connecting skills, cash-free.",
    "Trade your talents, save money, and grow together.",
    "Building trust and connections through skill sharing.",
    "Your #1 platform for secure, moneyless exchanges."
  ];

  // --- Typewriter Effect Logic ---
  useEffect(() => {
    const interval = setInterval(() => {
      setTypingClass('removing'); 
      
      setTimeout(() => {
        setTaglineIndex((prev) => (prev + 1) % taglines.length); 
        setTypingClass('typing'); 
      }, 1000); 
      
    }, 6000); 

    return () => clearInterval(interval);
  }, [taglines.length]);

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
    backgroundImage: `url(/Footer-sindhi.png)`, 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  } : {};

  return (
    <footer className={`footer ${isSindhiMode ? 'sindhi-footer-mode' : ''}`} style={sindhiFooterStyle}>
      <div className="footer-container">
        
        {/* Top Section: Grid Layout */}
        <div className="footer-top-section">
          
          {/* Column 1: Brand & Typewriter */}
          <div className="footer-brand-column">
            
            {/* ✅ UPDATED LOGO TO MATCH NAVBAR STYLE */}
            <Link to="/" className="footer-logo-link">
              <div className="footer-logo-wrapper">
                <img 
                  src="/Gadd_Kaam.png" 
                  alt="Gadd Kaam Logo" 
                  className="footer-brand-img"
                  onError={(e)=>{e.target.onerror=null; e.target.src="https://placehold.co/40x40?text=GK"}}
                />
              </div>
              <span className="footer-brand-text">Gadd <span className="footer-highlight-text">Kaam</span></span>
            </Link>
            
            {/* Dynamic Typewriter Tagline */}
            <div className="footer-tagline-wrapper">
              <p className={`footer-dynamic-typewriter ${typingClass}`}>
                {taglines[taglineIndex]}
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-column">
            <h4 className="footer-heading">{t("footer_quick_links")}</h4>
            <ul className="footer-list">
              <li><Link to="/marketplace" className="footer-link" onClick={handleMarketplaceClick}>{t("navbar_marketplace")}</Link></li>
              <li><Link to="/about-us" className="footer-link">{t("navbar_about_us")}</Link></li>
              <li><Link to="/offer-skill" className="footer-link">{t("post_a_skill")}</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="footer-column">
            <h4 className="footer-heading">{t("footer_support")}</h4>
            <ul className="footer-list">
              <li><Link to="/faq-page" className="footer-link">{t("faq_link")}</Link></li>
              <li><Link to="/contact-us" className="footer-link">{t("navbar_contact")}</Link></li>
              <li><Link to="/dispute-resolution-page" className="footer-link">{t("dispute_resolution_link")}</Link></li>
            </ul>
          </div>

          {/* Column 4: Socials */}
          <div className="footer-column">
            <h4 className="footer-heading">{t("footer_follow_us")}</h4>
            <div className="social-icons">
              <a href="https://facebook.com/" className="social-icon-link fb" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com/" className="social-icon-link tw" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com/" className="social-icon-link ig" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <Instagram size={20} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="footer-bottom-section">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Gadd Kaam. Made with <Heart size={14} fill="red" color="red" style={{margin:'0 2px', display:'inline'}}/> in Pakistan.
          </p>
          <div className="footer-legal-links">
             <Link to="/privacy-policy" className="legal-link">{t("footer_privacy_policy")}</Link> 
             <span className="separator">•</span>
             <Link to="/terms-of-service" className="legal-link">{t("footer_terms_of_service")}</Link>
          </div>
        </div>

        {/* Chatbot Toggle (Floating) */}
        <div className="chatbot-icon-container float-anim" onClick={onChatbotToggle}>
          <MessageSquare size={28} />
        </div>

      </div>
    </footer>
  );
}

export default Footer;