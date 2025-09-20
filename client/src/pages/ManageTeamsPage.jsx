import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllTeams, deleteTeam } from '../api/teamsApi';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import TeamForm from '../features/admin/TeamForm';


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

    return (
        <div className="space-y-6">
            <Link to="/admin/dashboard" className="text-blue-600 hover:underline">&larr; Back to Admin Dashboard</Link>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Teams</h1>
                <Button onClick={handleCreate}>Create Team</Button>
            </div>

            <Card className="p-0">
                <table className="w-full text-left">
                    <thead className="border-b bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Team Name</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Sport</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Season</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Captain</th>
                        <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.map(team => (
                            <tr key={team.id} className="border-t group hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{team.name}</td>
                                <td className="px-6 py-4 text-gray-600">{team.sport_name || "Unknown"}</td>
                                <td className="px-6 py-4 text-gray-600">{team.season_name || "Unknown"}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    {team.captain_name || "No captain"}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex justify-end space-x-2">
                                        <Button onClick={() => handleEdit(team)}>Edit</Button>
                                        <Button onClick={() => openDeleteConfirm(team)} className="bg-red-500 hover:bg-red-600">Delete</Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

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