import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getFixtureTeamsheets } from '../api/teamsheetApi';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

// A reusable component to display a list of players for a single team
const PlayerList = ({ teamName, players = [] }) => (
    <div className="w-full md:w-1/2 p-4 sm:p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{teamName}</h3>
        {players.length > 0 ? (
            <ol className="space-y-3">
                {players.map((player, index) => (
                    <li key={player.player_id} className="flex items-center text-gray-700">
                        <span className="text-sm font-medium text-gray-500 w-6">{index + 1}.</span>
                        <span>{player.first_name} {player.last_name}</span>
                    </li>
                ))}
            </ol>
        ) : (
            <p className="text-gray-500 italic">Teamsheet not submitted yet.</p>
        )}
    </div>
);

const FixtureTeamsheetPage = () => {
    const { fixtureId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [fixtureData, setFixtureData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await getFixtureTeamsheets(fixtureId);
                setFixtureData(response.data.data);
            } catch (err) {
                setError('Failed to fetch teamsheet data.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [fixtureId]);

    if (isLoading) return <p>Loading teamsheets...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!fixtureData) return <p>No data found for this fixture.</p>;

    const { fixture, home_teamsheet, away_teamsheet } = fixtureData;

    // Determine if the current user is a captain of a team in this fixture
    const isCaptain = user?.id === fixture.home_team_captain_id || user?.id === fixture.away_team_captain_id;
    const userTeamId = user?.id === fixture.home_team_captain_id ? fixture.home_team_id : (user?.id === fixture.away_team_captain_id ? fixture.away_team_id : null);

    const handleManageTeamsheet = () => {
        if (userTeamId) {
            navigate(`/fixtures/${fixture.id}/teamsheet/${userTeamId}`);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <Link to={-1} className="text-blue-600 hover:underline mb-2 block">&larr; Back</Link>
                    <h1 className="text-3xl font-bold text-gray-900">{fixture.home_team_name} vs {fixture.away_team_name}</h1>
                    <p className="text-gray-600 mt-1">
                        {new Date(fixture.fixture_date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
                    </p>
                </div>
                {isCaptain && (
                    <div className="mt-4 sm:mt-0">
                        <Button onClick={handleManageTeamsheet}>Manage My Teamsheet</Button>
                    </div>
                )}
            </div>
            <Card className="p-0">
                <div className="flex flex-col md:flex-row md:divide-x divide-gray-200">
                    <PlayerList teamName={fixture.home_team_name} players={home_teamsheet?.players} />
                    <PlayerList teamName={fixture.away_team_name} players={away_teamsheet?.players} />
                </div>
            </Card>
        </div>
    );
};

export default FixtureTeamsheetPage;