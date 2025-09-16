const Teamsheet = require('../models/Teamsheet');
const Team = require('../models/Team');
const Fixture = require('../models/Fixture');

exports.submitTeamsheet = async (req, res, next) => {
    try {
        const { team_id, player_ids, positions } = req.body;
        const fixture_id = req.params.id;
        
        // Validate fixture exists
        const fixture = await Fixture.findById(fixture_id);
        if (!fixture) {
            return res.status(404).json({ 
                success: false, 
                message: 'Fixture not found' 
            });
        }
        
        // Validate team is part of the fixture
        if (fixture.home_team_id !== team_id && fixture.away_team_id !== team_id) {
            return res.status(400).json({ 
                success: false, 
                message: 'This team is not part of the fixture' 
            });
        }
        
        // Validate all players are in the team
        const validationPromises = player_ids.map(playerId => 
            Team.isUserMember(team_id, playerId)
        );
        
        const validationResults = await Promise.all(validationPromises);
        const allPlayersInTeam = validationResults.every(result => result === true);
        
        if (!allPlayersInTeam) {
            return res.status(400).json({
                success: false,
                message: 'All players must be members of the team'
            });
        }
        
        // Submit teamsheet
        const newTeamsheet = await Teamsheet.submit({ 
            fixture_id, 
            team_id, 
            player_ids,
            positions
        });
        
        res.status(201).json({ success: true, data: newTeamsheet });
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