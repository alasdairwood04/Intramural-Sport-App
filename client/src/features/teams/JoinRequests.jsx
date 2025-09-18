import { useEffect, useState } from 'react';
import { getJoinRequests, approveJoinRequest, rejectJoinRequest } from '../../api/teamsApi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Check, X } from 'lucide-react';

const JoinRequests = ({ teamId, onAction }) => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            setIsLoading(true);
            const response = await getJoinRequests(teamId);
            setRequests(response.data.data);
        } catch (error) {
            console.error("Failed to fetch join requests", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [teamId]);

    const handleApprove = async (requestId) => {
        await approveJoinRequest(teamId, requestId);
        onAction(); // Notify parent to refetch data
        fetchRequests(); // Refresh this component's data
    };

    const handleReject = async (requestId) => {
        await rejectJoinRequest(teamId, requestId);
        fetchRequests(); // Refresh this component's data
    };

    if (isLoading) return <p>Loading requests...</p>;

    return (
        <Card>
            <h3 className="text-lg font-semibold mb-3">Pending Join Requests</h3>
            {requests.length > 0 ? (
                <ul className="space-y-2">
                    {requests.map(req => (
                        <li key={req.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                            <div>
                                <p className="font-medium">{req.first_name} {req.last_name}</p>
                                <p className="text-xs text-gray-500">{req.email}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button onClick={() => handleApprove(req.id)} size="sm" variant="success">
                                    <Check size={16} />
                                </Button>
                                <Button onClick={() => handleReject(req.id)} size="sm" variant="danger">
                                    <X size={16} />
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-500">No pending requests.</p>
            )}
        </Card>
    );
};

export default JoinRequests;
