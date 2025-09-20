import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ProtectedRoute from './ProtectedRoute';
import TeamDetailsPage from '../pages/TeamDetailsPage';
import SeasonDetailsPage from '../pages/SeasonDetailsPage';
import TeamsheetPage from '../pages/TeamsheetPage';
import FixtureTeamsheetPage from '../pages/FixtureTeamsheetPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import ManageSportsPage from '../pages/ManageSportsPage';
import ManageSeasonsPage from '../pages/ManageSeasonsPage';
// import ManageUsersPage from '../pages/ManageUsersPage';
import ManageTeamsPage from '../pages/ManageTeamsPage';
import LoginHandler from '../components/LoginHandler'; // Import the LoginHandler

const AppRouter = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login-success" element={<LoginHandler />} /> {/* Add route for LoginHandler */}
            
            {/* Protected user routes */}
            <Route 
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/teams/:teamId"
                element={
                    <ProtectedRoute>
                        <TeamDetailsPage />
                    </ProtectedRoute>
                }
            />
            <Route 
                path="/seasons/:seasonId"
                element={
                    <ProtectedRoute>
                        <SeasonDetailsPage />
                    </ProtectedRoute>
                }
            />
            <Route 
                path="/fixtures/:fixtureId/teamsheet/:teamId"
                element={
                    <ProtectedRoute>
                        <TeamsheetPage />
                    </ProtectedRoute>
                }
            />
            <Route 
                path="/fixtures/:fixtureId/teamsheets"
                element={
                    <ProtectedRoute>
                        <FixtureTeamsheetPage />
                    </ProtectedRoute>
                }
            />

            {/* Protected admin routes */}
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute>
                        <AdminDashboardPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/manage-sports"
                element={
                    <ProtectedRoute>
                        <ManageSportsPage />
                    </ProtectedRoute>
                }
            />
            <Route 
                path="/admin/manage-seasons" 
                element={
                    <ProtectedRoute>
                        <ManageSeasonsPage />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/admin/manage-teams" 
                element={
                    <ProtectedRoute>
                        <ManageTeamsPage />
                    </ProtectedRoute>
                } 
            />
            {/* <Route 
                path="/admin/manage-users" 
                element={
                    <ProtectedRoute>
                        <ManageUsersPage />
                    </ProtectedRoute>
                } 
            /> */}
        </Routes>
    );
};

export default AppRouter;