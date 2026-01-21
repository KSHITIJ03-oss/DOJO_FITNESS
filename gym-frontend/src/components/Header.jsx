/**
 * Header/Navbar component with navigation links and user menu.
 * Highlights active route and shows logout option.
 */
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { NAV_ITEMS, isRoleAllowed } from '../utils/roleConfig';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path
      ? "text-primary-400 border-b-2 border-primary-400"
      : "text-gray-300 hover:text-primary-400";
  };

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center">
            <span className="text-2xl font-bold text-primary-400">DOJO</span>
            <span className="ml-2 text-gray-300">Fitness</span>
          </Link>

          {/* Navigation: render only items allowed for the current role */}
          <nav className="hidden md:flex space-x-8">
            {NAV_ITEMS.filter((item) => isRoleAllowed(user?.role, item.allowed)).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-sm font-medium transition-colors ${isActive(item.path)}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-sm text-gray-400 hidden sm:inline">
                {user.name || user.email}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-red-400 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden border-t border-gray-700 px-4 py-2">
        <div className="flex space-x-4 overflow-x-auto">
          {NAV_ITEMS.filter((item) => isRoleAllowed(user?.role, item.allowed)).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 text-xs font-medium whitespace-nowrap ${isActive(item.path)}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
