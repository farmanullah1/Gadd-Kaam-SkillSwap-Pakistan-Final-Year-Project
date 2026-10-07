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
// Mount static directory for user and skill photos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
// Add the new skill offer routes
app.use('/api/skill-offers', require('./routes/skillOfferRoutes'));
app.use('/api/skill-suggestions', require('./routes/skillSuggestionRoutes')); 

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// =========================================================================
// Project Structure for Backend:
//
// gadd-kaam-backend/
// ├── config/
// │   ├── db.js
// │   └── keys.js
// ├── middleware/
// │   ├── auth.js
// │   ├── upload.js         (for user profile/CNIC pictures)
// │   └── uploadSkillPhoto.js (for skill offer pictures)
// ├── models/
// │   ├── SkillOffer.js
// │   └── User.js
// ├── routes/
// │   ├── authRoutes.js
// │   ├── profileRoutes.js
// │   └── skillOfferRoutes.js
// ├── uploads/              (This folder will be created automatically)
// │   └── skill_photos/     (This subfolder will be created automatically)
// ├── .env
// ├── server.js
// └── package.json
// =========================================================================