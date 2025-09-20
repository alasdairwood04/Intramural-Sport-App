import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { updateUserRole } from '../../api/adminApi'; // We'll use the function from adminApi
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';

const UserForm = ({ user, onClose }) => {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm({
        defaultValues: {
            role: user?.role || 'player'
        }
    });
    const [serverError, setServerError] = useState('');

    const onSubmit = async (data) => {
        try {
            await updateUserRole(user.id, data);
            onClose();
        } catch (err) {
            setServerError(err.response?.data?.message || 'An error occurred.');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <p>
                Editing user: <strong className="font-semibold">{user.first_name} {user.last_name}</strong> ({user.email})
            </p>

            <Select label="Role" name="role" register={register} required>
                <option value="player">Player</option>
                <option value="captain">Captain</option>
                <option value="admin">Admin</option>
            </Select>
            
            {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
            
            <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Role'}
                </Button>
            </div>
        </form>
    );
};

export default UserForm;
