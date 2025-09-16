const Team = require('../models/Team');
const User = require('../models/User');

// Create a new team
exports.createTeam = async (req, res, next) => {
    try {
        const { name, sportName, seasonName } = req.body;
        const userId = req.user.id; // Get the logged-in user's ID from req.user

        const newTeam = await Team.create({ name, sportName, seasonName, userId });
        res.status(201).json({ success: true, data: newTeam });
    } catch (error) {
        next(error); // Pass errors to the global error handler
    }
}


// Get all teams for the currently logged-in user
exports.getAllTeams = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const teams = await Team.getUserTeams({ userId });
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
        const members = await Team.getTeamMembers(teamId);
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

        // check if user is already a member of the team
        const isMember = await Team.isUserMember(teamId, user.id);
        if (isMember) {
            return res.status(400).json({ success: false, message: 'User is already a member of this team' });
        }

        // 2. Add the user to the team_members table
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
}



// delete a team (captain or admin only)