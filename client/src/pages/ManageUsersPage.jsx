import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers, deleteUser, updateUserRole } from '../api/adminApi';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import UserForm from '../features/admin/UserForm';
import Table, { ActionColumn, StatusBadge } from '../components/common/Table';
import { Edit, Trash2, Shield } from 'lucide-react';

const ManageUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [userToChangeRole, setUserToChangeRole] = useState(null);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await getAllUsers();
            if (response.data && Array.isArray(response.data.data)) {
                setUsers(response.data.data);
            } else if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                setUsers([]);
                setError('Unexpected data format received from server.');
            }
        } catch (err) {
            setError('Failed to fetch users.');
            console.error('Error fetching users:', err);
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);
    
    const handleCreate = () => {
        setSelectedUser(null);
        setIsFormModalOpen(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsFormModalOpen(true);
    };
    
    const handleChangeRole = (user) => {
        setUserToChangeRole(user);
        setIsRoleModalOpen(true);
    };

    const openDeleteConfirm = (user) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await deleteUser(userToDelete.id);
            fetchUsers();
        } catch (err) {
            console.error('Error deleting user:', err);
            alert('Failed to delete user.');
        } finally {
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        }
    };

    const confirmRoleChange = async (newRole) => {
        if (!userToChangeRole) return;
        try {
            await updateUserRole(userToChangeRole.id, { role: newRole });
            fetchUsers();
        } catch (err) {
            console.error('Error updating user role:', err);
            alert('Failed to update user role.');
        } finally {
            setIsRoleModalOpen(false);
            setUserToChangeRole(null);
        }
    };

    const handleCloseModal = () => {
        setIsFormModalOpen(false);
        fetchUsers();
    };

    const columns = [
        { 
            key: 'name', 
            title: 'Name', 
            sortable: true,
            render: (row) => `${row.first_name} ${row.last_name}`
        },
        { key: 'email', title: 'Email', sortable: true },
        { key: 'student_id', title: 'Student ID', sortable: true },
        { 
            key: 'role', 
            title: 'Role', 
            sortable: true,
            render: (row) => {
                const variant = { admin: 'info', captain: 'success', player: 'neutral' }[row.role] || 'neutral';
                return <StatusBadge status={row.role} variant={variant} />;
            }
        },
        {
            key: 'actions',
            title: '',
            render: (row) => (
                <div className="flex justify-end">
                    <ActionColumn
                        actions={[
                            { 
                                label: 'Edit User', 
                                icon: Edit, 
                                onClick: (user) => handleEdit(user)  // Added this action to use handleEdit
                            },
                            { 
                                label: 'Change Role', 
                                icon: Shield, 
                                onClick: (user) => handleChangeRole(user) 
                            },
                            { 
                                label: 'Delete User', 
                                icon: Trash2, 
                                variant: 'danger', 
                                onClick: (user) => openDeleteConfirm(user) 
                            }
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
                <h1 className="text-3xl font-bold">Manage Users</h1>
                <Button onClick={handleCreate}>Create User</Button>
            </div>

            <Table
                columns={columns}
                data={users}
                loading={isLoading}
                emptyMessage="No users found"
                sortable={true}
                onSort={(sortConfig) => console.log('Sort by', sortConfig)}
                sortConfig={{ key: 'name', direction: 'asc' }}
            />

            <Modal isOpen={isFormModalOpen} onClose={handleCloseModal} title={selectedUser ? 'Edit User' : 'Create User'}>
                <UserForm user={selectedUser} onClose={handleCloseModal} />
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                 <div className="space-y-4">
                    <p>Are you sure you want to delete the user: <strong>{userToDelete?.first_name} {userToDelete?.last_name}</strong>?</p>
                    <div className="text-sm text-red-500">
                        This will remove all of the user's data and associations.
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button onClick={() => setIsDeleteModalOpen(false)} variant="secondary">Cancel</Button>
                        <Button onClick={confirmDelete} variant="danger">
                            Confirm Delete
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} title="Change User Role">
                <div className="space-y-4">
                    <p>Select a new role for <strong>{userToChangeRole?.first_name} {userToChangeRole?.last_name}</strong>:</p>
                    
                    <div className="space-y-2">
                        <button 
                            onClick={() => confirmRoleChange('admin')}
                            className="w-full text-left px-4 py-2 border rounded hover:bg-purple-50"
                        >
                            <div className="font-medium">Admin</div>
                            <div className="text-sm text-gray-500">Full system access and management rights</div>
                        </button>
                        
                        <button 
                            onClick={() => confirmRoleChange('captain')}
                            className="w-full text-left px-4 py-2 border rounded hover:bg-blue-50"
                        >
                            <div className="font-medium">Captain</div>
                            <div className="text-sm text-gray-500">Can manage team rosters and submit teamsheets</div>
                        </button>
                        
                        <button 
                            onClick={() => confirmRoleChange('player')}
                            className="w-full text-left px-4 py-2 border rounded hover:bg-green-50"
                        >
                            <div className="font-medium">Player</div>
                            <div className="text-sm text-gray-500">Standard player account with limited access</div>
                        </button>
                    </div>
                    
                    <div className="flex justify-end pt-2">
                        <Button onClick={() => setIsRoleModalOpen(false)} variant="secondary">Cancel</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ManageUsersPage;