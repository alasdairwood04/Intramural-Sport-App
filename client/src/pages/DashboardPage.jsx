import { useState, useEffect } from 'react';
import { useAuth } from "../hooks/useAuth";
import { getUserTeams } from '../api/teamsApi';
import { getActiveSeasons } from '../api/seasonsApi';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Card, { EmptyState } from '../components/common/Card';
import Modal from '../components/common/Modal';
import CreateTeamForm from '../features/teams/CreateTeamForm';
import { Plus, Users, Trophy, Calendar, TrendingUp } from 'lucide-react';

const DashboardPage = () => {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
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
    
    // Function to refresh teams data
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
        refreshTeams();
    };

    // Calculate stats
    // const captainTeams = userTeams.filter(team => team.user_role === 'captain');
    // const playerTeams = userTeams.filter(team => team.user_role === 'player');

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">
                        Welcome back, {user?.first_name}
                    </h1>
                    <p className="text-neutral-600 mt-1">
                        Here's what's happening with your teams
                    </p>
                </div>
                {user?.role !== 'player' && (
                    <Button 
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Team
                    </Button>
                )}
            </div>

            {/* Stats Cards */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Total Teams"
                    value={userTeams.length}
                    icon={Users}
                />
                <StatsCard
                    title="As Captain"
                    value={captainTeams.length}
                    icon={Trophy}
                />
                <StatsCard
                    title="Active Seasons"
                    value={seasons.length}
                    icon={Calendar}
                />
            </div>
             */}
            {/* My Teams Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-neutral-900">My Teams</h2>
                    {userTeams.length > 0 && (
                        <Link 
                            to="/teams" 
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                            View all →
                        </Link>
                    )}
                </div>

                {error && (
                    <div className="bg-error-50 border border-error-200 rounded-lg p-4">
                        <p className="text-error-600 text-sm">Could not fetch teams. Please try again.</p>
                    </div>
                )}

                {userTeams.length === 0 && !isLoading ? (
                    <EmptyState
                        title="No teams yet"
                        description="You haven't joined any teams yet. Create one or join an existing team to get started."
                        icon={Users}
                        action={
                            user?.role !== 'player' && (
                                <Button onClick={() => setIsModalOpen(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Your First Team
                                </Button>
                            )
                        }
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userTeams.map(team => (
                            <TeamCard key={team.id} team={team} />
                        ))}
                    </div>
                )}
            </div>
            
            {/* Available Seasons Section */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-neutral-900">Available Seasons</h2>
                
                {seasons.length === 0 && !isLoading ? (
                    <EmptyState
                        title="No active seasons"
                        description="There are currently no active seasons available."
                        icon={Calendar}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {seasons.map(season => (
                            <SeasonCard key={season.id} season={season} />
                        ))}
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={handleModalClose} title="Create a New Team">
                <CreateTeamForm onClose={handleModalClose} />
            </Modal>
        </div>
    );
};

// Team Card Component
const TeamCard = ({ team }) => (
    <Link to={`/teams/${team.id}`}>
        <Card hover className="group">
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors duration-200 truncate">
                        {team.name}
                    </h3>
                    <p className="text-sm text-neutral-600 mt-1">{team.sport_name}</p>
                    <p className="text-xs text-neutral-500 mt-1">{team.season_name}</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                    <RoleBadge role={team.user_role} />
                </div>
            </div>
            
            {/* Team stats could go here */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
                <span className="text-xs text-neutral-500">
                    {/* Add team member count if available */}
                    {team.member_count || 0} members
                </span>
                <div className="flex items-center text-xs text-neutral-500">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Active
                </div>
            </div>
        </Card>
    </Link>
);

// Season Card Component
const SeasonCard = ({ season }) => (
    <Link to={`/seasons/${season.id}`}>
        <Card hover className="group">
            <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors duration-200">
                        {season.name}
                    </h3>
                    <div className="mt-2 space-y-1">
                        <p className="text-sm text-neutral-600">
                            Starts: {new Date(season.start_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-neutral-600">
                            Ends: {new Date(season.end_date).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                    <StatusDot active={season.is_active} />
                </div>
            </div>
        </Card>
    </Link>
);

// Role Badge Component
const RoleBadge = ({ role }) => {
    const styles = {
        captain: 'bg-primary-100 text-primary-800 border-primary-200',
        player: 'bg-neutral-100 text-neutral-800 border-neutral-200'
    };
    
    return (
        <span className={`
            inline-flex items-center px-2 py-1 text-xs font-medium 
            border rounded-full capitalize
            ${styles[role] || styles.player}
        `}>
            {role}
        </span>
    );
};

// Status Dot Component
const StatusDot = ({ active }) => (
    <div className="flex items-center">
        <div className={`
            w-2 h-2 rounded-full mr-2
            ${active ? 'bg-success-500' : 'bg-neutral-400'}
        `} />
        <span className="text-xs text-neutral-600">
            {active ? 'Active' : 'Inactive'}
        </span>
    </div>
);

// Loading Skeleton
const DashboardSkeleton = () => (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            <div className="space-y-2">
                <div className="h-8 w-64 bg-neutral-200 rounded animate-pulse" />
                <div className="h-4 w-48 bg-neutral-200 rounded animate-pulse" />
            </div>
            <div className="h-10 w-32 bg-neutral-200 rounded animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-neutral-200 rounded-lg animate-pulse" />
            ))}
        </div>
        
        <div className="space-y-4">
            <div className="h-6 w-32 bg-neutral-200 rounded animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-40 bg-neutral-200 rounded-lg animate-pulse" />
                ))}
            </div>
        </div>
    </div>
);

export default DashboardPage;