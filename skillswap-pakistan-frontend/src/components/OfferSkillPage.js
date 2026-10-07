// src/components/OfferSkillPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';
import '../styles/offer-skill.css';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';

// Import step components
import Step1 from './OfferSkillSteps/Step1';
import Step2 from './OfferSkillSteps/Step2';
import Step3 from './OfferSkillSteps/Step3';
import Step4 from './OfferSkillSteps/Step4';

function OfferSkillPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [skillData, setSkillData] = useState({
    skills: [], // Changed to array for multiple skills
    photo: null,
    description: '',
    username: '',
    phoneNumber: '',
    location: '',
    remotely: false,
    anonymous: false,
    shareWithWomenZone: false,
    skillsToSwap: [], // Changed to array for multiple skills
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setSkillData(prevData => ({
        ...prevData,
        username: parsedUser.username || '',
        phoneNumber: parsedUser.phoneNumber || '',
        location: parsedUser.location || '',
        gender: parsedUser.gender || '',
      }));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const openHelplinePopup = () => setShowHelplinePopup(true);
  const closeHelplinePopup = () => setShowHelplinePopup(false);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleNextStep = (data) => {
    setSkillData(prevData => ({ ...prevData, ...data }));
    setCurrentStep(prevStep => prevStep + 1);
    setError(null); // Clear error on step change
  };
  
  const handleBackStep = () => {
    setCurrentStep(prevStep => prevStep - 1);
    setError(null); // Clear error on step change
  };

  const handlePublishSkill = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      // Append skills and skillsToSwap as JSON strings
      formDataToSend.append('skills', JSON.stringify(skillData.skills));
      formDataToSend.append('skillsToSwap', JSON.stringify(skillData.skillsToSwap));
      
      formDataToSend.append('description', skillData.description);
      formDataToSend.append('location', skillData.location);
      formDataToSend.append('remotely', skillData.remotely);
      formDataToSend.append('anonymous', skillData.anonymous);
      formDataToSend.append('shareWithWomenZone', skillData.shareWithWomenZone);
      
      if (skillData.photo) {
        formDataToSend.append('photo', skillData.photo);
      }

      await axios.post(`${process.env.REACT_APP_API_URL}/api/skill-offers`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      alert('Skill offer published successfully!');
      navigate('/dashboard/my-skills');
    } catch (err) {
      console.error('Failed to publish skill offer:', err);
      const errorMessage = err.response?.data?.message || 'Failed to publish skill offer. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 onNext={handleNextStep} data={skillData} />;
      case 2:
        return <Step2 onNext={handleNextStep} onBack={handleBackStep} data={skillData} user={user} />;
      case 3:
        return <Step3 onNext={handleNextStep} onBack={handleBackStep} data={skillData} />;
      case 4:
        return <Step4 onBack={handleBackStep} onPublish={handlePublishSkill} data={skillData} />;
      default:
        return null;
    }
  };

  if (!user) {
    return null;
  }
  
  return (
    <>
      <Navbar onHelplineClick={openHelplinePopup} onLogout={handleLogout} user={user} />
      
      <div className="offer-skill-page">
        <div className="offer-skill-header">
          <h1>{t('offer_skill_title')}</h1>
          <p>{t('offer_skill_subtitle')}</p>
        </div>
        
        <div className="offer-skill-stepper">
          <div className={`stepper-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <span className="step-circle">1</span>
            <span className="step-label">{t('step1_offer_skill')}</span>
          </div>
          <div className={`stepper-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <span className="step-circle">2</span>
            <span className="step-label">{t('step2_offer_skill')}</span>
          </div>
          <div className={`stepper-step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
            <span className="step-circle">3</span>
            <span className="step-label">{t('step3_offer_skill')}</span>
          </div>
          <div className={`stepper-step ${currentStep >= 4 ? 'active' : ''}`}>
            <span className="step-circle">4</span>
            <span className="step-label">{t('step4_offer_skill')}</span>
          </div>
          <div className="stepper-line"></div>
        </div>
        
        <div className="offer-skill-form">
          {loading ? <LoadingSpinner /> : renderStep()}
          {error && <p className="error-message">{error}</p>}
        </div>
        
      </div>
      <Footer />
      
      {showHelplinePopup && (
        <HelplinePopup onClose={closeHelplinePopup} />
      )}
    </>
  );
}

export default OfferSkillPage;