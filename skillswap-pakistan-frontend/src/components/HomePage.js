// src/components/HomePage.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

function HomePage() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      return JSON.parse(savedMode);
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  // New state for controlling helpline popup visibility
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const selectLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setShowLanguageOptions(false);
  };

  // Function to show the helpline popup
  const openHelplinePopup = () => {
    setShowHelplinePopup(true);
  };

  // Function to close the helpline popup
  const closeHelplinePopup = () => {
    setShowHelplinePopup(false);
  };

  const featuredSkills = [
    {
      id: 1,
      title: "Tractor Repair",
      user: "Ahmed Khan",
      rating: 4.8,
      reviews: 23,
      imageUrl: "/skill_1.jpg"
    },
    {
      id: 2,
      title: "Tailoring & Dress Making",
      user: "Fatima Bibi",
      rating: 4.9,
      reviews: 41,
      imageUrl: "/skill_2.jpg"
    },
    {
      id: 3,
      title: "Basic Computer Skills",
      user: "Ali Raza",
      rating: 4.7,
      reviews: 15,
      imageUrl: "/skill_3.jpg"
    },
    {
      id: 4,
      title: "Home Cooking Lessons",
      user: "Ayesha Malik",
      rating: 5.0,
      reviews: 30,
      imageUrl: "/skill_4.jpg"
    },
  ];

  const howItWorksSteps = [
    {
      id: 1,
      titleKey: "step1_title",
      descriptionKey: "step1_description",
      imageUrl: "/profile.jpg"
    },
    {
      id: 2,
      titleKey: "step2_title",
      descriptionKey: "step2_description",
      imageUrl: "/heart.jpg"
    },
    {
      id: 3,
      titleKey: "step3_title",
      descriptionKey: "step3_description",
      imageUrl: "/shield.jpg"
    },
  ];

  return (
    <div className="home-page-container">
      {/* New: Top Bar for Utility Buttons */}
      <div className="top-utility-bar">
          <div className="top-utility-bar-content">
              <div className="top-left-utility"></div>
              <div className="top-right-utility">
                  {/* Dark Mode Toggle */}
                  <button className="utility-btn top-utility-btn dark-mode-toggle" onClick={toggleDarkMode} aria-label={t("dark_mode_toggle")}>
                      {isDarkMode ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                      ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                      )}
                  </button>
                  {/* Language Change Button with Dropdown */}
                  <div className="language-selector-wrapper">
                      <button className="utility-btn top-utility-btn language-toggle"
                              onClick={() => setShowLanguageOptions(prev => !prev)}
                              aria-label={t("change_language")}
                              aria-haspopup="true"
                              aria-expanded={showLanguageOptions}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-globe"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                          <span className="current-lang-text">{i18n.language.toUpperCase()}</span>
                      </button>
                      {showLanguageOptions && (
                          <div className="language-options">
                              <button onClick={() => selectLanguage('sd')} className={i18n.language === 'sd' ? 'active' : ''}>{t('lang_sd')}</button>
                              <button onClick={() => selectLanguage('ur')} className={i18n.language === 'ur' ? 'active' : ''}>{t('lang_ur')}</button>
                              <button onClick={() => selectLanguage('en')} className={i18n.language === 'en' ? 'active' : ''}>{t('lang_en')}</button>
                          </div>
                      )}
                  </div>
                  {/* Phone Call Button - Now opens popup */}
                  <button className="utility-btn top-utility-btn call-helpline" onClick={openHelplinePopup} aria-label={t("call_helpline")}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </button>
              </div>
          </div>
      </div>

      {/* Top Navigation Bar - Sticky (relative to the top-utility-bar) */}
      <nav className="navbar sticky-header">
        <div className="navbar-content">
          <div className="navbar-logo">
            <img
              src="/Gadd_Kaam.jpg"
              alt="Gadd Kaam Logo"
              className="logo-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/48x48?text=GK";
              }}
            />
            Gadd Kaam
          </div>

          <div className="navbar-mobile-menu-button">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="menu-button"
              aria-label="Toggle navigation"
            >
              <svg
                className="menu-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                )}
              </svg>
            </button>
          </div>

          <div className="navbar-links-desktop">
            <a href="#" className="nav-link">
              {t("navbar_marketplace")}
            </a>
            <a href="#" className="nav-link">
              {t("navbar_about_us")}
            </a>
            <a href="#" className="nav-link">
              {t("navbar_women_zone")}
            </a>
            <a href="#" className="nav-link">
              {t("navbar_contact")}
            </a>
            <button className="btn btn-login">
              {t("navbar_login_btn")}
            </button>
            <button className="btn btn-signup">
              {t("navbar_signup_btn")}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="navbar-mobile-menu">
            <a href="#" className="nav-link-mobile">
              {t("navbar_marketplace")}
            </a>
            <a href="#" className="nav-link-mobile">
              {t("navbar_about_us")}
            </a>
            <a href="#" className="nav-link-mobile">
              {t("navbar_women_zone")}
            </a>
            <a href="#" className="nav-link-mobile">
              {t("navbar_contact")}
            </a>
            <button className="btn btn-login-mobile">
              {t("navbar_login_btn")}
            </button>
            <button className="btn btn-signup-mobile">
              {t("navbar_signup_btn")}
            </button>
          </div>
        )}
      </nav>

      {/* Main Hero Section */}
      <main className="hero-section">
        <div className="hero-content-left">
          <h1 className="hero-headline">
            {t("hero_headline")}
          </h1>
          <p className="hero-subtext">
            {t("hero_subtext")}
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary-orange">
              {t("hero_offer_skill_btn")}
            </button>
            <button className="btn btn-secondary-light">
              {t("hero_find_skill_btn")}
            </button>
          </div>
        </div>

        <div className="hero-image-right">
          <img
            src="/main Pic.jpg"
            alt="SkillSwap Illustration"
            className="hero-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/600x400?text=Image+Unavailable";
            }}
          />
        </div>
      </main>

      {/* How It Works Section */}
      <section className="section-container how-it-works-section">
        <h2 className="section-title">{t("how_it_works_title")}</h2>
        <p className="section-subtitle">{t("how_it_works_subtitle")}</p>
        <div className="how-it-works-grid">
          {howItWorksSteps.map((step) => (
            <div className="how-it-works-card" key={step.id}>
              <img
                src={step.imageUrl}
                alt={t(step.titleKey)}
                className="step-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/48x48/cccccc/ffffff?text=Icon";
                }}
              />
              <h3 className="step-title">{t(step.titleKey)}</h3>
              <p className="step-description">{t(step.descriptionKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Skills Section */}
      <section className="section-container featured-skills-section">
        <div className="featured-skills-header">
          <h2 className="section-title-left">{t("featured_skills_title")}</h2>
          <a href="#" className="view-all-link">
            {t("view_all_link")}
          </a>
        </div>
        <div className="skills-grid">
          {featuredSkills.map((skill) => (
            <div className="skill-card" key={skill.id}>
              <img
                src={skill.imageUrl}
                alt={skill.title}
                className="skill-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/400x200/cccccc/ffffff?text=Image+Error";
                }}
              />
              <div className="skill-content">
                <h3 className="skill-title">{skill.title}</h3>
                <p className="skill-user">{skill.user}</p>
                <div className="skill-rating">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="star-icon"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  <span>{skill.rating} ({skill.reviews} reviews)</span>
                </div>
                <a href="#" className="view-details-link">
                  {t("view_details_link")}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What Our Community Says Section */}
      <section className="section-container testimonials-section">
        <h2 className="section-title">{t("testimonials_title")}</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card" key="testimonial-1">
            <p className="testimonial-quote">
              "{t("testimonial1_quote")}"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">
                <img
                  src="/person_1.jpg"
                  alt={t("testimonial1_author_name")}
                  className="avatar-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/48x48/cccccc/ffffff?text=P1";
                  }}
                />
              </div>
              <div className="author-info">
                <p className="author-name">{t("testimonial1_author_name")}</p>
                <p className="author-details">{t("testimonial1_author_details")}</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card" key="testimonial-2">
            <p className="testimonial-quote">
              "{t("testimonial2_quote")}"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">
                <img
                  src="/person_2.jpg"
                  alt={t("testimonial2_author_name")}
                  className="avatar-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/48x48/cccccc/ffffff?text=P2";
                  }}
                />
              </div>
              <div className="author-info">
                <p className="author-name">{t("testimonial2_author_name")}</p>
                <p className="author-details">{t("testimonial2_author_details")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A Safe Space for Women Section */}
      <section className="section-container women-zone-section">
        <div className="women-zone-content">
          <h2 className="women-zone-title">{t("women_zone_title")}</h2>
          <p className="women-zone-description">
            {t("women_zone_description")}
          </p>
        </div>
        <button className="btn btn-primary-orange women-zone-button">
          {t("women_zone_button")}
        </button>
      </section>

      {/* Footer */}
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
                    <li><a href="#" className="footer-link">{t("navbar_marketplace")}</a></li>
                    <li><a href="#" className="footer-link">{t("navbar_about_us")}</a></li>
                    <li><a href="#" className="footer-link">{t("hero_offer_skill_btn")}</a></li>
                </ul>
            </div>
            <div className="footer-column">
                <h4 className="footer-heading">{t("footer_support")}</h4>
                <ul>
                    <li><a href="#" className="footer-link">FAQ</a></li>
                    <li><a href="#" className="footer-link">{t("navbar_contact")}</a></li>
                    <li><a href="#" className="footer-link">Dispute Resolution</a></li>
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
                <a href="#" className="footer-link">{t("footer_privacy_policy")}</a>
                <span className="footer-link-separator">|</span>
                <a href="#" className="footer-link">{t("footer_terms_of_service")}</a>
            </div>
        </div>
      </footer>

      {/* Sticky Chatbot Button */}
      <button className="chatbot-sticky-btn" aria-label="Open chatbot">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </button>

      {/* Helpline Popup Modal */}
      {showHelplinePopup && (
        <div className="helpline-popup-overlay" onClick={closeHelplinePopup}>
          <div className="helpline-popup-content" onClick={e => e.stopPropagation()}>
            <button className="helpline-popup-close-btn" onClick={closeHelplinePopup} aria-label="Close popup">
              &times;
            </button>
            <h3 className="helpline-popup-title">Helpline Number</h3>
            <p className="helpline-number">+923113147029</p>
            <p className="helpline-note">Please call us for immediate assistance.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;