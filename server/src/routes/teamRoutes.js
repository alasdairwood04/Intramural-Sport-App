const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { isAuthenticated, isCaptain, isAdmin, isTeamCaptainOrAdmin } = require('../middleware/auth');

// POST - create a new team (captains and admins only)
router.post('/', isAuthenticated, isCaptain, teamController.createTeam);

// GET /api/teams/:id (get team details)
router.get('/:teamId', isAuthenticated, teamController.getTeamById);

// GET /api/teams (list all teams)
router.get('/', isAuthenticated, teamController.getAllTeams);


// PUT /api/teams/:id (update team)
router.put("/:teamId", isAuthenticated, isTeamCaptainOrAdmin, teamController.updateTeam);

// POST /api/teams/:id/members (add player)
router.post('/:teamId/members', isAuthenticated, isTeamCaptainOrAdmin, teamController.addTeamMember);

// DELETE /api/teams/:id/members (remove player)
router.delete('/:teamId/:userId', isAuthenticated, isTeamCaptainOrAdmin, teamController.removeTeamMember);


// Player requests to join a team
router.post('/:teamId/requests', isAuthenticated, teamController.requestToJoinTeam);

// Captain/Admin views pending requests
router.get('/:teamId/requests/view', isAuthenticated, isTeamCaptainOrAdmin, teamController.viewJoinRequests);

// Captain/Admin approves a request
router.post('/:teamId/requests/:requestId/approve', isAuthenticated, isTeamCaptainOrAdmin, teamController.approveJoinRequest);

// Captain/Admin rejects a request
router.post('/:teamId/requests/:requestId/reject', isAuthenticated, isTeamCaptainOrAdmin, teamController.rejectJoinRequest);


module.exports = router;