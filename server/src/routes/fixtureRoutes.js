const express = require('express');
const router = express.Router();
const fixtureController = require('../controllers/fixtureController');
const { isAuthenticated, isCaptain } = require('../middleware/auth');

router.post('/', isAuthenticated, isCaptain, fixtureController.createFixture);
router.get('/', isAuthenticated, fixtureController.getAllFixtures);
router.put('/:id/confirm', isAuthenticated, isCaptain, fixtureController.confirmFixture);
router.put('/:id/result', isAuthenticated, isCaptain, fixtureController.submitResult);

module.exports = router;