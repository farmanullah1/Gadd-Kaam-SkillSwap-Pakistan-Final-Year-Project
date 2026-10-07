// server.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

const app = express();

// Connect to Database
connectDB();

// Init Middleware
const corsOptions = {
    origin: 'http://localhost:3000', // Allow requests from your frontend
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests for all routes
app.options('*', cors(corsOptions));

app.use(express.json({ extended: false }));

// Mount static directory for user and skill photos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/skill-offers', require('./routes/skillOfferRoutes'));
app.use('/api/skill-suggestions', require('./routes/skillSuggestionRoutes'));

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));