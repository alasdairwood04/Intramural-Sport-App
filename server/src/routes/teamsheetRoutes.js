const express = require('express');
const router = express.Router();
const teamsheetController = require('../controllers/teamsheetController');
const { isAuthenticated, isCaptain } = require('../middleware/auth');

router.post('/fixtures/:id/teamsheet', isAuthenticated, isCaptain, teamsheetController.submitTeamsheet);
router.get('/fixtures/:id/teamsheet/:teamId', isAuthenticated, teamsheetController.getTeamsheet);

module.exports = router;