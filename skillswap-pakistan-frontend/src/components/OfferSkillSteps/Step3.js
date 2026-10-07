import React, { useState } from 'react';

function Step3({ onBack, onNext, data }) {
    const [skillsToSwap, setSkillsToSwap] = useState(data.skillsToSwap);

    const handleReviewOffer = (e) => {
        e.preventDefault();
        onNext({ skillsToSwap: skillsToSwap });
    };

    return (
        <div className="offer-skill-card">
            <div className="card-header">
                <span className="icon">⭐</span>
                <h2>Step 3: What do you want in return?</h2>
            </div>
            <p className="card-subtitle">
                Tell us what skills you’d like to swap for and discover new opportunities! Pick up to 3 skills you want to learn or improve from the list.
            </p>
            <form onSubmit={handleReviewOffer}>
                <p className="form-prompt">What new skills are you excited to swap for? ☀️</p>
                <div className="search-bar-container">
                    <span className="search-icon">🔍</span>
                    <input type="text" placeholder="Search for skills you want to learn..." />
                </div>
                {/* We'll handle skill selection here later */}
                {/* Display selected skills as chips */}
                {skillsToSwap.map((skill, index) => (
                    <div className="chip" key={index}>
                        {skill}
                        <button className="chip-close" type="button">×</button>
                    </div>
                ))}

                <div className="form-actions">
                    <button type="button" className="btn-back" onClick={() => onBack({ skillsToSwap: skillsToSwap })}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        Back
                    </button>
                    <button type="submit" className="btn-continue">
                        Review Offer
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Step3;