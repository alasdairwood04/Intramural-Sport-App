const Sport = require('../models/Sport');
const Team = require('../models/Team');
const User = require('../models/User');
const Season = require('../models/season');

// Controller functions for admin-related operations

// Sports Management (CRUD)
exports.getAllSports = async (req, res) => {
    try {
        const sports = await Sport.find();
        res.status(200).json(sports);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sports', error });
    }
};

exports.createSport = async (req, res) => {
    try {
        const newSport = await Sport.create(req.body);
        res.status(201).json(newSport);
    } catch (error) {
        res.status(500).json({ message: 'Error creating sport', error });
    }
};

exports.updateSport = async (req, res) => {
    try {
        const updatedSport = await Sport.update(req.params.id, req.body);
        res.status(200).json(updatedSport);
    } catch (error) {
        res.status(500).json({ message: 'Error updating sport', error });  
    }
};

exports.deleteSport = async (req, res) => {
    try {
        const deletedSport = await Sport.delete(req.params.id);
        if (deletedSport) {
            res.status(200).json({ message: 'Sport deleted successfully' });
        } else {
            res.status(404).json({ message: 'Sport not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting sport', error });   
    }
};

// Team Management (CRUD)
exports.getAllTeams = async (req, res) => {
    try {
        const teams = await Team.getAllTeams();
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching teams', error });
    }
};

exports.createTeam = async (req, res) => {
    try {
        const newTeam = await Team.create(req.body);
        res.status(201).json(newTeam);
    } catch (error) {
        res.status(500).json({ message: 'Error creating team', error });
    }
};


exports.updateTeam = async (req, res) => {
    try {
        const updatedTeam = await Team.update(req.params.id, req.body);
        res.status(200).json(updatedTeam);
    } catch (error) {
        res.status(500).json({ message: 'Error updating team', error });  
    }
};

exports.deleteTeam = async (req, res) => {
    try {
        const deletedTeam = await Team.delete(req.params.id);
        if (deletedTeam) {
            res.status(200).json({ message: 'Team deleted successfully' });
        } else {
            res.status(404).json({ message: 'Team not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting team', error });
    }
};


exports.assignTeamCaptain = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { userId } = req.body; // New captain's user ID from request body

        // Find the team and update its captain
        const updatedTeam = await Team.updateCaptain(teamId, userId);
        if (updatedTeam) {
            res.status(200).json({ message: 'Team captain assigned successfully', team: updatedTeam });
        } else {
            res.status(404).json({ message: 'Team not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error assigning team captain', error });
    }
};

exports.changeTeamCaptain = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { newCaptainId } = req.body; // New captain's user ID from request body
        // Find the team and update its captain
        const updatedTeam = await Team.updateCaptain(teamId, newCaptainId);
        if (updatedTeam) {
            res.status(200).json({ message: 'Team captain changed successfully', team: updatedTeam });
        } else {
            res.status(404).json({ message: 'Team not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error changing team captain', error });
    }
};

// User Management (CRUD)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

exports.createUser = async (req, res) => {
    try {
        const newUser = await User.createUserByAdmin(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.update(req.params.id, req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const updatedUser = await User.updateRole(req.params.id, req.body.role);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role', error });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.delete(req.params.id);
        if (deletedUser) {
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

// Season Management (CRUD)
exports.getAllSeasons = async (req, res) => {
    try {
        const seasons = await Season.getAllSeasons();
        res.status(200).json(seasons);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching seasons', error });
    }
};

exports.createSeason = async (req, res) => {
    try {
        const newSeason = await Season.create(req.body);
        res.status(201).json(newSeason);
    } catch (error) {
        res.status(500).json({ message: 'Error creating season', error });
    }
};

exports.updateSeason = async (req, res) => {
    try {
        const updatedSeason = await Season.update(req.params.id, req.body);
        res.status(200).json(updatedSeason);
    } catch (error) {
        res.status(500).json({ message: 'Error updating season', error });
    }
};

exports.deleteSeason = async (req, res) => {
    try {
        const deletedSeason = await Season.delete(req.params.id);
        if (deletedSeason) {
            res.status(200).json({ message: 'Season deleted successfully' });
        } else {
            res.status(404).json({ message: 'Season not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting season', error });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const sports = await Sport.getAllSports();
        const teams = await Team.getAllTeams();
        const users = await User.getAllUsers();
        const seasons = await Season.getAllSeasons();

        res.status(200).json({
            sports,
            teams,
            users,
            seasons
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard stats', error });
    }
};
