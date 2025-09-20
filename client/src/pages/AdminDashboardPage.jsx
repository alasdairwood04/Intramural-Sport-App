import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../components/common/Card";
import { getDashboardStats } from "../api/adminApi";

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
                console.log("API response:", response.data);
                // Store the entire data object directly
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
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <Link to="/admin/manage-sports">
                    <Card className="hover:shadow-lg hover:border-blue-500 border border-transparent transition-all cursor-pointer">
                        <h2 className="text-xl font-semibold mb-4">Sports ({stats.sports?.length || 0})</h2>
                        {stats.sports && stats.sports.length > 0 ? (
                            <ul className="divide-y">
                                {stats.sports.map(sport => (
                                    <li key={sport.id} className="py-2">
                                        <div className="font-medium">{sport.name}</div>
                                        <div className="text-sm text-gray-600">{sport.description}</div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No sports available</p>
                        )}
                    </Card>
                </Link>

                <Link to="/admin/manage-seasons">
                    <Card className="hover:shadow-lg hover:border-blue-500 border border-transparent transition-all cursor-pointer">
                        <h2 className="text-xl font-semibold mb-4">Seasons ({stats.seasons?.length || 0})</h2>
                        {stats.seasons && stats.seasons.length > 0 ? (
                            <ul className="divide-y">
                                {stats.seasons.map(season => (
                                <li key={season.id} className="py-2">
                                    <div className="font-medium">{season.name}</div>
                                    <div className="text-sm text-gray-600">
                                        {new Date(season.start_date).toLocaleDateString()} - 
                                        {new Date(season.end_date).toLocaleDateString()}
                                    </div>
                                </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No seasons available</p>
                        )}
                    </Card>
                </Link>

                <Link to="/admin/manage-teams">
                    <Card className="hover:shadow-lg hover:border-blue-500 border border-transparent transition-all cursor-pointer">
                        <h2 className="text-xl font-semibold mb-4">Teams ({stats.teams?.length || 0})</h2>
                        {stats.teams && stats.teams.length > 0 ? (
                            <ul className="divide-y">
                                {stats.teams.map(team => (
                                    <li key={team.id} className="py-2">
                                        <div className="font-medium">{team.name}</div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No teams available</p>
                        )}
                    </Card>
                </Link>

                <Link to="/admin/manage-users">
                    <Card className="hover:shadow-lg hover:border-blue-500 border border-transparent transition-all cursor-pointer">
                        <h2 className="text-xl font-semibold mb-4">Users ({stats.users?.length || 0})</h2>
                        {stats.users && stats.users.length > 0 ? (
                            <ul className="divide-y">
                                {stats.users.map(user => (
                                    <li key={user.id} className="py-2">
                                        <div className="font-medium">{user.first_name} {user.last_name}</div>
                                        <div className="text-sm text-gray-600">{user.email} - {user.role}</div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No users available</p>
                        )}
                    </Card>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboardPage;