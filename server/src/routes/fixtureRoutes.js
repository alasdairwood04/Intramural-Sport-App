const express = require('express');
const router = express.Router();
const fixtureController = require('../controllers/fixtureController');
const { isAuthenticated, isCaptain, isAdmin, isFixtureCaptainOrAdmin } = require('../middleware/auth');

router.post('/', isAuthenticated, isCaptain, fixtureController.createFixture);
router.get('/', isAuthenticated, fixtureController.getAllFixtures);
router.put('/:id/confirm', isAuthenticated, isCaptain, isFixtureCaptainOrAdmin, fixtureController.confirmFixture);
router.put('/:id/result', isAuthenticated, isCaptain, isAdmin, fixtureController.submitResult);
router.get('/team/:teamId', isAuthenticated, fixtureController.getFixturesByTeam);

module.exports = router;