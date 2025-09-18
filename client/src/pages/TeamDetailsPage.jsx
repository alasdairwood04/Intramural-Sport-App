import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTeamById, requestToJoin } from '../api/teamsApi';
import { getAllFixtures } from '../api/fixturesApi';
import { getLeagueStandings } from '../api/leagueApi';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import TeamRoster from '../features/teams/TeamRoster';
import TeamFixtures from '../features/teams/TeamFixtures';
import LeagueStandings from '../features/teams/LeagueStandings';
// We'll create JoinRequests management for captains later

const TeamDetailsPage = () => {
  const { teamId } = useParams();
  const { user } = useAuth();

  const [team, setTeam] = useState(null);
  const [fixtures, setFixtures] = useState([]);
  const [standings, setStandings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setIsLoading(true);
        const teamResponse = await getTeamById(teamId);
        const fetchedTeam = teamResponse.data.data;
        setTeam(fetchedTeam);

        // Fetch fixtures and standings once we have team data
        const fixturesResponse = await getAllFixtures();
        const teamFixtures = fixturesResponse.data.data.filter(f => f.home_team_id === teamId || f.away_team_id === teamId);
        setFixtures(teamFixtures);

        const standingsResponse = await getLeagueStandings(fetchedTeam.season_id, fetchedTeam.sport_id);
        setStandings(standingsResponse.data.data);

      } catch (err) {
        setError('Failed to fetch team details.');
        console.error('Error fetching team details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeamData();
  }, [teamId]);

  const handleJoinRequest = async () => {
    try {
        await requestToJoin(teamId);
        alert('Join request sent successfully!');
    } catch(err) {
        alert(err.response?.data?.message || 'Failed to send join request.');
    }
  };

  const isCaptain = user?.id === team?.captain_id;
  const isMember = team?.members.some(member => member.id === user?.id);

  if (isLoading) return <p>Loading team details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <Link to="/dashboard" className="text-blue-600 hover:underline mb-2 block">&larr; Back to Dashboard</Link>
          <h1 className="text-3xl font-bold">{team.name}</h1>
        </div>
        {user?.role === 'player' && !isMember && (
            <Button onClick={handleJoinRequest}>Request to Join</Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <TeamRoster members={team.members} />
          </Card>
          <TeamFixtures fixtures={fixtures} teamId={teamId} isCaptain={isCaptain} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          {/* Captain's management section would go here */}
          <LeagueStandings standings={standings} teamId={teamId} />
        </div>
      </div>
    </div>
  );
};

export default TeamDetailsPage;