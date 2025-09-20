// client/src/pages/ManageSportsPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllSports, deleteSport } from '../api/sportsApi';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import SportForm from '../features/admin/SportForm'; // Assuming this exists from the previous step

const ManageSportsPage = () => {
    const [sports, setSports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for the main Create/Edit modal
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedSport, setSelectedSport] = useState(null);

    // State for the delete confirmation modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [sportToDelete, setSportToDelete] = useState(null);

    const fetchSports = async () => {
        try {
            setIsLoading(true);
            const response = await getAllSports();
            setSports(response.data.data);
        } catch (err) {
            setError('Failed to fetch sports.');
            console.error('Error fetching sports:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSports();
    }, []);

    useEffect(() => {
        fetchSports();
    }, []);

    const handleCreate = () => {
        setSelectedSport(null);
        setIsFormModalOpen(true);
    };

    const handleEdit = (sport) => {
        setSelectedSport(sport);
        setIsFormModalOpen(true);
    };

    const openDeleteConfirm = (sport) => {
        setSportToDelete(sport);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!sportToDelete) return;
        try {
            await deleteSport(sportToDelete.id);
            fetchSports(); // Refresh the list
        } catch (err) {
            alert('Failed to delete sport.');
            console.error('Error deleting sport:', err);
        } finally {
            setIsDeleteModalOpen(false);
            setSportToDelete(null);
        }
    };

    const handleCloseModal = () => {
        setIsFormModalOpen(false);
        fetchSports();
    };

    if (isLoading) return <p>Loading sports...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="space-y-6">
            <Link to="/admin/dashboard" className="text-blue-600 hover:underline">&larr; Back to Admin Dashboard</Link>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Sports</h1>
                <Button onClick={handleCreate}>Create Sport</Button>
            </div>

            <Card className="p-0"> 
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Name</th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Description</th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Team Size</th>
                                <th className="px-6 py-3"></th> {/* Empty header for actions */}
                            </tr>
                        </thead>
                        <tbody>
                            {sports.map(sport => (
                                <tr key={sport.id} className="border-t group hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{sport.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{sport.description}</td>
                                    <td className="px-6 py-4 text-gray-600">{sport.min_team_size} - {sport.max_team_size}</td>
                                    <td className="px-6 py-4 text-right">
                                        
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex justify-end space-x-2">
                                            <Button onClick={() => handleEdit(sport)}>Edit</Button>
                                            <Button onClick={() => openDeleteConfirm(sport)} className="bg-red-500 hover:bg-red-600">Delete</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Create/Edit Modal */}
            <Modal isOpen={isFormModalOpen} onClose={handleCloseModal} title={selectedSport ? 'Edit Sport' : 'Create Sport'}>
                <SportForm sport={selectedSport} onClose={handleCloseModal} />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                <div className="space-y-4">
                    <p>Are you sure you want to delete the sport: <strong>{sportToDelete?.name}</strong>? This action cannot be undone.</p>
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

export default ManageSportsPage;