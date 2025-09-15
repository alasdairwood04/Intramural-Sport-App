const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Initialize Passport config
require('./config/passport')(passport);


// --- Middleware --- 
app.use(cors()); // Enable CORS for all routes
// body parsing middleware
app.use(express.json({ limit: '10mb' })); // To handle JSON payloads
app.use(express.urlencoded({ extended: true })); // To handle URL-encoded payloads

// health check endpoint
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Intermural Sports API is running",
        timestamp: new Date().toISOString()
    });
});

// Session middleware (must come before passport.session)
app.use(session({
    secret: process.env.SESSION_SECRET || 'defaultsecret', // Use a strong secret in production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' } // Use secure cookies in production
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// --- Routes ---
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// A simple protected route to test authentication
const { isAuthenticated } = require('./middleware/auth'); // Import your middleware
app.get('/api/profile', isAuthenticated, (req, res) => {
  // Thanks to deserializeUser, req.user contains the logged-in user's data
  res.json({ message: 'This is a protected route!', user: req.user });
});


// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

module.exports = app;
