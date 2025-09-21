import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { createTeam, updateTeam, getTeamById } from '../../api/teamsApi'; 
import { getAllSports } from '../../api/sportsApi';
import { getAllSeasons } from '../../api/seasonsApi';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';

const TeamForm = ({ team, onClose }) => {
    const [sports, setSports] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [serverError, setServerError] = useState('');
    
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            name: team?.name || '',
            sportName: team?.sport_name || '',
            seasonName: team?.season_name || '',
            captain_id: team?.captain_id || '',
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [sportsResponse, seasonsResponse] = await Promise.all([
                    getAllSports(),
                    getAllSeasons(),
                ]);
                
                setSports(sportsResponse.data.data || []);
                setSeasons(seasonsResponse.data.data || []);

                if (team) {
                    const teamDetailsResponse = await getTeamById(team.id);
                    setMembers(teamDetailsResponse.data.data.members || []);
                }
            } catch (error) {
                console.error("Error fetching form data:", error);
                setServerError("Failed to load form data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [team]);

    const onSubmit = async (data) => {
        try {
            if (team) {
                await updateTeam(team.id, data);
            } else {
                await createTeam(data);
            }
            onClose();
        } catch (error) {
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
                name="sportName"
                register={register}
                errors={errors}
                required
            >
                <option value="">Select a sport</option>
                {sports.map(sport => (
                    <option key={sport.id} value={sport.name}>
                        {sport.name}
                    </option>
                ))}
            </Select>
            
            <Select
                label="Season"
                name="seasonName"
                register={register}
                errors={errors}
                required
            >
                <option value="">Select a season</option>
                {seasons.map(season => (
                    <option key={season.id} value={season.name}>
                        {season.name}
                    </option>
                ))}
            </Select>

            {team && (
                 <Select
                    label="Captain"
                    name="captain_id"
                    register={register}
                    errors={errors}
                    required
                >
                    <option value="">Select a captain</option>
                    {members.map(member => (
                        <option key={member.id} value={member.id}>
                            {member.first_name} {member.last_name}
                        </option>
                    ))}
                </Select>
            )}
            
            {serverError && (
                <div className="bg-red-50 p-3 rounded-md">
                    <p className="text-red-500 text-sm">{serverError}</p>
                </div>
            )}
            
            <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" onClick={onClose} variant="secondary">Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (team ? 'Update Team' : 'Create Team')}
                </Button>
            </div>
        </form>
    );
};

export default TeamForm;