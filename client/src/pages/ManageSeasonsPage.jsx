import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllSeasons, deleteSeason } from '../api/seasonsApi';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import SeasonForm from '../features/admin/SeasonForm';
import Table, { ActionColumn, StatusBadge } from '../components/common/Table';
import { Edit, Trash2 } from 'lucide-react';

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

    const columns = [
        { key: 'name', title: 'Name', sortable: true },
        { 
            key: 'dates', 
            title: 'Dates',
            render: (row) => `${new Date(row.start_date).toLocaleDateString()} - ${new Date(row.end_date).toLocaleDateString()}`
        },
        { 
            key: 'is_active', 
            title: 'Status',
            render: (row) => (
                <StatusBadge 
                    status={row.is_active ? 'Active' : 'Inactive'} 
                    variant={row.is_active ? 'success' : 'neutral'}
                />
            )
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

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <Link to="/admin/dashboard" className="text-primary-600 hover:underline">&larr; Back to Admin Dashboard</Link>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Seasons</h1>
                <Button onClick={handleCreate}>Create Season</Button>
            </div>

            <Table
                columns={columns}
                data={seasons}
                loading={isLoading}
                emptyMessage="No seasons found"
                sortable={true}
                onSort={(sortConfig) => console.log('Sort by', sortConfig)}
                sortConfig={{ key: 'name', direction: 'asc' }}
            />

            <Modal isOpen={isFormModalOpen} onClose={handleCloseModal} title={selectedSeason ? 'Edit Season' : 'Create Season'}>
                <SeasonForm season={selectedSeason} onClose={handleCloseModal} />
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                 <div className="space-y-4">
                    <p>Are you sure you want to delete the season: <strong>{seasonToDelete?.name}</strong>?</p>
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

export default ManageSeasonsPage;