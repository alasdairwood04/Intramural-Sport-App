import { useEffect, useState } from 'react';
import { getLeagueStandings } from '../../api/leagueApi';
import LeagueStandings from '../teams/LeagueStandings';

const SportSeasonView = ({ teams }) => {
    // Group teams by sport
    const sportsInSeason = teams.reduce((acc, team) => {
        if (!acc[team.sport_id]) {
            acc[team.sport_id] = { sportName: team.sport_name, teams: [] };
        }
        acc[team.sport_id].teams.push(team);
        return acc;
    }, {});

    return (
        <div className="space-y-8">
            {Object.entries(sportsInSeason).map(([sportId, { sportName, teams }]) => (
                <div key={sportId}>
                    <h2 className="text-2xl font-bold mb-4">{sportName} League</h2>
                    <LeagueStandingsWrapper sportId={sportId} seasonId={teams[0].season_id} />
                </div>
            ))}
        </div>
    );
};


// A small wrapper to fetch standings for each sport
const LeagueStandingsWrapper = ({ sportId, seasonId }) => {
    const [standings, setStandings] = useState([]);
    
    useEffect(() => {
        const fetchStandings = async () => {
            try {
                const res = await getLeagueStandings(seasonId, sportId);
                setStandings(res.data.data);
            } catch (error) {
                console.error(`Failed to fetch standings for sport ${sportId}`, error);
            }
        };
        fetchStandings();
    }, [sportId, seasonId]);

    return <LeagueStandings standings={standings} />;
};


export default SportSeasonView;
