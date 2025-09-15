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

module.exports = {
  isAuthenticated,
  isCaptain,
  isAdmin,
};