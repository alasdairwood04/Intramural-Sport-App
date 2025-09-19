import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTeamById } from '../api/teamsApi';
import { getTeamsheet, createTeamsheet, updateTeamsheet } from '../api/teamsheetApi';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const TeamsheetPage = () => {
    const { fixtureId, teamId } = useParams();
    const { user } = useAuth();
    const [team, setTeam] = useState(null);
    const [existingTeamsheet, setExistingTeamsheet] = useState(null);
    const [selectedPlayers, setSelectedPlayers] = useState(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const isCaptain = user?.id === team?.captain_id;

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const teamResponse = await getTeamById(teamId);
            setTeam(teamResponse.data.data);

            try {
                const teamsheetResponse = await getTeamsheet(fixtureId, teamId);
                const fetchedTeamsheet = teamsheetResponse.data.data;
                if (fetchedTeamsheet) {
                    setExistingTeamsheet(fetchedTeamsheet);
                    setSelectedPlayers(new Set(fetchedTeamsheet.players.map(p => p.player_id)));
                }
            } catch (err) {
                if (err.response && err.response.status !== 404) throw err;
            }
        } catch (err) {
            setError('Failed to fetch data.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [fixtureId, teamId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handlePlayerSelection = (playerId) => {
        const newSelection = new Set(selectedPlayers);
        newSelection.has(playerId) ? newSelection.delete(playerId) : newSelection.add(playerId);
        setSelectedPlayers(newSelection);
    };

    const handleSaveTeamsheet = async () => {
        const teamsheetData = {
            team_id: teamId,
            player_ids: Array.from(selectedPlayers),
        };

        try {
            let updatedTeamsheet;
            if (existingTeamsheet) {
                const response = await updateTeamsheet(fixtureId, teamId, teamsheetData);
                updatedTeamsheet = response.data.data;
            } else {
                const response = await createTeamsheet(fixtureId, teamsheetData);
                updatedTeamsheet = response.data.data;
            }
            setExistingTeamsheet(updatedTeamsheet);
            alert('Teamsheet saved successfully!');
        } catch (err) {
            setError('Failed to save teamsheet.');
            console.error(err);
        }
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="space-y-6">
            <Link to={`/teams/${teamId}`} className="text-blue-600 hover:underline">&larr; Back to Team Details</Link>
            <h1 className="text-3xl font-bold">Teamsheet for Fixture</h1>
            <Card>
                <h2 className="text-xl font-semibold mb-4">Select Players</h2>
                <div className="space-y-3">
                    {team?.members.map(member => (
                        <div key={member.id} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`player-${member.id}`}
                                checked={selectedPlayers.has(member.id)}
                                onChange={() => handlePlayerSelection(member.id)}
                                disabled={!isCaptain}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor={`player-${member.id}`} className="ml-3 text-sm text-gray-700">
                                {member.first_name} {member.last_name}
                            </label>
                        </div>
                    ))}
                </div>
                {isCaptain && (
                    <div className="mt-6">
                        <Button onClick={handleSaveTeamsheet}>Save Teamsheet</Button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default TeamsheetPage;