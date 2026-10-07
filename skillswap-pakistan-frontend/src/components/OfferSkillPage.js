import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';
import '../styles/offer-skill.css';

// Import step components
import Step1 from './OfferSkillSteps/Step1';
import Step2 from './OfferSkillSteps/Step2';
import Step3 from './OfferSkillSteps/Step3';
import Step4 from './OfferSkillSteps/Step4';

function OfferSkillPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showHelplinePopup, setShowHelplinePopup] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [skillData, setSkillData] = useState({
    skills: [],
    photo: null,
    description: '',
    username: '',
    phoneNumber: '',
    location: '',
    remotely: false,
    anonymous: false,
    skillsToSwap: [],
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
  };
  
  const handleBackStep = (data) => {
    setSkillData(prevData => ({ ...prevData, ...data }));
    setCurrentStep(prevStep => prevStep - 1);
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
        return <Step4 onNext={handleNextStep} onBack={handleBackStep} data={skillData} />;
      default:
        return <Step1 onNext={handleNextStep} data={skillData} />;
    }
  };

  if (!user) {
    return null;
  }
  
  return (
    <>
      <Navbar onHelplineClick={openHelplinePopup} onLogout={handleLogout} user={user} />
      
      <div className="offer-skill-page-container">
        <div className="progress-bar">
          <div className={`progress-step ${currentStep === 1 ? 'active' : ''}`}>
            <div className="progress-step-number">1</div>
            <div className="progress-step-line"></div>
          </div>
          <div className={`progress-step ${currentStep === 2 ? 'active' : ''}`}>
            <div className="progress-step-number">2</div>
            <div className="progress-step-line"></div>
          </div>
          <div className={`progress-step ${currentStep === 3 ? 'active' : ''}`}>
            <div className="progress-step-number">3</div>
            <div className="progress-step-line"></div>
          </div>
          <div className={`progress-step ${currentStep === 4 ? 'active' : ''}`}>
            <div className="progress-step-number">4</div>
          </div>
        </div>
        
        {renderStep()}
        
      </div>
      <Footer />
      
      {showHelplinePopup && (
        <HelplinePopup onClose={closeHelplinePopup} />
      )}
    </>
  );
}

export default OfferSkillPage;
