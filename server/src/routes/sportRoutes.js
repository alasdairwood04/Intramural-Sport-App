const express = require('express');
const router = express.Router();
const sportController = require('../controllers/sportController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// public routes
router.get('/', sportController.getAllSports);
router.get('/:sportId', sportController.getSportById);

// admin-only routes
router.post('/', isAuthenticated, isAdmin, sportController.createSport);
router.put('/:sportId', isAuthenticated, isAdmin, sportController.updateSport);
router.delete('/:sportId', isAuthenticated, isAdmin, sportController.deleteSport);


module.exports = router;