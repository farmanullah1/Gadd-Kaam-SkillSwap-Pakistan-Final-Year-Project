import React from 'react';

function Step4({ onBack, onNext, data }) {
    const handleConfirmAndPublish = () => {
        // This is where we'll handle the API call in the next step
        console.log('Final Data:', data);
        onNext(data); // In a real app, this would be an API call
    };

    return (
        <div className="offer-skill-card">
            <h2>Step 4: Review & Publish</h2>
            <p className="card-subtitle">
                Please review all the details below. If everything looks good, publish your offer to the marketplace.
            </p>

            <div className="review-section">
                <div className="review-header">
                    <h3 className="review-title"><span className="icon">🚀</span>Skills You’re Offering</h3>
                    <button className="btn-edit" onClick={() => onBack(data)}>Edit</button>
                </div>
                <div className="review-details">
                    {data.skills.length > 0 ? (
                        data.skills.map((skill, index) => <p key={index}>{skill}</p>)
                    ) : (
                        <p>No skills added.</p>
                    )}
                </div>
            </div>

            <div className="review-section">
                <div className="review-header">
                    <h3 className="review-title">Your Details</h3>
                    <button className="btn-edit" onClick={() => onBack(data)}>Edit</button>
                </div>
                <div className="review-details">
                    <p>{data.description || "No description provided."}</p>
                    <div className="detail-item">
                        <span className="detail-icon">👤</span>
                        <span className="detail-text">{data.username || 'Not provided'}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-icon">📞</span>
                        <span className="detail-text">{data.phoneNumber || 'Not provided'}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-icon">📍</span>
                        <span className="detail-text">{data.location || 'Not provided'}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-icon">🌍</span>
                        <span className="detail-text">{data.remotely ? 'Available Remotely' : 'In-person only'}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-icon">👁️‍🗨️</span>
                        <span className="detail-text">{data.anonymous ? 'Go Anonymous (Hidden)' : 'Public Profile'}</span>
                    </div>
                </div>
            </div>

            <div className="review-section">
                <div className="review-header">
                    <h3 className="review-title"><span className="icon">⭐</span>Skills You Want</h3>
                    <button className="btn-edit" onClick={() => onBack(data)}>Edit</button>
                </div>
                <div className="review-details">
                    {data.skillsToSwap.length > 0 ? (
                        data.skillsToSwap.map((skill, index) => <p key={index}>{skill}</p>)
                    ) : (
                        <p>No specific skills requested in return.</p>
                    )}
                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="btn-back" onClick={() => onBack(data)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    Back
                </button>
                <button type="submit" className="btn-confirm" onClick={handleConfirmAndPublish}>
                    Confirm & Publish
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4L19 12 5 20V4z"></path></svg>
                </button>
            </div>
        </div>
    );
}

export default Step4;