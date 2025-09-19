import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { createFixture, getPotentialOpponents } from '../../api/fixturesApi';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';

const CreateFixtureForm = ({ team, onClose}) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const [serverError, setServerError] = useState('');
    const [opponentTeams, setOpponentTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch teams data for the opponent selection
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                setIsLoading(true);
                const response = await getPotentialOpponents(team.id);
                // Extract the array from the response - adjust this path based on your API response structure
                setOpponentTeams(response.data?.data || []);
            } catch (error) {
                console.error('Error fetching potential opponents:', error);
                setOpponentTeams([]); // Initialize with empty array on error
            } finally {
                setIsLoading(false);
            }
        };
        fetchTeams();
    }, [team.id]);


const onSubmit = async (data) => {
    setServerError('');
    
    // Log data for debugging
    console.log("Team object:", team);
    console.log("Form data:", data);
    
    const fixtureData = {
        seasonId: team.season_id,
        sportId: team.sport_id, // Changed from team.sportId to team.sport_id
        homeTeamId: team.id,
        awayTeamId: data.awayTeamId,
        fixtureDate: data.fixtureDate
    };
    
    // Log the data being sent
    console.log("Fixture data being sent:", fixtureData);
    
    try {
        await createFixture(fixtureData);
        onClose();
    } catch (error) {
        // More descriptive error message
        const errorMessage = error.response?.data?.message || 'Error creating fixture';
        setServerError(errorMessage);
        console.error('Error creating fixture:', error);
    }
};

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Select label="Opponent" name="awayTeamId" register={register} errors={errors} required disabled={isLoading}>
                <option value="">Select an opponent...</option>
                {Array.isArray(opponentTeams) && opponentTeams.map(op => 
                    <option key={op.id} value={op.id}>{op.name}</option>
                )}
            </Select>
            <Input label="Date and Time" name="fixtureDate" type="datetime-local" register={register} errors={errors} required />
            
            {isLoading && <p>Loading potential opponents...</p>}
            {serverError && <p className="text-sm text-red-600">{serverError}</p>}

            <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting || isLoading}>
                    {isSubmitting ? 'Proposing...' : 'Propose Fixture'}
                </Button>
            </div>
        </form>
    );
};

export default CreateFixtureForm;