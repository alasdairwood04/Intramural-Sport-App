import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ProtectedRoute from './ProtectedRoute';
import TeamDetailsPage from '../pages/TeamDetailsPage';


const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
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
        </Routes>
    )
}

export default AppRouter;