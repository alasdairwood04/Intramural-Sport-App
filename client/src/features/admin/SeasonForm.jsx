import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { createSeason, updateSeason } from '../../api/seasonsApi'; // We'll add these to the API file
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

// Helper to format date for input[type="date"]
const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
};

const SeasonForm = ({ season, onClose }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            ...season,
            start_date: formatDateForInput(season?.start_date),
            end_date: formatDateForInput(season?.end_date),
        }
    });
    const [serverError, setServerError] = useState('');

    const onSubmit = async (data) => {
        try {
            if (season) {
                await updateSeason(season.id, data);
            } else {
                await createSeason(data);
            }
            onClose();
        } catch (err) {
            setServerError(err.response?.data?.message || 'An error occurred.');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Season Name" name="name" register={register} errors={errors} required />
            <Input label="Start Date" name="start_date" type="date" register={register} errors={errors} required />
            <Input label="End Date" name="end_date" type="date" register={register} errors={errors} required />
            
            {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
            
            <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Season'}
                </Button>
            </div>
        </form>
    );
};

export default SeasonForm;