const pool = require('../config/database');
const Team = require('../models/Team'); // Import the Team model

/**
 * Checks if a user is authenticated.
 * Passport.js adds the `isAuthenticated()` method to the request object after a successful login.
 * If the user is logged in, it calls `next()` to proceed to the route handler.
 * Otherwise, it sends a 401 Unauthorized error.
 */
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'You are not authorized to access this resource.' });
};


const isTeamCaptainOrAdmin = async (req, res, next) => {
  const teamId = req.params.teamId; // Assuming teamId is passed as a route parameter
  const userId = req.user.id; // The authenticated user's ID
  const userRole = req.user.role; // The authenticated user's role

  // If the user is an admin, they have access to all teams
  if (userRole === 'admin') {
    return next();
  }

  // Check if the user is the captain of the team
  const isCaptain = await Team.isUserCaptain(teamId, userId);
  if (!isCaptain) {
    return res.status(403).json({ error: 'You do not have permission to manage this team.' });
  }
  next();
};


/**
 * Checks if the authenticated user has the role of 'captain' or 'admin'.
 * This protects routes that can be accessed by team captains and system administrators.
 * An admin should have all the permissions of a captain.
 */
const isCaptain = (req, res, next) => {
  // Your 'users' table migration defines the roles 'player', 'captain', and 'admin'.
  const userRole = req.user.role;
  if (userRole === 'captain' || userRole === 'admin') {
    return next();
  }
  // 403 Forbidden is used here because the user is authenticated, but lacks the necessary permissions.
  res.status(403).json({ error: 'You do not have permission to perform this action.' });
};

/**
 * Checks if the authenticated user has the role of 'admin'.
 * This is for protecting routes that should only be accessible to system administrators.
 */
const isAdmin = (req, res, next) => {
  if (req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ error: 'This action is restricted to administrators only.' });
};

const isFixtureCaptainOrAdmin = async (req, res, next) => {
  try {
    // Allow admin users to proceed immediately
    if (req.user.role === 'admin') {
      return next();
    }

    const fixtureId = req.params.id; // Assumes fixture ID is in req.params.id
    const userId = req.user.id;

    // 1. Get the fixture details
    const fixtureResult = await pool.query(
      `SELECT home_team_id, away_team_id FROM fixtures WHERE id = $1`,
      [fixtureId]
    );

    if (fixtureResult.rows.length === 0) {
      return res.status(404).json({ error: 'Fixture not found' });
    }

    const { home_team_id, away_team_id } = fixtureResult.rows[0];

    // 2. Check if the user is the captain of either team in the fixture
    const captainResult = await pool.query(
      `SELECT id FROM teams
       WHERE (id = $1 OR id = $2) AND captain_id = $3
       LIMIT 1`,
      [home_team_id, away_team_id, userId]
    );

    if (captainResult.rows.length === 0) {
      return res.status(403).json({ error: 'You must be an admin or a captain of a team in this fixture to perform this action.' });
    }

    // Optional: Pass the captain's team ID to the next controller
    req.captainTeamId = captainResult.rows[0].id;
    next();

  } catch (error) {
    next(error);
  }
};

module.exports = {
  isAuthenticated,
  isCaptain,
  isAdmin,
  isTeamCaptainOrAdmin,
  isFixtureCaptainOrAdmin
};