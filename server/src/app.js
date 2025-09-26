const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Initialize Passport config
require('./config/passport')(passport);


// --- Middleware --- 
app.use(cors({
    origin: 'http://localhost:5173', // The origin of your frontend app
    credentials: true // This allows the server to accept cookies from the client
}));

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
    cookie: { secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24  // 1 day
     } // Use secure cookies in production
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// --- Routes ---
const authRoutes = require('./routes/authRoutes');
const teamRoutes = require('./routes/teamRoutes'); 
const sportRoutes = require('./routes/sportRoutes');
const seasonRoutes = require('./routes/seasonRoutes');
const fixtureRoutes = require('./routes/fixtureRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
// --- Routers with multiple base paths ---
const notificationRoutes = require('./routes/notificationRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const leagueRoutes = require('./routes/leagueRoutes');
const teamsheetRoutes = require('./routes/teamsheetRoutes');


// -- Mount routes ---
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/sports', sportRoutes);
app.use('/api/seasons', seasonRoutes);
app.use('/api/fixtures', fixtureRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
// --- Correctly mount routers with multiple base paths ---
app.use('/api', availabilityRoutes);
app.use('/api', teamsheetRoutes);
app.use('/api', leagueRoutes);
app.use('/api', notificationRoutes);


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
