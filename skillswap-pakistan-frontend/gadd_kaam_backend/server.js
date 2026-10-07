// server.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors'); // Import cors
const path = require('path'); // For serving static files

const app = express();

// Connect to Database
connectDB();

// Init Middleware
// Enable CORS for all routes (adjust for production)
app.use(cors());

// Body parser middleware to handle JSON data
app.use(express.json({ extended: false }));

// Serve static files from the 'uploads' directory
// This makes your uploaded profile/CNIC pictures accessible via URL
// e.g., http://localhost:5000/uploads/profilePicture-1678888888888.png
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Basic route for testing server
app.get('/', (req, res) => res.send('API Running'));

// The port for your backend server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));