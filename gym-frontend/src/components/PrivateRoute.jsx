/**
 * PrivateRoute component protects routes that require authentication.
 * Redirects to login if user is not authenticated.
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from './Loading';
import { ROLES } from '../utils/roleConfig';

/**
 * PrivateRoute now supports optional role-based authorization.
 * - If `allowedRoles` is provided (array), the current user's role
 *   must be present in that array to access the route.
 * - Otherwise, only authentication is required.
 *
 * Usage: <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.TRAINER]}>...</PrivateRoute>
 */
const PrivateRoute = ({ children, allowedRoles = null }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <Loading fullScreen message="Checking authentication..." />;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles provided, enforce role-based access
  if (allowedRoles && Array.isArray(allowedRoles)) {
    const role = user?.role?.toLowerCase?.() || '';
    const allowed = allowedRoles.map((r) => r.toLowerCase()).includes(role);
    if (!allowed) {
      // 403-friendly UI when user is authenticated but not authorized
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-gray-900 rounded-lg p-8 max-w-xl text-center">
            <h1 className="text-3xl font-bold text-red-400 mb-4">403 — Forbidden</h1>
            <p className="text-gray-300 mb-4">You don't have permission to view this page.</p>
            <p className="text-sm text-gray-400">If you believe this is an error, contact an administrator.</p>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default PrivateRoute;

