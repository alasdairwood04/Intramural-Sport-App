import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { createTeam } from '../../api/teamsApi';
import { getAllSports } from '../../api/sportsApi';
import { getActiveSeasons } from '../../api/seasonsApi';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';

const CreateTeamForm = ({ onClose }) => {
  const [serverError, setServerError] = useState('');
  const [sports, setSports] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [isLoadingSports, setIsLoadingSports] = useState(true);
  const [isLoadingSeasons, setIsLoadingSeasons] = useState(true);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  // Fetch sports data
  useEffect(() => {
    const fetchSports = async () => {
        try {
            const response = await getAllSports();
            // Extract the array from the response
            setSports(response.data?.data || []);
        } catch (error) {
            console.error('Error fetching sports:', error);
            setSports([]); // Set to empty array on error
        } finally {
            setIsLoadingSports(false);
        }
    };

    fetchSports();
  }, []);

  // Fetch seasons data
  useEffect(() => {
    const fetchSeasons = async () => {
        try {
            const response = await getActiveSeasons();
            // Extract the array from the response
            setSeasons(response.data?.data || []);
        } catch (error) {
            console.error('Error fetching seasons:', error);
            setSeasons([]); // Set to empty array on error
        } finally {
            setIsLoadingSeasons(false);
        }
    };

    fetchSeasons();
  }, []);

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await createTeam(data);
      onClose(); // Close modal on success
    } catch (error) {
      setServerError(error.response?.data?.message || 'Failed to create team.');
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Team Name" name="name" register={register} errors={errors} required />
      <Select label="Sport" name="sportName" register={register} errors={errors} disabled={isLoadingSports}>
        <option value="">Select a sport</option>
        {Array.isArray(sports) && sports.map(sport => 
          <option key={sport.id} value={sport.name}>{sport.name}</option>
        )}
      </Select>
      <Select label="Season" name="seasonName" register={register} errors={errors} disabled={isLoadingSeasons}>
        <option value="">Select a season</option>
        {Array.isArray(seasons) && seasons.map(season => 
          <option key={season.id} value={season.name}>{season.name}</option>
        )}
      </Select>
      
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Team'}</Button>
      </div>
    </form>
  );
};

export default CreateTeamForm;