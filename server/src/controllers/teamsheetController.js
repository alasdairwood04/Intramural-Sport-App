const Teamsheet = require('../models/Teamsheet');

exports.submitTeamsheet = async (req, res, next) => {
    try {
        const { team_id, player_ids } = req.body;
        const fixture_id = req.params.id;
        const newTeamsheet = await Teamsheet.submit({ fixture_id, team_id, player_ids });
        res.status(201).json({ success: true, data: newTeamsheet });
    } catch (error) {
        next(error);
    }
};

exports.getTeamsheet = async (req, res, next) => {
    try {
        const { id, teamId } = req.params;
        const teamsheet = await Teamsheet.get(id, teamId);
        if (!teamsheet) {
            return res.status(404).json({ success: false, message: 'Teamsheet not found' });
        }
        res.status(200).json({ success: true, data: teamsheet });
    } catch (error) {
        next(error);
    }
};