import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../api/adminApi";
import Card, { StatsCard } from "../components/common/Card";
import { 
  Users, 
  Trophy, 
  Calendar, 
  Target,
  TrendingUp,
  ArrowRight,
  Settings,
  BarChart3,
  Clock
} from 'lucide-react';

const AdminDashboardPage = () => {
    const [stats, setStats] = useState({
        sports: [],
        teams: [],
        users: [],
        seasons: []
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true);
                const response = await getDashboardStats();
                setStats(response.data || {});
                setError(null);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
                setError("Failed to fetch dashboard stats");
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return <AdminDashboardSkeleton />;
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
                    <div className="text-error-600 mb-2">
                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-error-900 mb-2">Unable to load dashboard</h3>
                    <p className="text-error-700">{error}</p>
                </div>
            </div>
        );
    }

    // Calculate some derived stats
    const activeSeasons = stats.seasons?.filter(s => s.is_active)?.length || 0;
    // const adminUsers = stats.users?.filter(u => u.role === 'admin')?.length || 0;

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Admin Dashboard</h1>
                    <p className="text-neutral-600 mt-1">
                        Manage your intramural sports system
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <Link 
                        to="/admin/settings"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-all duration-200"
                    >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                    </Link>
                    <Link
                        to="/admin/reports"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-all duration-200 shadow-sm"
                    >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Reports
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Users"
                    value={stats.users?.length || 0}
                    change="+12% from last month"
                    trend="up"
                    icon={Users}
                />
                <StatsCard
                    title="Active Teams"
                    value={stats.teams?.length || 0}
                    change="+8% from last month"
                    trend="up"
                    icon={Target}
                />
                <StatsCard
                    title="Sports Available"
                    value={stats.sports?.length || 0}
                    change="No change"
                    trend="neutral"
                    icon={Trophy}
                />
                <StatsCard
                    title="Active Seasons"
                    value={activeSeasons}
                    change="2 ending soon"
                    trend="neutral"
                    icon={Calendar}
                />
            </div>

            {/* Management Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sports Management */}
                <ManagementCard
                    title="Sports Management"
                    description="Configure available sports and their rules"
                    count={stats.sports?.length || 0}
                    items={stats.sports}
                    renderItem={(sport) => (
                        <div key={sport.id} className="flex items-center justify-between p-3 hover:bg-neutral-50 rounded-lg transition-colors duration-150">
                            <div>
                                <div className="font-medium text-neutral-900">{sport.name}</div>
                                <div className="text-sm text-neutral-600">{sport.description}</div>
                            </div>
                            <div className="text-xs text-neutral-500">
                                {sport.min_team_size}-{sport.max_team_size} players
                            </div>
                        </div>
                    )}
                    linkTo="/admin/manage-sports"
                    linkText="Manage Sports"
                />

                {/* Seasons Management */}
                <ManagementCard
                    title="Seasons Management"
                    description="Create and manage competition seasons"
                    count={stats.seasons?.length || 0}
                    items={stats.seasons}
                    renderItem={(season) => (
                        <div key={season.id} className="flex items-center justify-between p-3 hover:bg-neutral-50 rounded-lg transition-colors duration-150">
                            <div>
                                <div className="font-medium text-neutral-900">{season.name}</div>
                                <div className="text-sm text-neutral-600">
                                    {new Date(season.start_date).toLocaleDateString()} - 
                                    {new Date(season.end_date).toLocaleDateString()}
                                </div>
                            </div>
                            <StatusDot active={season.is_active} />
                        </div>
                    )}
                    linkTo="/admin/manage-seasons"
                    linkText="Manage Seasons"
                />

                {/* Teams Management */}
                <ManagementCard
                    title="Teams Management"
                    description="View and manage all team registrations"
                    count={stats.teams?.length || 0}
                    items={stats.teams}
                    renderItem={(team) => (
                        <div key={team.id} className="flex items-center justify-between p-3 hover:bg-neutral-50 rounded-lg transition-colors duration-150">
                            <div>
                                <div className="font-medium text-neutral-900">{team.name}</div>
                                <div className="text-sm text-neutral-600">
                                    {team.sport_name} • {team.season_name}
                                </div>
                            </div>
                            <div className="text-xs text-neutral-500">
                                {team.captain_name || "No captain"}
                            </div>
                        </div>
                    )}
                    linkTo="/admin/manage-teams"
                    linkText="Manage Teams"
                />

                {/* Users Management */}
                <ManagementCard
                    title="Users Management"
                    description="Manage user accounts and permissions"
                    count={stats.users?.length || 0}
                    items={stats.users}
                    renderItem={(user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 hover:bg-neutral-50 rounded-lg transition-colors duration-150">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                    <span className="text-primary-700 text-sm font-medium">
                                        {user.first_name?.[0]?.toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <div className="font-medium text-neutral-900">
                                        {user.first_name} {user.last_name}
                                    </div>
                                    <div className="text-sm text-neutral-600">{user.email}</div>
                                </div>
                            </div>
                            <RoleBadge role={user.role} />
                        </div>
                    )}
                    linkTo="/admin/manage-users"
                    linkText="Manage Users"
                />
            </div>

            {/* Quick Actions */}
            <Card>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <QuickActionButton
                        icon={Trophy}
                        title="Add Sport"
                        description="Create a new sport"
                        to="/admin/manage-sports"
                    />
                    <QuickActionButton
                        icon={Calendar}
                        title="New Season"
                        description="Start a new season"
                        to="/admin/manage-seasons"
                    />
                    <QuickActionButton
                        icon={Users}
                        title="Add User"
                        description="Register new user"
                        to="/admin/manage-users"
                    />
                    <QuickActionButton
                        icon={BarChart3}
                        title="View Reports"
                        description="Analytics & insights"
                        to="/admin/reports"
                    />
                </div>
            </Card>
        </div>
    );
};

// Management Card Component
const ManagementCard = ({ title, description, count, items, renderItem, linkTo, linkText }) => (
    <Card className="h-fit">
        <div className="flex items-center justify-between mb-4">
            <div>
                <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
                <p className="text-sm text-neutral-600">{description}</p>
            </div>
            <div className="text-2xl font-bold text-primary-600">{count}</div>
        </div>
        
        <div className="space-y-1 mb-4 max-h-48 overflow-y-auto">
            {items && items.length > 0 ? (
                items.slice(0, 4).map(renderItem)
            ) : (
                <div className="text-center py-6 text-neutral-500">
                    No items available
                </div>
            )}
        </div>
        
        <Link
            to={linkTo}
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 group"
        >
            {linkText}
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
    </Card>
);

// Quick Action Button Component
const QuickActionButton = ({ icon: Icon, title, description, to }) => (
    <Link
        to={to}
        className="p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
    >
        <Icon className="h-8 w-8 text-neutral-400 group-hover:text-primary-500 transition-colors duration-200 mb-2" />
        <div className="font-medium text-neutral-900 group-hover:text-primary-900">{title}</div>
        <div className="text-sm text-neutral-600">{description}</div>
    </Link>
);

// Status Dot Component
const StatusDot = ({ active }) => (
    <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full mr-2 ${active ? 'bg-success-500' : 'bg-neutral-400'}`} />
        <span className="text-xs text-neutral-600">
            {active ? 'Active' : 'Inactive'}
        </span>
    </div>
);

// Role Badge Component
const RoleBadge = ({ role }) => {
    const styles = {
        admin: 'bg-purple-100 text-purple-800',
        captain: 'bg-primary-100 text-primary-800',
        player: 'bg-neutral-100 text-neutral-800'
    };
    
    return (
        <span className={`
            inline-flex items-center px-2 py-1 text-xs font-medium rounded-full capitalize
            ${styles[role] || styles.player}
        `}>
            {role}
        </span>
    );
};

// Loading Skeleton
const AdminDashboardSkeleton = () => (
    <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
            <div className="space-y-2">
                <div className="h-8 w-64 bg-neutral-200 rounded animate-pulse" />
                <div className="h-4 w-48 bg-neutral-200 rounded animate-pulse" />
            </div>
            <div className="flex space-x-3">
                <div className="h-10 w-24 bg-neutral-200 rounded animate-pulse" />
                <div className="h-10 w-24 bg-neutral-200 rounded animate-pulse" />
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-neutral-200 rounded-lg animate-pulse" />
            ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-80 bg-neutral-200 rounded-lg animate-pulse" />
            ))}
        </div>
    </div>
);

export default AdminDashboardPage;