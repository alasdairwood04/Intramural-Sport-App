import { createContext, useState, useEffect } from "react";
import { checkAuthStatus, loginUser, logoutUser, registerUser } from "../api/authApi";

export const AuthContext = createContext(null); // Create the AuthContext with default value null

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if the user is already logged in on initial load
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await checkAuthStatus();
                if (response.data.success) {
                    setUser(response.data.user);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to verify authentication');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        verifyAuth();
    }, []);


    const login = async (credentials) => {
        const response = await loginUser(credentials);
        if (response.data.success) {
            setUser(response.data.user);
            setError(null);
        } else {
            setError(response.data.message);
        }
        return response;
    }

    const register = async (userData) => {
        const response = await registerUser(userData);
        if (response.data.success) {
            setUser(response.data.user);
            setError(null);
        } else {
            setError(response.data.message);
        }
        return response;
    }

    const logout = async () => {
        const response = await logoutUser();
        if (response.data.success) {
            setUser(null);
            setError(null);
        } else {
            setError(response.data.message);
        }
        return response;
    }

    const value = { user, loading, error, login, register, logout };
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};