// src/components/MySkillPage.js
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import HelplinePopup from './HelplinePopup';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function MySkillPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showHelplinePopup, setShowHelplinePopup] = useState(false);
    
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

    return (
        <div className="page-container">
            <Navbar onHelplineClick={openHelplinePopup} onLogout={handleLogout} user={user} />
            <main className="main-content">
                <h1>{t("My Skills")}</h1>
                <p>This is the My Skills page. The content will be added here later.</p>
            </main>
            <Footer />
            {showHelplinePopup && <HelplinePopup onClose={closeHelplinePopup} />}
        </div>
    );
}

export default MySkillPage;
