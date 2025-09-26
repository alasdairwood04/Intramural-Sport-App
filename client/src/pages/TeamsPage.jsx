import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllTeams } from '../api/teamsApi';
import Card from '../components/common/Card';
import { Trophy, Users } from 'lucide-react';


const TeamsPage = () => {
    const [teams, setTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchTeams = async () => {
            try {
                setIsLoading(true);
                const response = await getAllTeams();
                setTeams(response.data.data || []);
            } catch (err) {
                setError('Failed to fetch teams.');
                console.error('Error fetching teams:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeams();
    }, []);

    if (isLoading) {
        return <p>Loading teams...</p>;
    }
    if (error) {
        return <p className="text-red-500">{error}</p>;
    }
        return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">All Teams</h1>
            {teams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.map(team => (
                        <Link to={`/teams/${team.id}`} key={team.id}>
                            <Card hover={true} interactive={true}>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                        <Trophy className="h-6 w-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-lg">{team.name}</h2>
                                        <p className="text-sm text-neutral-600">{team.sport_name} • {team.season_name}</p>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <Card>
                    <div className="text-center py-12">
                         <Users className="h-12 w-12 text-neutral-400 mx-auto mb-2" />
                        <p className="text-neutral-500">No teams found.</p>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default TeamsPage;
