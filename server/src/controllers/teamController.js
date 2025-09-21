const Team = require('../models/Team');
const User = require('../models/User');

// Create a new team
exports.createTeam = async (req, res, next) => {
    try {
        const { name, sportName, seasonName } = req.body;
        const userId = req.user.id; // Get the logged-in user's ID from req.user
        const isAdmin = req.user.role === 'admin'; // Check if user is an admin

        const newTeam = await Team.create({ name, sportName, seasonName, userId, isAdmin });
        res.status(201).json({ success: true, data: newTeam });
    } catch (error) {
        next(error); // Pass errors to the global error handler
    }
};


// Get all teams for the currently logged-in user
exports.getAllTeams = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const teams = await Team.getAllTeams({ userId });
        res.status(200).json({ success: true, data: teams });
    } catch (error) {
        next(error); // Pass errors to the global error handler
    }
};


// Get a single team by its ID, including its members
exports.getTeamById = async (req, res, next) => {
    try {
        const teamId = req.params.teamId; // Get teamId from route parameters
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }
        const members = await Team.getMembers(teamId);
        res.status(200).json({ success: true, data: { ...team, members } }); // Include members in the response
    } catch (error) {
        next(error); // Pass errors to the global error handler
    }
};


// add a member to a team (captain only)
exports.addTeamMember = async (req, res, next) => {
    try {
        const teamId = req.params.teamId; // Get teamId from route parameters
        const email = req.body.email; // Get email from request body
    
        // 1. Find the user by email
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // 2. Check if user is already a member of the team
        const isMember = await Team.isUserMember(teamId, user.id);
        if (isMember) {
            return res.status(400).json({ success: false, message: 'User is already a member of this team' });
        }

        // 3. Get the current team's season
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }

        // 4. Check if user is in another team in the same season
        const isInOtherTeamSameSeason = await Team.isUserInAnotherTeamSameSeason(user.id, team.season_id, teamId);
        if (isInOtherTeamSameSeason) {
            return res.status(400).json({ 
                success: false, 
                message: 'User is already a member of another team in this season' 
            });
        }

        // 5. Add the user to the team_members table
        const newMember = await Team.addMember(teamId, user.id);
        res.status(201).json({ success: true, data: newMember });
    } catch (error) {
        next(error); // Pass errors to the global error handler
    }
};

// remove a member from a team (captain only)
exports.removeTeamMember = async (req, res, next) => {
    try {
        const teamId = req.params.teamId; // Get teamId from route parameters
        const userId = req.params.userId; // Get userId from route parameters

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }

        // Prevent removing the captain
        if (team.captain_id === userId) {
            return res.status(400).json({ success: false, message: 'Cannot remove the team captain' });
        }
        await Team.removeMember(teamId, userId);
        res.status(200).json({ success: true, message: 'Member removed successfully' });
    } catch (error) {
        next(error); // Pass errors to the global error handler
    }
};


exports.deleteTeam = async (req, res, next) => {
    try {
        const teamId = req.params.teamId; // Get teamId from route parameters
        const deleted = await Team.delete(teamId);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }
        res.status(200).json({ success: true, message: 'Team deleted successfully' });
    } catch (error) {
        next(error); // Pass errors to the global error handler
    }
};

// update team
exports.updateTeam = async (req, res, next) => {
    try {
        const teamId = req.params.teamId; // Get teamId from route parameters
        const updateData = req.body; // Get update data from request body
        const updatedTeam = await Team.updateTeam(teamId, updateData);
        if (!updatedTeam) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }
        res.status(200).json({ success: true, data: updatedTeam });
    } catch (error) {
        next(error); // Pass errors to the global error handler
    }
};

// ==== Team Join Requests ====

// Player requests to join a team
exports.requestToJoinTeam = async (req, res, next) => {
    try {
        const teamId = req.params.teamId;
        const userId = req.user.id; // Logged-in user

        // Optional: Check if user is already on the team
        const isMember = await Team.isUserMember(teamId, userId);
        if (isMember) {
            return res.status(400).json({ success: false, message: 'You are already a member of this team.' });
        }

        const request = await Team.createJoinRequest(teamId, userId);
        res.status(201).json({ success: true, message: 'Your request to join the team has been sent.', data: request });
    } catch (error) {
        // Handle unique constraint violation (user already requested)
        if (error.code === '23505') {
            return res.status(400).json({ success: false, message: 'You have already sent a request to join this team.' });
        }
        next(error);
    }
};

// Captain/Admin views all pending requests for their team
exports.viewJoinRequests = async (req, res, next) => {
    try {
        const teamId = req.params.teamId;
        const requests = await Team.getTeamJoinRequests(teamId);
        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        next(error);
    }
};

// Captain/Admin approves a join request
exports.approveJoinRequest = async (req, res, next) => {
    try {
        const { requestId } = req.params;
        const updatedRequest = await Team.approveJoinRequest(requestId);
        res.status(200).json({ success: true, message: 'Join request approved. User added to the team.', data: updatedRequest });
    } catch (error) {
        next(error);
    }
};

// Captain/Admin rejects a join request
exports.rejectJoinRequest = async (req, res, next) => {
    try {
        const { requestId } = req.params;
        const updatedRequest = await Team.rejectJoinRequest(requestId);
        res.status(200).json({ success: true, message: 'Join request rejected.', data: updatedRequest });
    } catch (error) {
        next(error);
    }
};

exports.getMyTeams = async (req, res, next) => {
    try {
        const userId = req.user.id; // Get the logged-in user's ID from req.user

        const teams = await Team.getUserTeams(userId);
        res.status(200).json({ success: true, data: teams });
    } catch (error) {
        next(error);
    }
};

exports.getTeamMembers = async (req, res, next) => {
    try {
        const teamId = req.params.teamId; // Get teamId from route parameters
        const members = await Team.getTeamMembers(teamId);
        res.status(200).json({ success: true, data: members });
    } catch (error) {
        next(error);
    }
};

// delete a team (captain or admin only)