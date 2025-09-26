// client/src/features/admin/UserForm.jsx
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { createUser, updateUserRole } from '../../api/adminApi';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';

const UserForm = ({ user, onClose }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            email: user?.email || '',
            firstName: user?.first_name || '',
            lastName: user?.last_name || '',
            studentId: user?.student_id || '',
            role: user?.role || 'player'
        }
    });
    const [serverError, setServerError] = useState('');

    const onSubmit = async (data) => {
        try {
            if (user) {
                // If a user object exists, we're editing the role.
                await updateUserRole(user.id, { role: data.role });
            } else {
                // Otherwise, we're creating a new user.
                await createUser(data);
            }
            onClose();
        } catch (err) {
            setServerError(err.response?.data?.message || 'An error occurred.');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {user ? (
                 <p>
                    Editing user: <strong className="font-semibold">{user.first_name} {user.last_name}</strong> ({user.email})
                </p>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="First Name" name="firstName" register={register} errors={errors} required />
                        <Input label="Last Name" name="lastName" register={register} errors={errors} required />
                    </div>
                    <Input label="Email" name="email" type="email" register={register} errors={errors} required />
                    <Input label="Student ID" name="studentId" register={register} errors={errors} required />
                    <Input label="Password" name="password" type="password" register={register} errors={errors} required />
                </>
            )}

            <Select label="Role" name="role" register={register} required>
                <option value="player">Player</option>
                <option value="captain">Captain</option>
                <option value="admin">Admin</option>
            </Select>
            
            {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
            
            <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" onClick={onClose} variant="secondary">Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (user ? 'Update Role' : 'Create User')}
                </Button>
            </div>
        </form>
    );
};

export default UserForm;