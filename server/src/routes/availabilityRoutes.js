const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const { isAuthenticated } = require('../middleware/auth');

router.post('/', isAuthenticated, availabilityController.markAvailability);
router.get('/fixtures/:id/availability', isAuthenticated, availabilityController.getTeamAvailability);
router.put('/:id', isAuthenticated, availabilityController.updateAvailability);

module.exports = router;