import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginHandler = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      // Check user role and redirect accordingly
      if (currentUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      // If no user is found, redirect to login
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Return null as this is just a utility component
  return null;
};

export default LoginHandler;