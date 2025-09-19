const express = require('express');
const router = express.Router();
const fixtureController = require('../controllers/fixtureController');
const { isAuthenticated, isCaptain, isAdmin, isFixtureCaptainOrAdmin } = require('../middleware/auth');

router.post('/', isAuthenticated, isCaptain, fixtureController.createFixture);
router.get('/', isAuthenticated, fixtureController.getAllFixtures);

// get potential opponents for current team
router.get('/:teamId/potential-opponents', isAuthenticated, fixtureController.getPotentialOpponents);
router.put('/:id/confirm', isAuthenticated, isCaptain, isFixtureCaptainOrAdmin, fixtureController.confirmFixture);
router.put('/:id/result', isAuthenticated, isCaptain, isAdmin, fixtureController.submitResult);

// Get fixtures for a specific team
router.get('/team/:teamId', isAuthenticated, fixtureController.getFixturesByTeam);

// get team names for a specific fixture
router.get('/:fixtureId/teams', isAuthenticated, fixtureController.getTeamsByFixture);

module.exports = router;

