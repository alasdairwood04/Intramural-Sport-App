// alasdairwood04/intramural-sport-app/Intramural-Sport-App-99e1da5415a846419501e81dab912798cc11b8c9/client/src/pages/DashboardPage.jsx
import { useAuth } from "../hooks/useAuth";

const DashboardPage = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-lg text-gray-600">
                Welcome back, {user?.first_name} {user?.last_name}!
            </p>
            <div className="mt-6">
                <p>Your role is: <span className="font-semibold capitalize">{user?.role}</span></p>
                <p>Your email is: <span className="font-semibold">{user?.email}</span></p>
                <p>Your student ID is: <span className="font-semibold">{user?.student_id}</span></p>
            </div>
            {/* Dashboard content will go here */}
        </div>
    );
};

export default DashboardPage;