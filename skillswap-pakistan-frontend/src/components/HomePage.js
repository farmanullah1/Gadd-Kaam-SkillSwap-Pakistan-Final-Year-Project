// src/pages/HomePage.js
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar'; // Import the reusable Navbar
import Footer from '../components/Footer'; // Import the reusable Footer
import HelplinePopup from '../components/HelplinePopup'; // Import the new HelplinePopup component

function HomePage() {
  const { t } = useTranslation();
  const [showHelplinePopup, setShowHelplinePopup] = useState(false); // State for helpline popup

  // Function to open the helpline popup
  const openHelplinePopup = () => {
    setShowHelplinePopup(true);
  };

  // Function to close the helpline popup
  const closeHelplinePopup = () => {
    setShowHelplinePopup(false);
  };

  // Example data for featured skills
  const featuredSkills = [
    {
      id: 1,
      title: "Tractor Repair",
      user: "Ahmed Khan",
      rating: 4.8,
      reviews: 23,
      imageUrl: "/skill_1.jpg" // Placeholder image path
    },
    {
      id: 2,
      title: "Tailoring & Dress Making",
      user: "Fatima Bibi",
      rating: 4.9,
      reviews: 41,
      imageUrl: "/skill_2.jpg" // Placeholder image path
    },
    {
      id: 3,
      title: "Basic Computer Skills",
      user: "Ali Raza",
      rating: 4.7,
      reviews: 15,
      imageUrl: "/skill_3.jpg" // Placeholder image path
    },
    {
      id: 4,
      title: "Home Cooking Lessons",
      user: "Ayesha Malik",
      rating: 5.0,
      reviews: 30,
      imageUrl: "/skill_4.jpg" // Placeholder image path
    },
  ];

  // Example data for how it works steps
  const howItWorksSteps = [
    {
      id: 1,
      titleKey: "step1_title", // Translation key
      descriptionKey: "step1_description", // Translation key
      imageUrl: "/profile.jpg" // Placeholder image path
    },
    {
      id: 2,
      titleKey: "step2_title",
      descriptionKey: "step2_description",
      imageUrl: "/heart.jpg" // Placeholder image path
    },
    {
      id: 3,
      titleKey: "step3_title",
      descriptionKey: "step3_description",
      imageUrl: "/shield.jpg" // Placeholder image path
    },
  ];

  return (
    <div className="home-page-container">
      {/* Navbar now receives the openHelplinePopup function as a prop */}
      <Navbar onHelplineClick={openHelplinePopup} />

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
            src="/main Pic.jpg" // Placeholder image path
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
                  {/* Star Icon SVG */}
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
                  src="/person_1.jpg" // Placeholder image path
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
                  src="/person_2.jpg" // Placeholder image path
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

      <Footer /> {/* Use the reusable Footer */}

      {/* Sticky Chatbot Button */}
      <button className="chatbot-sticky-btn" aria-label="Open chatbot">
        {/* Chatbot SVG Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </button>

      {/* Helpline Popup Modal */}
      {showHelplinePopup && (
        <HelplinePopup onClose={closeHelplinePopup} />
      )}
    </div>
  );
}

export default HomePage;