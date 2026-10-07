import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { X, Send, Bot, User } from 'lucide-react';
import '../styles/chatbot-modal.css';

const ChatbotModal = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm the Gadd Kaam assistant. Ask me how to swap skills or use the Women Zone!", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // ✅ FIX: Use the environment variable for the API URL
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiUrl}/api/chat`, { message: userMsg.text });
      
      setMessages(prev => [...prev, { text: res.data.reply, sender: 'bot' }]);
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages(prev => [...prev, { text: "Sorry, I'm offline right now.", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-overlay">
      <div className="chatbot-container">
        {/* Header */}
        <div className="chatbot-header">
          <div className="header-info">
            <div className="bot-icon-circle"><Bot size={20} /></div>
            <div>
              <h4>Gadd Kaam AI</h4>
              <span className="online-status">● Online</span>
            </div>
          </div>
          <button onClick={onClose} className="close-btn"><X size={20} /></button>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-bubble ${msg.sender}`}>
              {msg.sender === 'bot' && <div className="bubble-icon"><Bot size={14} /></div>}
              <div className="bubble-text">{msg.text}</div>
              {msg.sender === 'user' && <div className="bubble-icon"><User size={14} /></div>}
            </div>
          ))}
          
          {loading && (
            <div className="chat-bubble bot">
              <div className="bubble-icon"><Bot size={14} /></div>
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input */}
        <form className="chatbot-input-area" onSubmit={handleSend}>
          <input 
            type="text" 
            placeholder="Ask a question..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={loading || !input.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotModal;