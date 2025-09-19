const express = require('express');
const router = express.Router();
const teamsheetController = require('../controllers/teamsheetController');
const { isAuthenticated, isFixtureCaptainOrAdmin } = require('../middleware/auth');

// POST to create a teamsheet
router.post('/fixtures/:id/teamsheet', isAuthenticated, isFixtureCaptainOrAdmin, teamsheetController.createTeamsheet);

// PUT to update a teamsheet
router.put('/fixtures/:id/teamsheet/:teamId', isAuthenticated, isFixtureCaptainOrAdmin, teamsheetController.updateTeamsheet);

// GET routes
router.get('/fixtures/:id/teamsheet/:teamId', isAuthenticated, teamsheetController.getTeamsheet);
router.get('/fixtures/:id/teamsheets', isAuthenticated, teamsheetController.getFixtureTeamsheets);

module.exports = router;