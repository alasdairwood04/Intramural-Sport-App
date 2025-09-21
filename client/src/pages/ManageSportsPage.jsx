import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllSports, deleteSport } from '../api/sportsApi';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import SportForm from '../features/admin/SportForm';
import Table, { ActionColumn } from '../components/common/Table';
import { Edit, Trash2 } from 'lucide-react';

const ManageSportsPage = () => {
    const [sports, setSports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedSport, setSelectedSport] = useState(null);
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
            fetchSports();
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

    const columns = [
        { key: 'name', title: 'Name', sortable: true },
        { key: 'description', title: 'Description', sortable: true },
        { 
            key: 'team_size', 
            title: 'Team Size',
            render: (row) => `${row.min_team_size} - ${row.max_team_size}`
        },
        {
            key: 'actions',
            title: '',
            render: (row) => (
                <div className="flex justify-end">
                    <ActionColumn 
                        actions={[
                            { label: 'Edit', icon: Edit, onClick: () => handleEdit(row) },
                            { label: 'Delete', icon: Trash2, variant: 'danger', onClick: () => openDeleteConfirm(row) }
                        ]}
                        row={row}
                    />
                </div>
            )
        }
    ];

    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="space-y-6">
            <Link to="/admin/dashboard" className="text-primary-600 hover:underline">&larr; Back to Admin Dashboard</Link>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Sports</h1>
                <Button onClick={handleCreate}>Create Sport</Button>
            </div>

            <Table
                columns={columns}
                data={sports}
                loading={isLoading}
                emptyMessage="No sports found"
                sortable={true}
                onSort={(sortConfig) => console.log('Sort by', sortConfig)}
                sortConfig={{ key: 'name', direction: 'asc' }}
            />

            <Modal isOpen={isFormModalOpen} onClose={handleCloseModal} title={selectedSport ? 'Edit Sport' : 'Create Sport'}>
                <SportForm sport={selectedSport} onClose={handleCloseModal} />
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                <div className="space-y-4">
                    <p>Are you sure you want to delete the sport: <strong>{sportToDelete?.name}</strong>? This action cannot be undone.</p>
                    <div className="flex justify-end space-x-2">
                        <Button onClick={() => setIsDeleteModalOpen(false)} variant="secondary">Cancel</Button>
                        <Button onClick={confirmDelete} variant="danger">
                            Confirm Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ManageSportsPage;