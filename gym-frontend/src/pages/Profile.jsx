/**
 * User profile page displaying account information and settings.
 * Shows user details, role, status, and logout option.
 */
import { useAuth } from '../hooks/useAuth';
import Button from '../components/forms/Button';
import { formatDate } from '../utils/formatters';

const Profile = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-semibold text-white">
                {user?.name || 'User'}
              </h2>
              <p className="text-gray-400">{user?.email || 'No email'}</p>
            </div>
          </div>

          {/* User Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-700">
            <div>
              <p className="text-sm text-gray-400 mb-1">Email</p>
              <p className="text-white font-medium">{user?.email || 'N/A'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-1">Role</p>
              <span className="inline-block px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium">
                {user?.role || 'member'}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-1">Account Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  user?.status === 'approved'
                    ? 'bg-green-500/20 text-green-400'
                    : user?.status === 'pending'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {user?.status || 'Unknown'}
              </span>
            </div>

            {user?.id && (
              <div>
                <p className="text-sm text-gray-400 mb-1">User ID</p>
                <p className="text-white font-medium">#{user.id}</p>
              </div>
            )}

            {user?.created_at && (
              <div>
                <p className="text-sm text-gray-400 mb-1">Member Since</p>
                <p className="text-white font-medium">
                  {formatDate(user.created_at)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Account Actions
          </h3>
          <div className="space-y-3">
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => alert('Password change feature coming soon!')}
            >
              Change Password
            </Button>
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => alert('Profile edit feature coming soon!')}
            >
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-gray-800 rounded-xl p-6 border border-red-500/50">
          <h3 className="text-xl font-semibold text-white mb-2">Danger Zone</h3>
          <p className="text-gray-400 text-sm mb-4">
            Logout from your account. You'll need to login again to access your data.
          </p>
          <Button variant="danger" size="md" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Future Enhancements Placeholder */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">
            Coming Soon
          </h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>• Workout history and statistics</li>
            <li>• Progress photos</li>
            <li>• Body measurements tracking</li>
            <li>• Personal records (PRs)</li>
            <li>• Achievement badges</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;

