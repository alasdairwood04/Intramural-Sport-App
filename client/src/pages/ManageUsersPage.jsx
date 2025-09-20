import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers, deleteUser, updateUserRole } from '../api/adminApi';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import UserForm from '../features/admin/UserForm';

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
        
        // Check the structure of the response and handle it appropriately
        if (Array.isArray(response.data)) {
            // If response.data is already an array of users
            setUsers(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
            // If response.data.data is an array of users
            setUsers(response.data.data);
        } else {
            // If the structure is unexpected, set an empty array
            console.error('Unexpected API response structure:', response);
            setUsers([]);
            setError('Unexpected data format received from server.');
        }
    } catch (err) {
        setError('Failed to fetch users.');
        console.error('Error fetching users:', err);
        setUsers([]); // Ensure users is always an array
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
            fetchUsers(); // Refresh the list
        } catch (err) {
            alert('Failed to delete user.');
            console.error('Error deleting user:', err);
        } finally {
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        }
    };

    const confirmRoleChange = async (newRole) => {
        if (!userToChangeRole) return;
        try {
            await updateUserRole(userToChangeRole.id, { role: newRole });
            fetchUsers(); // Refresh the list
        } catch (err) {
            alert('Failed to update user role.');
            console.error('Error updating user role:', err);
        } finally {
            setIsRoleModalOpen(false);
            setUserToChangeRole(null);
        }
    };

    const handleCloseModal = () => {
        setIsFormModalOpen(false);
        fetchUsers();
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
                <h1 className="text-3xl font-bold">Manage Users</h1>
                <Button onClick={handleCreate}>Create User</Button>
            </div>

            <Card className="p-0">
                <table className="w-full text-left">
                    <thead className="border-b bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Name</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Email</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Student ID</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Role</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-t group hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{user.first_name} {user.last_name}</td>
                                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                <td className="px-6 py-4 text-gray-600">{user.student_id}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                                          user.role === 'captain' ? 'bg-blue-100 text-blue-800' : 
                                          'bg-green-100 text-green-800'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex justify-end space-x-2">
                                        <Button onClick={() => handleChangeRole(user)} className="bg-blue-500 hover:bg-blue-600">
                                            Change Role
                                        </Button>
                                        <Button onClick={() => handleEdit(user)}>Edit</Button>
                                        <Button onClick={() => openDeleteConfirm(user)} className="bg-red-500 hover:bg-red-600">Delete</Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

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
                        <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        <Button onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
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
                        <Button onClick={() => setIsRoleModalOpen(false)}>Cancel</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ManageUsersPage;