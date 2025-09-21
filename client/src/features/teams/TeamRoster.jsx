import { Shield, User } from 'lucide-react';

const TeamRoster = ({ members = [] }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Roster</h3>
      <ul className="space-y-3">
        {members.map(member => (
          <li key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-200 p-2 rounded-full">
                <User className="text-gray-600" size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-800">{member.first_name} {member.last_name}</p>
                <p className="text-sm text-gray-500">{member.email}</p>
              </div>
            </div>
            {member.role === 'captain' && (
              <div className="flex items-center space-x-1 text-yellow-600">
                <Shield size={16} />
                <span className="text-xs font-semibold">Captain</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamRoster;