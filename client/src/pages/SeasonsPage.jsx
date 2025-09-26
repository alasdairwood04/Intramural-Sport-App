// client/src/pages/SeasonsPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllSeasons } from '../api/seasonsApi';
import Card from '../components/common/Card';
import { Calendar, CheckCircle } from 'lucide-react';

const SeasonsPage = () => {
    const [seasons, setSeasons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSeasons = async () => {
            try {
                setIsLoading(true);
                const response = await getAllSeasons();
                setSeasons(response.data.data || []);
            } catch (err) {
                setError('Failed to fetch seasons.');
                console.error('Error fetching seasons:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSeasons();
    }, []);

    if (isLoading) {
        return <p>Loading seasons...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">All Seasons</h1>
            {seasons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {seasons.map(season => (
                        <Link to={`/seasons/${season.id}`} key={season.id}>
                            <Card hover={true} interactive={true}>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                                        <Calendar className="h-6 w-6 text-success-600" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-lg">{season.name}</h2>
                                        <div className={`flex items-center text-sm mt-1 ${season.is_active ? 'text-success-600' : 'text-neutral-500'}`}>
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            {season.is_active ? 'Active' : 'Inactive'}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <Card>
                    <div className="text-center py-12">
                        <Calendar className="h-12 w-12 text-neutral-400 mx-auto mb-2" />
                        <p className="text-neutral-500">No seasons found.</p>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default SeasonsPage;