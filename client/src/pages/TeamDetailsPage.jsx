import { useEffect, useState, useCallback } from 'react'; // Import useCallback
import { useParams, Link } from 'react-router-dom';
import { getTeamById, requestToJoin } from '../api/teamsApi';
import { getFixturesByTeam, getTeamsForFixture } from '../api/fixturesApi';
import { getLeagueStandings } from '../api/leagueApi';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import TeamRoster from '../features/teams/TeamRoster';
import TeamFixtures from '../features/teams/TeamFixtures';
import LeagueStandings from '../features/teams/LeagueStandings';
import JoinRequests from '../features/teams/JoinRequests'; 
import Modal from '../components/common/Modal';
import CreateFixtureForm from '../features/fixtures/CreateFixtureForm';


const TeamDetailsPage = () => {
  const { teamId } = useParams();
  const { user } = useAuth();

  const [team, setTeam] = useState(null);
  const [fixtures, setFixtures] = useState([]);
  const [standings, setStandings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFixtureModalOpen, setIsFixtureModalOpen] = useState(false);


const fetchTeamData = useCallback(async () => {
    try {
        setIsLoading(true);

        // Get team details
        const teamResponse = await getTeamById(teamId);
        const fetchedTeam = teamResponse.data.data;
        setTeam(fetchedTeam);

        // Get team fixtures
        const fixturesResponse = await getFixturesByTeam(teamId);
        let teamFixtures = fixturesResponse.data.data || [];

        // Now enhance fixtures with team names
        const enhancedFixtures = await Promise.all(teamFixtures.map(async (fixture) => {
            try {
                // Get teams for this fixture
                const teamsResponse = await getTeamsForFixture(fixture.id);
                const teamsData = teamsResponse.data.data;
                
                // Return fixture with added team names
                return {
                    ...fixture,
                    home_team_name: teamsData.home_team?.name || "Unknown Team",
                    away_team_name: teamsData.away_team?.name || "Unknown Team"
                };
            } catch (err) {
                console.error(`Error fetching teams for fixture ${fixture.id}:`, err);
                return {
                    ...fixture,
                    home_team_name: "Unknown Team",
                    away_team_name: "Unknown Team"
                };
            }
        }));
        
        // Set fixtures with team names included
        setFixtures(enhancedFixtures);

        // Get standings
        if (fetchedTeam) {
            const standingsResponse = await getLeagueStandings(fetchedTeam.season_id, fetchedTeam.sport_id);
            setStandings(standingsResponse.data.data);
        }
    } catch (err) {
        setError('Failed to fetch team details.');
        console.error('Error fetching team details:', err);
    } finally {
        setIsLoading(false);
    }
}, [teamId]);

// Remove the separate fetchFixtureTeamNames function
// And simplify the useEffect
useEffect(() => {
    fetchTeamData();
}, [fetchTeamData]);


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

    const handleModalClose = () => {
    setIsFixtureModalOpen(false);
    fetchTeamData(); // Refresh all data on the page
};


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
                        <TeamRoster members={team?.members} />
                    </Card>
                    
                    {/* Add Propose Fixture button inside the fixtures component or nearby */}
                    <div className="flex justify-between items-center">
                         <h2 className="text-xl font-semibold">Fixtures & Results</h2>
                        {isCaptain && (
                            <Button onClick={() => setIsFixtureModalOpen(true)}>Propose Fixture</Button>
                        )}
                    </div>
                    <TeamFixtures fixtures={fixtures} teamId={teamId} isCaptain={isCaptain} />
                </div>
                <div className="lg:col-span-1 space-y-6">
                    {/* Render captain's tools if the user is the captain */}
                    {isCaptain && (
                        <JoinRequests teamId={teamId} onAction={fetchTeamData} />
                    )}
                    <LeagueStandings standings={standings} teamId={teamId} />
                </div>
            </div>
                {/* Modal for creating a fixture */}
                <Modal isOpen={isFixtureModalOpen} onClose={handleModalClose} title="Propose a New Fixture">
                    <CreateFixtureForm team={team} onClose={handleModalClose} />
                </Modal>

        </div>
    );
};


export default TeamDetailsPage;