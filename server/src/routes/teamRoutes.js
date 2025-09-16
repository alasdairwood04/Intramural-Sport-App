const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { isAuthenticated, isCaptain, isAdmin, isTeamCaptainOrAdmin } = require('../middleware/auth');

// POST - create a new team (captains and admins only)
router.post('/', isAuthenticated, isCaptain, teamController.createTeam);

// GET /api/teams/:id (get team details)
router.get('/:teamId', isAuthenticated, teamController.getTeamById);

// PUT /api/teams/:id (update team)
router.put("/:teamId", isAuthenticated, isTeamCaptainOrAdmin, teamController.updateTeam);

// POST /api/teams/:id/members (add player)
router.post('/:teamId/members', isAuthenticated, isTeamCaptainOrAdmin, teamController.addTeamMember);

// DELETE /api/teams/:id/members (remove player)
router.delete('/:teamId/members', isAuthenticated, isTeamCaptainOrAdmin, teamController.removeTeamMember);