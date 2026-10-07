// skillswap-pakistan-frontend/src/components/ChatbotModal.js

import React, { useState, useEffect, useRef } from 'react';
// CSS imports are handled by index.js, no need to import here directly.

// Helper function for exponential backoff to handle API rate limits
const exponentialBackoff = async (func, maxRetries = 5, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            // Attempt to execute the provided function
            return await func();
        } catch (error) {
            // Check if the error is a "Too Many Requests" (429) and if retries are available
            if (error.response && error.response.status === 429 && i < maxRetries - 1) {
                // Wait for an exponentially increasing delay before retrying
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
            } else {
                // For other errors or after all retries, re-throw the error
                throw error;
            }
        }
    }
};

// ChatbotModal component handles the UI and logic for the AI assistant
const ChatbotModal = ({ onClose }) => {
    // State to store all messages in the chat, including user input and bot responses
    const [messages, setMessages] = useState([]);
    // State to hold the text currently being typed by the user in the input field
    const [inputMessage, setInputMessage] = useState('');
    // State to indicate whether an API call is currently in progress (e.g., waiting for bot response)
    const [isLoading, setIsLoading] = useState(false);
    // Ref to automatically scroll the message container to the bottom as new messages appear
    const messagesEndRef = useRef(null);

    // Effect hook to scroll to the latest message whenever the 'messages' state updates
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Function to send the user's prompt to the Gemini API and receive a response
    const callGeminiAPI = async (prompt) => {
        setIsLoading(true); // Set loading state to true while the API call is active
        try {
            // Construct the chat history payload for the Gemini API
            const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
            const payload = { contents: chatHistory };

            // IMPORTANT:
            // When running in the Canvas environment, set this to const apiKey = "";
            // Canvas will automatically provide the API key at runtime.
            // For local development, replace "YOUR_ACTUAL_GEMINI_API_KEY_HERE" with your key.
            const apiKey = "YOUR_GEMINI_API_KEY_HERE"; // Replace with your real API key for local testing

            // Define the REAL API endpoint for Gemini
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

            // Execute the fetch request to the Gemini API with exponential backoff for resilience
            const response = await exponentialBackoff(async () => {
                return await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            });

            // Parse the JSON response received from the API
            const result = await response.json();

            // Validate the structure of the API response to ensure it contains the expected text
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                // Extract the actual text response from the bot
                const botResponse = result.candidates[0].content.parts[0].text;
                return botResponse;
            } else {
                // Log an error if the API response structure is not as expected
                console.error("Gemini API response structure unexpected:", result);
                return "I'm sorry, I couldn't get a response from the AI."; // Fallback message
            }
        } catch (error) {
            // Log and return a user-friendly error message if the API call fails
            console.error("Error calling Gemini API:", error);
            return "There was an error connecting to the AI. Please try again."; // Fallback message
        } finally {
            setIsLoading(false); // Reset loading state once the API call completes (success or failure)
        }
    };

    // Event handler for when the user sends a message via the input form
    const handleSendMessage = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior (page reload)
        if (inputMessage.trim() === '') return; // Do not send empty messages

        // Create a new message object for the user's input
        const newUserMessage = { text: inputMessage, sender: 'user' };
        // Update the messages state to include the new user message
        setMessages(prevMessages => [...prevMessages, newUserMessage]);
        setInputMessage(''); // Clear the input field immediately after sending

        // **************************************************************************
        // START: Key modification to make the chatbot relevant
        // **************************************************************************

        // Construct a detailed system instruction for the AI.
        // This tells the AI about its role, the platform, and the context.
        const systemInstruction = `
            You are the "Gadd Kaam AI Assistant" for SkillSwap Pakistan, a web platform similar to Fiverr but focused on connecting local service providers with customers specifically within Pakistan.
            Your primary goal is to help users find, understand, and utilize local services available on Gadd Kaam.
            When responding, focus on:
            - Information about various local services (e.g., plumbing, electrical, tutoring, cleaning, web development, graphic design, etc.).
            - Guiding users on how to find and hire professionals through the Gadd Kaam platform.
            - Highlighting the benefits of using a local Pakistani service platform.
            - Providing helpful, concise, and relevant advice for users in Pakistan.
            - If a service is location-dependent, assume the user is interested in services within Pakistan, and specifically mention cities or areas if appropriate (e.g., Karachi, Lahore, Islamabad, or even Tando Muhammad Khan).
            - Avoid giving medical, legal, or financial advice. Stick strictly to local services provided via Gadd Kaam.
            - If you don't know the answer, politely state that you can only assist with services related to Gadd Kaam Pakistan.

            The user's question is: "${inputMessage}"
            `;

        // Combine the system instruction with the user's actual message
        // This combined string will be the 'prompt' sent to the Gemini API.
        const fullPrompt = systemInstruction;

        // Call the Gemini API with the enhanced prompt
        const botResponse = await callGeminiAPI(fullPrompt);

        // **************************************************************************
        // END: Key modification
        // **************************************************************************

        // Create a new message object for the bot's response
        const newBotMessage = { text: botResponse, sender: 'bot' };
        // Update the messages state to include the new bot message
        setMessages(prevMessages => [...prevMessages, newBotMessage]);
    };

    return (
        <div className="chatbot-modal-overlay"> {/* Overlay for the modal background */}
            <div className="chatbot-modal-content"> {/* Main content area of the modal */}
                <div className="chatbot-modal-header"> {/* Header section of the modal */}
                    <h3 className="chatbot-title">
                        {/* SVG icon for the chatbot */}
                        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.336-3.111A8.735 8.735 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9H7v2h2V9z" clipRule="evenodd"></path>
                        </svg>
                        Gadd Kaam AI Assistant
                    </h3>
                    {/* Close button for the modal */}
                    <button className="chatbot-close-btn" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="chatbot-messages-container"> {/* Container for displaying chat messages */}
                    {/* Display a prompt if no messages have been sent yet */}
                    {messages.length === 0 && !isLoading && (
                        <div className="text-center text-sm text-gray-500 mt-4">
                            Type a message to start the conversation!
                        </div>
                    )}
                    {/* Iterate over the messages array and display each message */}
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}`}> {/* Apply 'user' or 'bot' class for styling */}
                            {msg.text}
                        </div>
                    ))}
                    {/* Display a loading indicator when waiting for the bot's response */}
                    {isLoading && (
                        <div className="message bot">
                            <div className="flex items-center">
                                <span className="animate-pulse mr-1">.</span>
                                <span className="animate-pulse mr-1" style={{ animationDelay: '0.1s' }}>.</span>
                                <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
                            </div>
                        </div>
                    )}
                    {/* Invisible div used for scrolling to the bottom */}
                    <div ref={messagesEndRef} />
                </div>
                <form className="chatbot-input-form" onSubmit={handleSendMessage}> {/* Form for user input */}
                    <input
                        type="text"
                        className="chatbot-input"
                        placeholder="Type your message..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        disabled={isLoading} // Disable input while loading
                    />
                    {/* Send message button */}
                    <button
                        type="submit"
                        className="chatbot-send-btn"
                        disabled={isLoading} // Disable button while loading
                    >
                        {/* SVG icon for the send button */}
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatbotModal; // Export the component for use in other files
