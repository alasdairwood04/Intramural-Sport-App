const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');

// Sports Management Routes
router.get('/sports', isAdmin, adminController.getAllSports);
router.post('/sports', isAdmin, adminController.createSport);
router.put('/sports/:id', isAdmin, adminController.updateSport);
router.delete('/sports/:id', isAdmin, adminController.deleteSport);

// Team Management Routes
router.get('/teams', isAdmin, adminController.getAllTeams);
router.post('/teams', isAdmin, adminController.createTeam);
router.put('/teams/:id', isAdmin, adminController.updateTeam);
router.delete('/teams/:id', isAdmin, adminController.deleteTeam);
// assign team captain
router.put('/teams/:id/captain', isAdmin, adminController.assignTeamCaptain);
// change team captain
router.put('/teams/:id/change-captain', isAdmin, adminController.changeTeamCaptain);

// User Management Routes
router.get('/users', isAdmin, adminController.getAllUsers);
router.put('/users/:id/role', isAdmin, adminController.updateUserRole);
router.delete('/users/:id', isAdmin, adminController.deleteUser);
router.post('/users', isAdmin, adminController.createUser);

// Season Management Routes
router.get('/seasons', isAdmin, adminController.getAllSeasons);
router.post('/seasons', isAdmin, adminController.createSeason);
router.put('/seasons/:id', isAdmin, adminController.updateSeason);
router.delete('/seasons/:id', isAdmin, adminController.deleteSeason);



// get dashboard stats
router.get('/dashboard-stats', isAdmin, adminController.getDashboardStats);
module.exports = router;