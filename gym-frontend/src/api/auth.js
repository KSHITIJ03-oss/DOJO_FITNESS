/**
 * Authentication API endpoints.
 * Handles user registration, login, and current user retrieval.
 */
import apiClient from './axios';

/**
 * Register a new user account
 * @param {Object} data - { name, email, password }
 * @returns {Promise} User object
 */
export const register = async (data) => {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
};

/**
 * Login with email and password
 * @param {Object} data - { email, password }
 * @returns {Promise} { access_token, token_type }
 */
export const login = async (data) => {
  try {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  } catch (error) {
    // Log the full error for debugging
    console.error('Login API error:', {
      url: error.config?.url || '/auth/login',
      baseURL: error.config?.baseURL || apiClient.defaults.baseURL,
      error: error.response?.data || error.message,
      status: error.response?.status,
    });
    throw error;
  }
};

/**
 * Get current authenticated user information
 * Note: This endpoint may not exist in backend - placeholder for future implementation
 * @returns {Promise} User object
 */
// export const getCurrentUser = async () => {
//   // TODO: Backend endpoint /auth/me not found in app/api/auth.py
//   // For now, decode token on frontend or create backend endpoint
//   // Placeholder: return user from localStorage
//   const userStr = localStorage.getItem('user');
//   if (userStr) {
//     return JSON.parse(userStr);
//   }
//   throw new Error('No user found');
// };

export const getCurrentUser = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

