import { useState, useEffect } from 'react';
import { useAuth } from "../hooks/useAuth";
import { getUserTeams } from '../api/teamsApi';
import { getActiveSeasons } from '../api/seasonsApi';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import CreateTeamForm from '../features/teams/CreateTeamForm';

const DashboardPage = () => {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Replace React Query with useState and useEffect
    // const [allTeams, setAllTeams] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [userTeams, setUserTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Fetch teams data when component mounts
    useEffect(() => {
        const fetchUserTeams = async () => {
            try {
                setIsLoading(true);
                const response = await getUserTeams();
                setUserTeams(response.data.data || []);
                setError(null);
            } catch (err) {
                setError(err);
                console.error('Error fetching teams:', err);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchUserTeams();
    }, []);

    // Fetch all seasons data
    useEffect(() => {
        const fetchAllSeasons = async () => {
            try {
                const response = await getActiveSeasons();
                setSeasons(response.data.data || []);
                setError(null);
            } catch (err) {
                setError(err);
                console.error('Error fetching all seasons:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllSeasons();
    }, []);
    
    // Function to refresh teams data (useful after creating a new team)
    const refreshTeams = async () => {
        try {
            setIsLoading(true);
            const response = await getUserTeams();
            setUserTeams(response.data.data || []);
        } catch (err) {
            console.error('Error refreshing teams:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        refreshTeams(); // Refresh teams list when modal closes (after team creation)
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
                {user?.role !== 'player' && (
                    <Button onClick={() => setIsModalOpen(true)}>Create Team</Button>
                )}
            </div>
            
            {/* My Teams Section */}
            <Card>
                <h2 className="text-xl font-semibold mb-4">My Teams</h2>
                {isLoading && <p>Loading your teams...</p>}
                {error && <p className="text-red-500">Could not fetch teams.</p>}
                {!isLoading && userTeams.length === 0 && (
                    <p className="text-gray-500">You are not part of any teams yet.</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userTeams.map(team => (
                        <Link to={`/teams/${team.id}`} key={team.id}>
                            <Card className="hover:shadow-lg hover:border-blue-500 border border-transparent transition-all">
                                <h3 className="font-bold text-lg text-gray-800">{team.name}</h3>
                                <p className="text-sm text-gray-600">{team.sport_name}</p>
                                <p className="text-xs text-gray-500">{team.season_name}</p>
                                <span className="mt-2 inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full capitalize">{team.user_role}</span>
                            </Card>
                        </Link>
                    ))}
                </div>
            </Card>
            
            {/* All Seasons Section */}
            <Card>
                <h2 className="text-xl font-semibold mb-4">Available Seasons</h2>
                {isLoading && <p>Loading seasons...</p>}
                {error && <p className="text-red-500">Could not fetch seasons.</p>}
                {!isLoading && seasons.length === 0 && (
                    <p className="text-gray-500">No active seasons available.</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {seasons.map(season => (
                        <Link to={`/seasons/${season.id}`} key={season.id}>
                            <Card className="hover:shadow-lg transition-shadow hover:border-blue-500 border border-transparent">
                            <h3 className="font-bold text-lg">{season.name}</h3>
                            <p className="text-sm text-gray-600">Start: {new Date(season.start_date).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-600">End: {new Date(season.end_date).toLocaleDateString()}</p>
                            <span className={`mt-2 inline-block ${
                                season.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            } text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                                {season.is_active ? 'Active' : 'Inactive'}
                            </span>
                            </Card>
                        </Link>
                    ))}
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={handleModalClose} title="Create a New Team">
                <CreateTeamForm onClose={handleModalClose} />
            </Modal>
        </div>
    );
};

export default DashboardPage;