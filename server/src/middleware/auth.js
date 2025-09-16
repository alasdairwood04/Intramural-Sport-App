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

const isTeamFixtureCaptain = async (req, res, next) => {
  try {
    const fixtureId = req.params.id;
    const userId = req.user.id;

    // 1. Get the fixture details including home_team_id and away_team_id
    const { rows: fixtures } = await pool.query(
      `SELECT home_team_id, away_team_id FROM fixtures WHERE id = $1`,
      [fixtureId]
    );

    if (fixtures.length === 0) {
      return res.status(404).json({ error: 'Fixture not found' });
    }

    const fixture = fixtures[0];
    const { home_team_id, away_team_id } = fixture;

    // 2. Check if the user is the captain of either team
    const { rows } = await pool.query(
      `SELECT teams.id
       FROM teams
       WHERE (teams.id = $1 OR teams.id = $2) 
       AND teams.captain_id = $3
       LIMIT 1`,
      [home_team_id, away_team_id, userId]
    );

    if (rows.length === 0) {
      return res.status(403).json({ error: 'You must be a captain of one of the teams in this fixture to perform this action.' });
    }

    // Store the team ID in req for potential use in controller
    req.captainTeamId = rows[0].id;
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
  isTeamFixtureCaptain
};