import React, { useState } from 'react';

function Step1({ onNext, data }) {
    const [selectedSkills, setSelectedSkills] = useState(data.skills);

    const handleContinue = (e) => {
        e.preventDefault();
        onNext({ skills: selectedSkills });
    };

    return (
        <div className="offer-skill-card">
            <div className="card-header">
                <span className="icon">🚀</span>
                <h2>Step 1: What can you offer?</h2>
            </div>
            <p className="card-subtitle">
                Share your expertise and help others while learning something new! Choose up to 3 skills you’re confident in from the list below, or search for your own.
            </p>
            <form onSubmit={handleContinue}>
                <p className="form-prompt">Which top skills would you love to offer others? 🚀</p>
                <div className="search-bar-container">
                    <span className="search-icon">🔍</span>
                    <input type="text" placeholder="Search for skills to offer..." />
                </div>
                {/* We'll handle skill selection here later */}
                {/* Display selected skills as chips */}
                {selectedSkills.map((skill, index) => (
                    <div className="chip" key={index}>
                        {skill}
                        <button className="chip-close" type="button">×</button>
                    </div>
                ))}
                
                <div style={{ textAlign: 'right' }}>
                    <button type="submit" className="btn-continue">
                        Continue
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Step1;