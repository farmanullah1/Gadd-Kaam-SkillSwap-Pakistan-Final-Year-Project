// skillswap-pakistan-frontend/src/index.js

import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
// Import modular CSS files
import './styles/global.css';
import './styles/navbar.css';
import './styles/homepage.css';
import './styles/forms.css';
import './styles/footer.css';
import './styles/popup.css';
import './styles/dashboard.css';
import './styles/profile.css';
import './styles/offer-skill.css';
import './styles/my-skills.css';
import './styles/marketplace.css';
import './styles/WomenOnlyZonePage.css';
import './styles/LoadingSpinner.css';
import './styles/chatbot-modal.css'; // Make sure this CSS import is here
import './styles/requests.css'; // Ensure requests.css is imported
import './styles/reviews.css'; // NEW: Import reviews.css

// Import all your components
import HomePage from './components/HomePage';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import ProfilePage from './components/ProfilePage';
import OfferSkillPage from './components/OfferSkillPage';
import MySkillPage from './components/MySkillPage';
import MarketplacePage from './components/MarketplacePage';
import WomenOnlyZonePage from './components/WomenOnlyZonePage';
import ReceivedRequestsPage from './components/ReceivedRequestsPage';
// Import the new Messages and Reviews pages
import MessagesPage from './components/MessagesPage';
import ReviewsPage from './components/ReviewsPage';

// Import the ChatbotModal from its new, dedicated file
import ChatbotModal from './components/ChatbotModal'; // CORRECTED IMPORT PATH

import './i18n'; // Assuming you have an i18n setup here
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const RootApp = () => {
  const [showChatbot, setShowChatbot] = useState(false);

  const toggleChatbot = () => {
    setShowChatbot(prev => !prev);
  };

  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          {/* Pass the toggleChatbot function as a prop to components that need to open the chatbot */}
          {/* For example, if HomePage has the button, it needs onChatbotToggle */}
          <Route path="/" element={<HomePage onChatbotToggle={toggleChatbot} />} />
          <Route path="/signup" element={<SignupPage onChatbotToggle={toggleChatbot} />} />
          <Route path="/login" element={<LoginPage onChatbotToggle={toggleChatbot} />} />
          <Route path="/dashboard" element={<DashboardPage onChatbotToggle={toggleChatbot} />} />
          <Route path="/dashboard/profile" element={<ProfilePage onChatbotToggle={toggleChatbot} />} />
          <Route path="/dashboard/my-skills" element={<MySkillPage onChatbotToggle={toggleChatbot} />} />
          <Route path="/offer-skill" element={<OfferSkillPage onChatbotToggle={toggleChatbot} />} />
          <Route path="/marketplace" element={<MarketplacePage onChatbotToggle={toggleChatbot} />} />
          <Route path="/women-zone" element={<WomenOnlyZonePage onChatbotToggle={toggleChatbot} />} />
          <Route path="/dashboard/received-requests" element={<ReceivedRequestsPage onChatbotToggle={toggleChatbot} />} />
          {/* New Routes for Messages and Reviews */}
          <Route path="/dashboard/messages" element={<MessagesPage onChatbotToggle={toggleChatbot} />} />
          <Route path="/dashboard/reviews" element={<ReviewsPage onChatbotToggle={toggleChatbot} />} /> {/* Corrected path */}
          {/* Add more routes here as needed, remembering to pass the prop if they have the button */}
          <Route path="/about" element={<HomePage onChatbotToggle={toggleChatbot} />} />
          <Route path="/contact" element={<HomePage onChatbotToggle={toggleChatbot} />} />
          <Route path="/faq" element={<HomePage onChatbotToggle={toggleChatbot} />} />
          <Route path="/dispute" element={<HomePage onChatbotToggle={toggleChatbot} />} />
          <Route path="/privacy-policy" element={<HomePage onChatbotToggle={toggleChatbot} />} />
          <Route path="/terms-of-service" element={<HomePage onChatbotToggle={toggleChatbot} />} />
          <Route path="/forgot-password" element={<LoginPage onChatbotToggle={toggleChatbot} />} />
        </Routes>
        {/* Render the ChatbotModal here, outside the Routes, so it can overlay all pages */}
        {showChatbot && <ChatbotModal onClose={toggleChatbot} />}
      </BrowserRouter>
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RootApp />);