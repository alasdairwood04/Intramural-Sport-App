import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { createTeam, updateTeam } from '../../api/teamsApi';
import { getAllSports } from '../../api/sportsApi';
import { getAllSeasons } from '../../api/seasonsApi';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';

const TeamForm = ({ team, onClose }) => {
    const [sports, setSports] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [serverError, setServerError] = useState('');
    
    // Use field names that match the API expectations
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            name: team?.name || '',
            sportName: team?.sport_name || '',  // Changed from sport_id
            seasonName: team?.season_name || '', // Changed from season_id
        }
    });

    // Fetch sports and seasons on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [sportsResponse, seasonsResponse] = await Promise.all([
                    getAllSports(),
                    getAllSeasons()
                ]);
                
                setSports(sportsResponse.data.data || []);
                setSeasons(seasonsResponse.data.data || []);
            } catch (error) {
                console.error("Error fetching form data:", error);
                setServerError("Failed to load form data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, []);

    const onSubmit = async (data) => {
        try {
            console.log("Submitting team data:", data);
            
            if (team) {
                await updateTeam(team.id, data);
            } else {
                await createTeam(data);
            }
            onClose();
        } catch (error) {
            console.error('Error saving team:', error);
            console.error('Error response:', error.response?.data);
            setServerError(error.response?.data?.message || 'Failed to save team.');
        }
    };

    if (isLoading) {
        return <div className="text-center py-4">Loading form data...</div>;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input 
                label="Team Name" 
                name="name" 
                register={register} 
                errors={errors} 
                required
            />
            
            <Select
                label="Sport"
                name="sportName"  // Changed from sport_id
                register={register}
                errors={errors}
                required
            >
                <option value="">Select a sport</option>
                {sports.map(sport => (
                    <option key={sport.id} value={sport.name}>  {/* Use sport.name instead of sport.id */}
                        {sport.name}
                    </option>
                ))}
            </Select>
            
            <Select
                label="Season"
                name="seasonName"  // Changed from season_id
                register={register}
                errors={errors}
                required
            >
                <option value="">Select a season</option>
                {seasons.map(season => (
                    <option key={season.id} value={season.name}>  {/* Use season.name instead of season.id */}
                        {season.name}
                    </option>
                ))}
            </Select>
            
            {serverError && (
                <div className="bg-red-50 p-3 rounded-md">
                    <p className="text-red-500 text-sm">{serverError}</p>
                </div>
            )}
            
            <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (team ? 'Update Team' : 'Create Team')}
                </Button>
            </div>
        </form>
    );
};

export default TeamForm;