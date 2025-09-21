import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Menu, Search, Bell, User, Settings, LogOut, Shield } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setIsProfileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link 
              to={user ? "/dashboard" : "/"} 
              className="flex items-center space-x-3 group"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">IS</span>
              </div>
              <span className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors duration-200">
                Intramural Sports
              </span>
            </Link>
          </div>

          {/* Search - Only show when logged in */}
          {user && (
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-neutral-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search teams, players, fixtures..."
                  className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-lg text-sm placeholder-neutral-400 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Admin Dashboard Link */}
                {user.role === 'admin' && (
                  <Link 
                    to="/admin/dashboard" 
                    className="hidden sm:flex items-center space-x-2 px-3 py-2 text-sm font-medium text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}

                {/* Notifications */}
                <button className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-all duration-200 relative">
                  <Bell className="h-5 w-5" />
                  {/* Notification dot */}
                  <span className="absolute top-1 right-1 h-2 w-2 bg-primary-500 rounded-full"></span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 p-1.5 rounded-lg hover:bg-neutral-100 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user.first_name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-neutral-900">
                        {user.first_name} {user.last_name}
                      </div>
                      <div className="text-xs text-neutral-500 capitalize">
                        {user.role}
                      </div>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-1 z-50">
                      <div className="px-4 py-3 border-b border-neutral-100">
                        <div className="text-sm font-medium text-neutral-900">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-neutral-500">{user.email}</div>
                      </div>
                      
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors duration-150"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                      
                      <Link
                        to="/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors duration-150"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                      
                      <div className="border-t border-neutral-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors duration-150"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Guest Navigation */
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-sm font-medium text-neutral-600 hover:text-neutral-900 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-all duration-200"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-sm"
                >
                  Get started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button className="sm:hidden p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-all duration-200">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isProfileOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </header>
  );
};

export default Navbar;