// gadd_kaam_backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();

// Load env vars reliably
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, 'config', '.env') });

// Connect to Database
connectDB();

// Allowed Origins for Frontend (supports both Vite default 5173 and CRA/custom 3000)
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
];
if (process.env.CLIENT_URL) {
    allowedOrigins.push(process.env.CLIENT_URL);
}

// Init Middleware
const corsOptions = {
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps, curl, postman)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true); // Permissive in dev to avoid blocking
        }
    },
    credentials: true,
    optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount static directory for images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.status(200).json({
        success: true,
        status: 'UP',
        uptime: process.uptime(),
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});

// Define Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/skill-offers', require('./routes/skillOfferRoutes'));
app.use('/api/skill-suggestions', require('./routes/skillSuggestionRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes')); 
app.use('/api/badges', require('./routes/badgeRoutes')); 
app.use('/api/notifications', require('./routes/notificationRoutes')); 
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.get('/api/locations', (req, res) => res.json(require('./utils/locations')));

app.get('/', (req, res) => res.json({ message: 'Gadd Kaam – SkillSwap Pakistan API is running' }));

// 404 Handler for Unmatched API routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`
    });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Unhandled server error:', err);
    res.status(err.status || 500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : (err.message || 'Server Error')
    });
});

// Setup HTTP Server and Socket.io
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
});

// Attach io to app so it can be used within express routes
app.set('io', io);

// Handle socket connections
io.on('connection', (socket) => {
    console.log('New WebSocket connection:', socket.id);

    // Join a user to their private channel for instant notifications
    socket.on('join_user', (userId) => {
        socket.join(userId.toString());
        console.log(`User ${userId} joined private notification channel.`);
    });

    // Join a user to a specific chat/request room
    socket.on('join_room', (roomId) => {
        socket.join(roomId.toString());
        console.log(`Socket ${socket.id} joined room: ${roomId}`);
    });

    // Leave a specific chat/request room
    socket.on('leave_room', (roomId) => {
        socket.leave(roomId.toString());
        console.log(`Socket ${socket.id} left room: ${roomId}`);
    });

    socket.on('disconnect', () => {
        console.log('WebSocket disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Graceful Shutdown
const handleShutdown = () => {
    console.log('Shutting down server gracefully...');
    server.close(async () => {
        try {
            await mongoose.connection.close();
            console.log('Database connection closed.');
            process.exit(0);
        } catch (err) {
            console.error('Error closing database connection:', err);
            process.exit(1);
        }
    });
};

process.on('SIGTERM', handleShutdown);
process.on('SIGINT', handleShutdown);