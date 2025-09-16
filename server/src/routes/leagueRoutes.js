const express = require('express');
const router = express.Router();
const leagueController = require('../controllers/leagueController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/leagues/:seasonId/:sportId', isAuthenticated, leagueController.getLeagueStandings);
router.get('/teams/:id/stats', isAuthenticated, leagueController.getTeamStats);
router.get('/players/:id/stats', isAuthenticated, leagueController.getPlayerStats);

module.exports = router;