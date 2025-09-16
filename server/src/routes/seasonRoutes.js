const express = require('express');
const router = express.Router();
const seasonController = require('../controllers/seasonController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', seasonController.getAllSeasons);
router.get('/active', seasonController.getActiveSeasons);
router.get('/:seasonId', seasonController.getSeasonById);

// Admin-only routes
router.post('/', isAuthenticated, isAdmin, seasonController.createSeason);
router.put('/:seasonId', isAuthenticated, isAdmin, seasonController.updateSeason);
router.delete('/:seasonId', isAuthenticated, isAdmin, seasonController.deleteSeason);

module.exports = router;