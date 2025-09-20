// client/src/pages/ManageSeasonsPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllSeasons, deleteSeason } from '../api/seasonsApi';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import SeasonForm from '../features/admin/SeasonForm';

const ManageSeasonsPage = () => {
    const [seasons, setSeasons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [seasonToDelete, setSeasonToDelete] = useState(null);

    const fetchSeasons = async () => {
        try {
            setIsLoading(true);
            const response = await getAllSeasons();
            setSeasons(response.data.data);
        } catch (err) {
            setError('Failed to fetch seasons.');
            console.error('Error fetching seasons:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSeasons();
    }, []);
    
    // ... (handleCreate, handleEdit, openDeleteConfirm, confirmDelete, etc. are identical to ManageSportsPage)
    const handleCreate = () => {
        setSelectedSeason(null);
        setIsFormModalOpen(true);
    };

    const handleEdit = (season) => {
        setSelectedSeason(season);
        setIsFormModalOpen(true);
    };

    const openDeleteConfirm = (season) => {
        setSeasonToDelete(season);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!seasonToDelete) return;
        await deleteSeason(seasonToDelete.id);
        setIsDeleteModalOpen(false);
        setSeasonToDelete(null);
        fetchSeasons();
    };

    const handleCloseModal = () => {
        setIsFormModalOpen(false);
        fetchSeasons();
    };


    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <Link to="/admin/dashboard" className="text-blue-600 hover:underline">&larr; Back to Admin Dashboard</Link>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Seasons</h1>
                <Button onClick={handleCreate}>Create Season</Button>
            </div>

            <Card className="p-0">
                <table className="w-full text-left">
                    <thead className="border-b bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Name</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Dates</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {seasons.map(season => (
                            <tr key={season.id} className="border-t group hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{season.name}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    {new Date(season.start_date).toLocaleDateString()} - {new Date(season.end_date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${season.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {season.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex justify-end space-x-2">
                                        <Button onClick={() => handleEdit(season)}>Edit</Button>
                                        <Button onClick={() => openDeleteConfirm(season)} className="bg-red-500 hover:bg-red-600">Delete</Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <Modal isOpen={isFormModalOpen} onClose={handleCloseModal} title={selectedSeason ? 'Edit Season' : 'Create Season'}>
                <SeasonForm season={selectedSeason} onClose={handleCloseModal} />
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                 <div className="space-y-4">
                    <p>Are you sure you want to delete the season: <strong>{seasonToDelete?.name}</strong>?</p>
                    <div className="flex justify-end space-x-2">
                        <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        <Button onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
                            Confirm Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ManageSeasonsPage;