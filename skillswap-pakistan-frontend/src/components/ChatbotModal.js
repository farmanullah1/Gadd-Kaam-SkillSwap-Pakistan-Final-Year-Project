import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { X, Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react';
import '../styles/chatbot-modal.css';

const ChatbotModal = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm Gadd Kaam AI. I know everything about the Marketplace, Women's Zone, and swapping skills. Ask me anything!", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // ✅ Expanded Suggestion Pool
  const allSuggestions = [
    "How do I post a skill?",
    "Is the Women Zone safe?",
    "How does swapping work?",
    "I need Tractor Repair help",
    "Can I swap cooking for coding?",
    "Where is my Dashboard?",
    "Contact Support",
    "Is this platform free?"
  ];

  // Show random 4 suggestions initially
  const [suggestions, setSuggestions] = useState(allSuggestions.slice(0, 4));
  
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/chat/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setMessages(res.data);
        }
      } catch (err) {
        console.warn("Chat history silent fail");
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    const userMsg = { text: messageText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    
    // Rotate suggestions after asking
    const randomStart = Math.floor(Math.random() * (allSuggestions.length - 3));
    setSuggestions(allSuggestions.slice(randomStart, randomStart + 3));

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/chat`, 
        { message: messageText },
        { headers }
      );
      
      setMessages(prev => [...prev, { text: res.data.reply, sender: 'bot' }]);
    } catch (err) {
      // Even if backend fails completely, show a friendly local message
      setMessages(prev => [...prev, { text: "I'm having trouble connecting to the server, but I'm here! Try asking about 'Women Zone' or 'Marketplace'.", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-overlay glass-entrance">
      <div className="chatbot-container glass-panel">
        
        <div className="chatbot-header">
          <div className="header-content">
            <div className="bot-avatar-glow">
              <Bot size={24} className="bot-icon-anim" />
              <span className="status-dot"></span>
            </div>
            <div className="header-text">
              <h4>Gadd Kaam AI</h4>
              <span className="status-text">Online & Ready</span>
            </div>
          </div>
          <div className="header-actions">
            <button onClick={() => setMessages([{ text: "How can I help you with Gadd Kaam today?", sender: 'bot' }])} className="action-btn" title="Clear Chat"><RefreshCw size={16} /></button>
            <button onClick={onClose} className="action-btn close"><X size={20} /></button>
          </div>
        </div>

        <div className="chatbot-messages custom-scrollbar">
          <div className="chat-start-time">Today</div>
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-row ${msg.sender}`}>
              {msg.sender === 'bot' && <div className="chat-icon bot"><Bot size={16} /></div>}
              <div className={`chat-bubble ${msg.sender}`}>
                {msg.text}
              </div>
              {msg.sender === 'user' && <div className="chat-icon user"><User size={16} /></div>}
            </div>
          ))}

          {loading && (
            <div className="chat-row bot">
              <div className="chat-icon bot"><Bot size={16} /></div>
              <div className="chat-bubble bot loading-bubble">
                <div className="typing-dots"><span></span><span></span><span></span></div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Suggestion Chips */}
        {!loading && (
          <div className="suggestions-container">
            {suggestions.map((s, i) => (
              <button key={i} className="suggestion-chip" onClick={() => handleSend(s)}>
                <Sparkles size={12} className="chip-icon"/> {s}
              </button>
            ))}
          </div>
        )}

        <form className="chatbot-input-area" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
          <input 
            type="text" 
            placeholder="Ask about skills, safety, etc..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className={`send-btn ${input.trim() ? 'active' : ''}`} disabled={loading || !input.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotModal;