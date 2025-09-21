import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllTeams, deleteTeam } from '../api/teamsApi';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import TeamForm from '../features/admin/TeamForm';
import Table, { StatusBadge, ActionColumn } from '../components/common/Table';
import { Edit, Trash2, MoreHorizontal } from 'lucide-react';

const ManageTeamsPage = () => {
    const [teams, setTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [teamToDelete, setTeamToDelete] = useState(null);

    const fetchTeams = async () => {
        try {
            setIsLoading(true);
            const response = await getAllTeams();
            setTeams(response.data.data);
        } catch (err) {
            setError('Failed to fetch teams.');
            console.error('Error fetching teams:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const handleCreate = () => {
        setSelectedTeam(null);
        setIsFormModalOpen(true);
    };

    const handleEdit = (team) => {
        setSelectedTeam(team);
        setIsFormModalOpen(true);
    };

    const openDeleteConfirm = (team) => {
        setTeamToDelete(team);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!teamToDelete) return;
        await deleteTeam(teamToDelete.id);
        setIsDeleteModalOpen(false);
        setTeamToDelete(null);
        fetchTeams();
    };

    const handleCloseModal = () => {
        setIsFormModalOpen(false);
        fetchTeams();
    };

    if (isLoading) {
        return <p>Loading teams...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    // table columns definition
    const columns = [
        { key: 'name', title: 'Team Name', sortable: true },
        { key: 'sport_name', title: 'Sport', sortable: true },
        { key: 'season_name', title: 'Season', sortable: true },
        { key: 'captain_name', title: 'Captain', sortable: true },
        { key: 'actions',title: '',
        render: (row) => (
        <ActionColumn 
            actions={[
              { label: 'Edit', icon: Edit, onClick: () => handleEdit(row) },
              { label: 'Delete', icon: Trash2, variant: 'danger', onClick: () => openDeleteConfirm(row) }
            ]}
          row={row}
        />
      )
 }
    ];

    return (
        <div className="space-y-6">
            <Link to="/admin/dashboard" className="text-blue-600 hover:underline">&larr; Back to Admin Dashboard</Link>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Teams</h1>
                <Button onClick={handleCreate}>Create Team</Button>
            </div>

            <Table
                columns={columns}
                data={teams}
                loading={false}
                emptyMessage="No teams found"
                sortable={true}
                onSort={(sortConfig) => console.log('Sort by', sortConfig)}
                sortConfig={{ key: 'name', direction: 'asc' }}
                />

            <Modal isOpen={isFormModalOpen} onClose={handleCloseModal} title={selectedTeam ? 'Edit Team' : 'Create Team'}>
                <TeamForm team={selectedTeam} onClose={handleCloseModal} />
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                 <div className="space-y-4">
                    <p>Are you sure you want to delete the team: <strong>{teamToDelete?.name}</strong>?</p>
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

export default ManageTeamsPage;