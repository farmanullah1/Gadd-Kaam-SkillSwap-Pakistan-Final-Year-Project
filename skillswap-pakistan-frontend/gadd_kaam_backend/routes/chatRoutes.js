const express = require('express');
const router = express.Router();
const axios = require('axios');
const path = require('path');

// 1. Force load .env from the backend root folder
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

router.post('/', async (req, res) => {
  const { message } = req.body;

  // 2. Debug Log
  console.log("DEBUG: GEMINI_API_KEY status:", process.env.GEMINI_API_KEY ? "Loaded" : "Missing");

  if (!process.env.GEMINI_API_KEY) {
      console.error("❌ ERROR: GEMINI_API_KEY is undefined.");
      return res.status(500).json({ reply: "Server Configuration Error: API Key missing." });
  }

  const systemInstruction = `
    You are the AI Assistant for "Gadd Kaam" (SkillSwap Pakistan).
    
    ABOUT THE PLATFORM:
    - Goal: Connect local people to swap skills/services without money (barter system).
    - Key Features:
      1. Marketplace: Search for skills (plumbing, tutoring, coding, etc.).
      2. Women-Only Zone: A safe space visible only to verified female users.
      3. Chat & Negotiate: Users request a swap, chat to agree on details, then "Confirm" the exchange.
      4. Reviews: Users rate each other after a completed swap.
    
    YOUR RULES:
    - Keep answers short, friendly, and helpful.
    - If asked "How do I...?", give step-by-step instructions.
    - If asked about paid services, remind them this is a free skill-swapping platform.
    - Speak English (or Roman Urdu if the user does).
  `;

  try {
    // ✅ FIX: Using 'gemini-1.5-flash' via the v1beta endpoint.
    // This is currently the standard for free tier access.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const response = await axios.post(
      apiUrl,
      {
        contents: [
          {
            parts: [{ text: systemInstruction + "\n\nUser Question: " + message }]
          }
        ]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (response.data.candidates && response.data.candidates.length > 0) {
        const botReply = response.data.candidates[0].content.parts[0].text;
        res.json({ reply: botReply });
    } else {
        res.json({ reply: "I'm not sure how to answer that right now." });
    }

  } catch (error) {
    if (error.response) {
        console.error("AI API Error Data:", JSON.stringify(error.response.data, null, 2));
        
        // ✅ HANDLE RATE LIMIT (429) GRACEFULLY
        if (error.response.status === 429) {
             return res.json({ reply: "I'm receiving too many requests right now. Please wait 1 minute and try again! ⏳" });
        }
        
        // Handle 404 (Model not found in region) - Fallback suggestion
        if (error.response.status === 404) {
             console.error("Model not found. Your API key might not have access to 1.5-flash yet.");
             return res.json({ reply: "My AI brain is updating. Please try again later." });
        }
    } else {
        console.error("AI API Error:", error.message);
    }
    
    // Fallback error message that appears in the chat bubble
    res.json({ reply: "I'm having trouble connecting right now. Please try again in a moment." });
  }
});

module.exports = router;