import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSeasonById } from '../api/seasonsApi';
import { getAllTeams } from '../api/teamsApi';
import Card from '../components/common/Card';
import SportSeasonView from '../features/seasons/SportSeasonView';

const SeasonDetailsPage = () => {
    const { seasonId } = useParams();
    const [season, setSeason] = useState(null);
    const [teams, setTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSeasonData = async () => {
            try {
                setIsLoading(true);
                const seasonRes = await getSeasonById(seasonId);
                setSeason(seasonRes.data.data);

                const teamsRes = await getAllTeams();
                const seasonTeams = teamsRes.data.data.filter(team => team.season_id === seasonId);
                setTeams(seasonTeams);

            } catch (err) {
                setError("Failed to load season data.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSeasonData();
    }, [seasonId]);

    if (isLoading) return <p>Loading season...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!season) return <p>Season not found.</p>;

    return (
        <div className="space-y-6">
            <Link to="/dashboard" className="text-blue-600 hover:underline">&larr; Back to Dashboard</Link>
            <h1 className="text-3xl font-bold">{season.name}</h1>

            <Card>
                <h2 className="text-xl font-semibold mb-4">Teams in this Season</h2>
                {teams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {teams.map(team => (
                            <Link to={`/teams/${team.id}`} key={team.id}>
                                <Card className="hover:shadow-lg transition-shadow">
                                    <h3 className="font-bold">{team.name}</h3>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No teams have been created for this season yet.</p>
                )}
            </Card>

            <SportSeasonView teams={teams} />
        </div>
    );
};

export default SeasonDetailsPage;
