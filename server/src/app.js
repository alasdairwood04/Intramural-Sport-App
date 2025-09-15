const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

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
// API routes
// app.use('/api/auth', authRoutes);

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
