const express = require('express');
const router = express.Router();
const teamsheetController = require('../controllers/teamsheetController');
const { isAuthenticated, isCaptain, isFixtureCaptainOrAdmin } = require('../middleware/auth');

// Submit a teamsheet (captain of the team only)
router.post('/fixtures/:id/teamsheet', isAuthenticated, isFixtureCaptainOrAdmin, teamsheetController.submitTeamsheet);

// Get a specific teamsheet
router.get('/fixtures/:id/teamsheet/:teamId', isAuthenticated, teamsheetController.getTeamsheet);

// Get both teamsheets for a fixture
router.get('/fixtures/:id/teamsheets', isAuthenticated, teamsheetController.getFixtureTeamsheets);

module.exports = router;