import Card from "../../components/common/Card";

const LeagueStandings = ({ standings = [], teamId }) => {
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-3">League Standings</h3>
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-2">Team</th>
            <th scope="col" className="px-4 py-2">W</th>
            <th scope="col" className="px-4 py-2">L</th>
            <th scope="col" className="px-4 py-2">D</th>
          </tr>
        </thead>
        <tbody>
          {standings.map(team => (
            <tr key={team.id} className={`${team.id === teamId ? 'bg-blue-50 font-bold' : ''}`}>
              <td className="px-4 py-2">{team.name}</td>
              <td className="px-4 py-2">{team.wins}</td>
              <td className="px-4 py-2">{team.losses}</td>
              <td className="px-4 py-2">{team.draws}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

export default LeagueStandings;
