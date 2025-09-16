const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { isAuthenticated, isCaptain, isAdmin, isTeamCaptainOrAdmin } = require('../middleware/auth');

