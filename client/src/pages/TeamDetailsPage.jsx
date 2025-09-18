// alasdairwood04/intramural-sport-app/Intramural-Sport-App-e8c6434c08cc3d5e8f50235e1c5bb8b141dc46b4/client/src/pages/TeamDetailsPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTeamById } from '../api/teamsApi';
import Card from '../components/common/Card';
import TeamRoster from '../features/teams/TeamRoster';

const TeamDetailsPage = () => {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setIsLoading(true);
        const response = await getTeamById(teamId);
        setTeam(response.data.data);
      } catch (err) {
        setError('Failed to fetch team details.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeam();
  }, [teamId]);

  if (isLoading) return <p>Loading team details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!team) return <p>Team not found.</p>;

  return (
    <div className="space-y-6">
      <Link to="/dashboard" className="text-blue-600 hover:underline">&larr; Back to Dashboard</Link>
      
      <Card>
        <h1 className="text-3xl font-bold">{team.name}</h1>
        <p className="text-gray-600">{team.description || 'No description available.'}</p>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
            <Card>
                <TeamRoster members={team.members} />
            </Card>
        </div>
        <div className="md:col-span-1">
            <Card>
                <h3 className="text-lg font-semibold mb-3">Team Info</h3>
                {/* We'll add more info here later */}
            </Card>
        </div>
      </div>
    </div>
  );
};

export default TeamDetailsPage;