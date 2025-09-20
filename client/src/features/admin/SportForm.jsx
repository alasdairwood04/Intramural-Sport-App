import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { createSport, updateSport } from '../../api/sportsApi';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const SportForm = ({ sport, onClose }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: sport || { name: '', description: '', min_team_size: '', max_team_size: '' }
    });
    const [serverError, setServerError] = useState('');

    const onSubmit = async (data) => {
        try {
            // If a sport object exists, we're editing; otherwise, creating.
            if (sport) {
                await updateSport(sport.id, data);
            } else {
                await createSport(data);
            }
            onClose();
        } catch (err) {
            setServerError(err.response?.data?.message || 'An error occurred.');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Sport Name" name="name" register={register} errors={errors} required />
            <Input label="Description" name="description" register={register} errors={errors} />
            <Input label="Min Team Size" name="min_team_size" type="number" register={register} errors={errors} required />
            <Input label="Max Team Size" name="max_team_size" type="number" register={register} errors={errors} required />
            
            {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
            
            <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Sport'}
                </Button>
            </div>
        </form>
    );
};

export default SportForm;