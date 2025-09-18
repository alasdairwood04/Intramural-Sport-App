import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';

const TeamFixtures = ({ fixtures = [], teamId, isCaptain }) => {
  const upcomingFixtures = fixtures.filter(f => f.status !== 'completed');
  const pastFixtures = fixtures.filter(f => f.status === 'completed');

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-3">Fixtures</h3>
      <div>
        <h4 className="font-semibold text-md mb-2">Upcoming</h4>
        {upcomingFixtures.length > 0 ? (
          <ul className="space-y-2">
            {upcomingFixtures.map(fixture => (
              <li key={fixture.id} className="p-2 bg-gray-50 rounded-md flex justify-between items-center">
                <span>vs Opponent</span>
                {isCaptain && <Link to={`/fixtures/${fixture.id}/teamsheet`} className="text-xs text-blue-600 hover:underline">Manage Teamsheet</Link>}
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-gray-500">No upcoming fixtures.</p>}
      </div>
      <div className="mt-4">
        <h4 className="font-semibold text-md mb-2">Results</h4>
        {pastFixtures.length > 0 ? (
          <ul className="space-y-2">
            {pastFixtures.map(fixture => (
               <li key={fixture.id} className="p-2 bg-gray-50 rounded-md">
                vs Opponent: {fixture.home_team_id === teamId ? `${fixture.home_team_score} - ${fixture.away_team_score}` : `${fixture.away_team_score} - ${fixture.home_team_score}`}
               </li>
            ))}
          </ul>
        ) : <p className="text-sm text-gray-500">No past results.</p>}
      </div>
    </Card>
  );
};

export default TeamFixtures;
