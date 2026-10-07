import React, { useState } from 'react';

function Step2({ onBack, onNext, data, user }) {
    const [stepData, setStepData] = useState({
        photo: data.photo,
        description: data.description,
        username: data.username,
        phoneNumber: data.phoneNumber,
        location: data.location,
        remotely: data.remotely,
        anonymous: data.anonymous,
    });
    
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'checkbox') {
            setStepData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'file') {
            setStepData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setStepData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleContinue = (e) => {
        e.preventDefault();
        onNext(stepData);
    };

    return (
        <div className="offer-skill-card">
            <h2>Step 2: Add more details</h2>
            <p className="card-subtitle">
                Add an optional photo and a description to make your listing stand out. Provide your location and contact details to help people connect with you.
            </p>
            <form onSubmit={handleContinue}>
                <div className="form-group">
                    <label>Upload a Photo (Optional)</label>
                    <div className="upload-area">
                        <input type="file" name="photo" onChange={handleChange} style={{ display: 'none' }} id="photo-upload" />
                        <label htmlFor="photo-upload" style={{ cursor: 'pointer' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="upload-icon"><path d="M21.2 15.6a5 5 0 0 1-5.3-2.6L12 7l-3.9 6c-.3.4-.6.8-1 1a5 5 0 0 1-5.3 2.6c-2.4 0-4.3 1.9-4.3 4.3s1.9 4.3 4.3 4.3h12.4c2.4 0 4.3-1.9 4.3-4.3s-1.9-4.3-4.3-4.3z"></path><path d="M12 16V4"></path><path d="M8 8l4-4 4 4"></path></svg>
                            <p className="upload-text">Click to upload or drag and drop</p>
                            <p className="upload-text">PNG, JPG, or GIF</p>
                        </label>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={stepData.description}
                        onChange={handleChange}
                        placeholder="Describe what you’re offering in more detail..."
                    ></textarea>
                </div>

                <div className="form-group-grid">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <div className="input-with-icon">
                            <span className="input-icon">👤</span>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={stepData.username}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <div className="input-with-icon">
                            <span className="input-icon">📞</span>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={stepData.phoneNumber}
                                readOnly
                            />
                        </div>
                    </div>
                </div>
                
                <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <div className="input-with-icon">
                        <span className="input-icon">📍</span>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={stepData.location}
                            onChange={handleChange}
                            placeholder="e.g., Lahore, Pakistan"
                        />
                    </div>
                </div>

                <div className="toggle-group">
                    <div className="toggle-content">
                        <span className="toggle-icon">🌐</span>
                        <div className="toggle-text">
                            <h4>Available Remotely</h4>
                            <p>Can this skill be taught or provided online?</p>
                        </div>
                    </div>
                    <label className="toggle-switch">
                        <input type="checkbox" name="remotely" checked={stepData.remotely} onChange={handleChange} />
                        <span className="slider"></span>
                    </label>
                </div>

                <div className="toggle-group">
                    <div className="toggle-content">
                        <span className="toggle-icon">👁️‍🗨️</span>
                        <div className="toggle-text">
                            <h4>Go Anonymous</h4>
                            <p>Hide your username and contact info on the listing.</p>
                        </div>
                    </div>
                    <label className="toggle-switch">
                        <input type="checkbox" name="anonymous" checked={stepData.anonymous} onChange={handleChange} />
                        <span className="slider"></span>
                    </label>
                </div>
                
                <div className="form-actions">
                    <button type="button" className="btn-back" onClick={() => onBack(stepData)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        Back
                    </button>
                    <button type="submit" className="btn-continue">
                        Continue
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Step2;