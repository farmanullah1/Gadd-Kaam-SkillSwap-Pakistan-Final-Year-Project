// server.js

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

const app = express();

// Connect to Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define Routes
// The authentication routes are now correctly at /api/auth
app.use('/api/auth', require('./routes/authRoutes'));
// The profile routes are now correctly at /api/profile, matching the frontend
app.use('/api/profile', require('./routes/profileRoutes'));

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));