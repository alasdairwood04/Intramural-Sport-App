const Teamsheet = require('../models/Teamsheet');
const Team = require('../models/Team');
const Fixture = require('../models/Fixture');

exports.createTeamsheet = async (req, res, next) => {
    try {
        const { team_id, player_ids } = req.body;
        const fixture_id = req.params.id;

        // Validation can be added here (e.g., check players are on the team)
        
        const newTeamsheet = await Teamsheet.create({ 
            fixture_id, 
            team_id, 
            player_ids,
        });
        
        res.status(201).json({ success: true, data: newTeamsheet });
    } catch (error) {
        next(error);
    }
};

// Update an existing teamsheet
exports.updateTeamsheet = async (req, res, next) => {
    try {
        const { player_ids } = req.body;
        const { id: fixture_id, teamId: team_id } = req.params;

        // Validation can be added here
        
        const updatedTeamsheet = await Teamsheet.update(fixture_id, team_id, { player_ids });
        
        res.status(200).json({ success: true, data: updatedTeamsheet });
    } catch (error) {
        next(error);
    }
};
exports.getTeamsheet = async (req, res, next) => {
    try {
        const { id: fixtureId, teamId } = req.params;
        const teamsheet = await Teamsheet.get(fixtureId, teamId);
        
        if (!teamsheet) {
            return res.status(404).json({ 
                success: false, 
                message: 'Teamsheet not found' 
            });
        }
        
        res.status(200).json({ success: true, data: teamsheet });
    } catch (error) {
        next(error);
    }
};

// Get both teamsheets for a fixture
exports.getFixtureTeamsheets = async (req, res, next) => {
    try {
        const fixtureId = req.params.id;
        
        // Get the fixture to find both teams
        const fixture = await Fixture.findById(fixtureId);
        if (!fixture) {
            return res.status(404).json({ 
                success: false, 
                message: 'Fixture not found' 
            });
        }
        
        // Get teamsheets for both teams
        const homeTeamsheet = await Teamsheet.get(fixtureId, fixture.home_team_id);
        const awayTeamsheet = await Teamsheet.get(fixtureId, fixture.away_team_id);
        
        res.status(200).json({
            success: true,
            data: {
                fixture: fixture,
                home_teamsheet: homeTeamsheet,
                away_teamsheet: awayTeamsheet
            }
        });
    } catch (error) {
        next(error);
    }
};