// alasdairwood04/intramural-sport-app/Intramural-Sport-App-99e1da5415a846419501e81dab912798cc11b8c9/client/src/components/layout/Navbar.jsx
import { Link } from 'react-router-dom';
// We'll create the useAuth hook next
// import { useAuth } from '../../hooks/useAuth'; 

const Navbar = () => {
  // const { user, logout } = useAuth(); // Example of how we'll use it later
  const user = null; // Placeholder

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-semibold text-gray-800">
              🏅 Intramural Sports
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <span className="text-gray-700">{user.email}</span>
                <button
                  // onClick={logout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;