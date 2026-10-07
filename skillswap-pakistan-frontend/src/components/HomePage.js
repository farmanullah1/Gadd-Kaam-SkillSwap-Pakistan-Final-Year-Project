import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';
import { useNavigate } from 'react-router-dom';
import '../styles/homepage.css'; 

import { 
  Star, Shield, ArrowRight, User, CheckCircle, Search, Zap 
} from 'lucide-react';

function HomePage({ onChatbotToggle }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const openHelplinePopup = () => setShowHelplinePopup(true);
  const closeHelplinePopup = () => setShowHelplinePopup(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleOfferSkillClick = () => {
    user ? navigate('/offer-skill') : navigate('/login');
  };

  const handleFindSkillClick = () => {
    navigate('/marketplace');
  };

  const handleWomenZoneClick = () => {
    if (user) {
      if (user.gender === 'Female') {
        navigate('/women-zone');
      } else {
        alert("Access Restricted: This zone is for female users only.");
      }
    } else {
      navigate('/login');
    }
  };

  const featuredSkills = [
    { id: 1, title: "Tractor Repair", user: "Ahmed Khan", rating: 4.8, reviews: 23, imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=400&q=80" },
    { id: 2, title: "Tailoring & Dress Making", user: "Fatima Bibi", rating: 4.9, reviews: 41, imageUrl: "https://images.unsplash.com/photo-1528578577235-b963df6db908?auto=format&fit=crop&w=400&q=80" },
    { id: 3, title: "Basic Computer Skills", user: "Ali Raza", rating: 4.7, reviews: 15, imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=400&q=80" },
    { id: 4, title: "Home Cooking Lessons", user: "Ayesha Malik", rating: 5.0, reviews: 30, imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&w=400&q=80" },
  ];

  const howItWorksSteps = [
    { id: 1, titleKey: "step1_title", descriptionKey: "step1_description", icon: <User size={32} /> },
    { id: 2, titleKey: "step2_title", descriptionKey: "step2_description", icon: <Search size={32} /> }, 
    { id: 3, titleKey: "step3_title", descriptionKey: "step3_description", icon: <Star size={32} /> },
  ];

  return (
    <div className="home-page-container">
      <Navbar onHelplineClick={openHelplinePopup} onLogout={handleLogout} user={user} />

      {/* --- HERO SECTION --- */}
      <main className="hero-section">
        <div className="hero-content">
          <div className="hero-text-wrapper">
            <div className="hero-badge">
              <Zap size={16} fill="currentColor" /> {t('app_name')}
            </div>
            <h1 className="hero-headline">{t("hero_headline")}</h1>
            <p className="hero-subtext">{t("hero_subtext")}</p>
            <div className="hero-buttons">
              <button className="btn btn-primary-orange btn-lg" onClick={handleOfferSkillClick}>
                {t("hero_offer_skill_btn")} <ArrowRight size={20} />
              </button>
              <button className="btn btn-secondary-outline btn-lg" onClick={handleFindSkillClick}>
                {t("hero_find_skill_btn")}
              </button>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="image-stack">
                <img 
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80" 
                  alt="Community" 
                  className="hero-main-image" 
                />
            </div>
            <div className="hero-floating-card card-success">
              <CheckCircle size={24} className="icon-success" />
              <div>
                <strong>Skill Swapped!</strong>
                <span className="small-text">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- HOW IT WORKS (Redesigned) --- */}
      <section className="section-container how-it-works-section">
        <div className="section-header text-center">
          <h2 className="section-title">{t("how_it_works_title")}</h2>
          <p className="section-subtitle">{t("how_it_works_subtitle")}</p>
        </div>
        <div className="steps-grid">
          {howItWorksSteps.map((step, index) => (
            <div className="step-card" key={step.id}>
              {/* Large background number for visual depth */}
              <div className="step-number-bg">0{index + 1}</div>
              
              <div className="step-content">
                <div className="step-icon-wrapper">
                  {step.icon}
                </div>
                <h3 className="step-title">{t(step.titleKey)}</h3>
                <p className="step-description">{t(step.descriptionKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FEATURED SKILLS --- */}
      {!user && (
        <section className="section-container featured-skills-section">
          <div className="section-header flex-between">
            <div>
                <h2 className="section-title-left">{t("featured_skills_title")}</h2>
                <p className="section-subtitle left-align">Discover what's popular in your area.</p>
            </div>
            <button onClick={handleFindSkillClick} className="btn-link">
              {t("view_all_link")} <ArrowRight size={16} />
            </button>
          </div>
          <div className="skills-grid">
            {featuredSkills.map((skill) => (
              <div className="home-skill-card" key={skill.id} onClick={handleFindSkillClick}>
                <div className="skill-image-container">
                  <img src={skill.imageUrl} alt={skill.title} className="skill-image" />
                  <div className="skill-overlay">
                    <span className="view-text">{t("view_details_link")}</span>
                  </div>
                </div>
                <div className="skill-content">
                  <h3 className="skill-title">{skill.title}</h3>
                  <div className="skill-meta">
                    <span className="skill-user"><User size={14}/> {skill.user}</span>
                    <div className="skill-rating">
                      <Star size={14} fill="#e38b40" stroke="#e38b40" />
                      <span>{skill.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- WOMEN'S ZONE BANNER --- */}
      {(!user || (user && user.gender === 'Female')) && (
        <section className="section-container women-zone-section-wrapper">
          <div className="women-zone-banner">
            <div className="women-zone-text">
              <div className="badge-pink"><Shield size={16} /> {t("women_only_zone_tag")}</div>
              <h2 className="women-zone-title">{t("women_zone_title")}</h2>
              <p className="women-zone-description">{t("women_zone_description")}</p>
              <button className="btn btn-primary-pink" onClick={handleWomenZoneClick}>
                {t("women_zone_button")}
              </button>
            </div>
            <div className="women-zone-visual">
               <img src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=500&q=80" alt="Women Zone" className="women-zone-img" />
            </div>
          </div>
        </section>
      )}

      {/* --- TESTIMONIALS --- */}
      {!user && (
        <section className="section-container testimonials-section">
          <h2 className="section-title text-center">{t("testimonials_title")}</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="quote-icon">“</div>
              <p className="testimonial-quote">{t("testimonial1_quote")}</p>
              <div className="testimonial-author">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Author" className="author-avatar" />
                <div>
                  <p className="author-name">{t("testimonial1_author_name")}</p>
                  <p className="author-details">{t("testimonial1_author_details")}</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="quote-icon">“</div>
              <p className="testimonial-quote">{t("testimonial2_quote")}</p>
              <div className="testimonial-author">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Author" className="author-avatar" />
                <div>
                  <p className="author-name">{t("testimonial2_author_name")}</p>
                  <p className="author-details">{t("testimonial2_author_details")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer onChatbotToggle={onChatbotToggle} user={user} />
      {showHelplinePopup && <HelplinePopup onClose={closeHelplinePopup} />}
    </div>
  );
}

export default HomePage;