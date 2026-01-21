/**
 * Centralized Axios configuration for API communication.
 * Handles JWT token attachment and automatic token refresh/redirect on 401.
 */
import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const API_PREFIX = import.meta.env.VITE_API_PREFIX || '';

const DEFAULT_PORT = '8000';
const envBase = import.meta.env.VITE_API_BASE_URL;
let API_BASE_URL;
if (envBase) {
  API_BASE_URL = envBase;
} else if (typeof window !== 'undefined' && window.location && window.location.hostname) {
  const proto = window.location.protocol || 'http:';
  API_BASE_URL = `${proto}//${window.location.hostname}:${DEFAULT_PORT}`;
} else {
  API_BASE_URL = `http://localhost:${DEFAULT_PORT}`;
}

// Normalize base URL and prefix to avoid accidental redirects
const normalizedBase = API_BASE_URL.replace(/\/$/, '');
// const normalizedPrefix = API_PREFIX ? API_PREFIX : '';
const normalizedPrefix = API_PREFIX ? (API_PREFIX.startsWith('/') ? API_PREFIX : `/${API_PREFIX}`) : '';
const resolvedBaseURL = `${normalizedBase}${normalizedPrefix}`;

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: resolvedBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    config.headers = config.headers || {};
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle 401 errors (token expiry)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helpful debugging: print resolved baseURL used by axios
console.log('API BASE URL (resolved):', apiClient.defaults.baseURL);


export default apiClient;

