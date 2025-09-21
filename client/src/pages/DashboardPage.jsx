import { useState, useEffect } from 'react';
import { useAuth } from "../hooks/useAuth";
import { getUserTeams } from '../api/teamsApi';
import { getActiveSeasons } from '../api/seasonsApi';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Card, { StatsCard, EmptyState } from '../components/common/Card';
import Modal from '../components/common/Modal';
import CreateTeamForm from '../features/teams/CreateTeamForm';
import { 
  Plus, 
  Users, 
  Trophy, 
  Calendar, 
  TrendingUp, 
  ArrowRight,
  Target,
  Activity,
  Clock,
  Settings,
  Search
} from 'lucide-react';

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
    const captainTeams = userTeams.filter(team => team.user_role === 'captain');
    const playerTeams = userTeams.filter(team => team.user_role === 'player');
    const upcomingFixtures = 0; // TODO: Calculate from API
    // const recentActivity = 0; // TODO: Calculate from API

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
                    <div className="text-error-600 mb-2">
                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-error-900 mb-2">Unable to load dashboard</h3>
                    <p className="text-error-700">Could not fetch your team data. Please try refreshing the page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">
                        Welcome back, {user?.first_name}
                    </h1>
                    <p className="text-neutral-600 mt-1">
                        Here's what's happening with your teams and competitions
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <Link 
                        to="/profile"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-all duration-200"
                    >
                        <Settings className="h-4 w-4 mr-2" />
                        Profile
                    </Link>
                    {user?.role !== 'player' && (
                        <Button 
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center shadow-sm"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Team
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="My Teams"
                    value={userTeams.length}
                    change={captainTeams.length > 0 ? `${captainTeams.length} as captain` : 'All as player'}
                    trend={captainTeams.length > 0 ? 'up' : 'neutral'}
                    icon={Users}
                />
                <StatsCard
                    title="Captain Role"
                    value={captainTeams.length}
                    change={`${playerTeams.length} as player`}
                    trend={captainTeams.length > 0 ? 'up' : 'neutral'}
                    icon={Trophy}
                />
                <StatsCard
                    title="Upcoming Fixtures"
                    value={upcomingFixtures}
                    change="This week"
                    trend="neutral"
                    icon={Clock}
                />
                <StatsCard
                    title="Active Seasons"
                    value={seasons.length}
                    change="Available to join"
                    trend="up"
                    icon={Calendar}
                />
            </div>
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* My Teams Management */}
                <ManagementCard
                    title="My Teams"
                    description="Teams you're part of and their current status"
                    count={userTeams.length}
                    items={userTeams}
                    renderItem={(team) => (
                        <Link to={`/teams/${team.id}`} key={team.id}>
                            <div className="flex items-center justify-between p-4 hover:bg-neutral-50 rounded-lg transition-colors duration-150 group">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                        <Trophy className="h-5 w-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-neutral-900 group-hover:text-primary-600 transition-colors duration-200">
                                            {team.name}
                                        </div>
                                        <div className="text-sm text-neutral-600">
                                            {team.sport_name} • {team.season_name}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RoleBadge role={team.user_role} />
                                    <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-primary-500 transition-colors duration-200" />
                                </div>
                            </div>
                        </Link>
                    )}
                    linkTo="/teams"
                    linkText="View All Teams"
                    emptyState={
                        <EmptyState
                            title="No teams yet"
                            description="You haven't joined any teams yet. Create one or join an existing team to get started."
                            icon={Users}
                            action={
                                user?.role !== 'player' && (
                                    <Button onClick={() => setIsModalOpen(true)} size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Your First Team
                                    </Button>
                                )
                            }
                        />
                    }
                />

                {/* Available Seasons */}
                <ManagementCard
                    title="Available Seasons"
                    description="Current seasons you can participate in"
                    count={seasons.length}
                    items={seasons}
                    renderItem={(season) => (
                        <Link to={`/seasons/${season.id}`} key={season.id}>
                            <div className="flex items-center justify-between p-4 hover:bg-neutral-50 rounded-lg transition-colors duration-150 group">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                                        <Calendar className="h-5 w-5 text-success-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-neutral-900 group-hover:text-primary-600 transition-colors duration-200">
                                            {season.name}
                                        </div>
                                        <div className="text-sm text-neutral-600">
                                            {new Date(season.start_date).toLocaleDateString()} - 
                                            {new Date(season.end_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <StatusDot active={season.is_active} />
                                    <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-primary-500 transition-colors duration-200" />
                                </div>
                            </div>
                        </Link>
                    )}
                    linkTo="/seasons"
                    linkText="Browse All Seasons"
                    emptyState={
                        <EmptyState
                            title="No active seasons"
                            description="There are currently no active seasons available to join."
                            icon={Calendar}
                        />
                    }
                />
            </div>

            {/* Quick Actions */}
            <Card>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {user?.role !== 'player' && (
                        <QuickActionButton
                            icon={Plus}
                            title="Create Team"
                            description="Start a new team"
                            onClick={() => setIsModalOpen(true)}
                        />
                    )}
                    <QuickActionButton
                        icon={Search}
                        title="Find Teams"
                        description="Join existing teams"
                        to="/teams/search"
                    />
                    <QuickActionButton
                        icon={Activity}
                        title="My Fixtures"
                        description="View schedules"
                        to="/fixtures"
                    />
                    <QuickActionButton
                        icon={Target}
                        title="Leaderboards"
                        description="Check standings"
                        to="/leaderboards"
                    />
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={handleModalClose} title="Create a New Team">
                <CreateTeamForm onClose={handleModalClose} />
            </Modal>
        </div>
    );
};

// Management Card Component (reused from admin dashboard)
const ManagementCard = ({ 
  title, 
  description, 
  count, 
  items, 
  renderItem, 
  linkTo, 
  linkText,
  emptyState 
}) => (
    <Card className="h-fit">
        <div className="flex items-center justify-between mb-4">
            <div>
                <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
                <p className="text-sm text-neutral-600">{description}</p>
            </div>
            <div className="text-2xl font-bold text-primary-600">{count}</div>
        </div>
        
        <div className="mb-4">
            {items && items.length > 0 ? (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                    {items.slice(0, 6).map(renderItem)}
                </div>
            ) : (
                emptyState || (
                    <div className="text-center py-8 text-neutral-500">
                        No items available
                    </div>
                )
            )}
        </div>
        
        {items && items.length > 0 && linkTo && (
            <Link
                to={linkTo}
                className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 group"
            >
                {linkText}
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
        )}
    </Card>
);

// Quick Action Button Component
const QuickActionButton = ({ icon: Icon, title, description, to, onClick }) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group text-left w-full"
      >
        <Icon className="h-8 w-8 text-neutral-400 group-hover:text-primary-500 transition-colors duration-200 mb-2" />
        <div className="font-medium text-neutral-900 group-hover:text-primary-900">{title}</div>
        <div className="text-sm text-neutral-600">{description}</div>
      </button>
    );
  }

  return (
    <Link
      to={to}
      className="p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
    >
      <Icon className="h-8 w-8 text-neutral-400 group-hover:text-primary-500 transition-colors duration-200 mb-2" />
      <div className="font-medium text-neutral-900 group-hover:text-primary-900">{title}</div>
      <div className="text-sm text-neutral-600">{description}</div>
    </Link>
  );
};

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
        <div className={`w-2 h-2 rounded-full mr-2 ${active ? 'bg-success-500' : 'bg-neutral-400'}`} />
        <span className="text-xs text-neutral-600">
            {active ? 'Active' : 'Inactive'}
        </span>
    </div>
);

// Loading Skeleton
const DashboardSkeleton = () => (
    <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
            <div className="space-y-2">
                <div className="h-8 w-64 bg-neutral-200 rounded animate-pulse" />
                <div className="h-4 w-48 bg-neutral-200 rounded animate-pulse" />
            </div>
            <div className="flex space-x-3">
                <div className="h-10 w-24 bg-neutral-200 rounded animate-pulse" />
                <div className="h-10 w-32 bg-neutral-200 rounded animate-pulse" />
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-neutral-200 rounded-lg animate-pulse" />
            ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2].map(i => (
                <div key={i} className="h-96 bg-neutral-200 rounded-lg animate-pulse" />
            ))}
        </div>
        
        <div className="h-48 bg-neutral-200 rounded-lg animate-pulse" />
    </div>
);

export default DashboardPage;