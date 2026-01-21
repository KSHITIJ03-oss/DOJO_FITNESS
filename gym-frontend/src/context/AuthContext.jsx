/**
 * Authentication Context Provider.
 * Manages global authentication state and provides auth methods to all components.
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginAPI, register as registerAPI, getCurrentUser } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on mount....this was a temp
  // useEffect(() => {
  //   const initAuth = async () => {
  //     const token = localStorage.getItem('token');
  //     const userStr = localStorage.getItem('user');
      
  //     if (token && userStr) {
  //       try {
  //         const userData = JSON.parse(userStr);
  //         setUser(userData);
  //       } catch (error) {
  //         // Invalid user data, clear storage
  //         localStorage.removeItem('token');
  //         localStorage.removeItem('user');
  //       }
  //     }
  //     setLoading(false);
  //   };

  //   initAuth();
  // }, []);

// this is the permenant change where we fetch details from our backend for verification of user
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('token');
  
      if (!token) {
        setLoading(false);
        return;
      }
  
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        // Token invalid / expired
        console.warn('Session expired. Logging out.');
        logout();
      } finally {
        setLoading(false);
      }
    };
  
    verifySession();
  }, []);
  

  /**
   * Login user and store token + user data
   */
  const login = async (email, password) => {
    try {
      const response = await loginAPI({ email, password });
      const { access_token } = response;
      
      // Store token
      localStorage.setItem('token', access_token);
      
      // Decode token to get user info (simple base64 decode)
      // In production, you'd want to verify the token signature
      try {
        const payload = JSON.parse(atob(access_token.split('.')[1]));
        const userData = {
          id: payload.sub,
          role: payload.role,
          email: email, // We don't get email from token, so use login email
        };
        
        // Try to get full user data from backend
        try {
          const fullUser = await getCurrentUser();
          setUser(fullUser);
          localStorage.setItem('user', JSON.stringify(fullUser));
        } catch {
          // Fallback to basic user data from token
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch {
        // If token decode fails, create minimal user object
        const userData = { email, role: 'member' };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      return { success: true };
    } catch (error) {
      // Better error handling - log for debugging
      console.error('Login error:', error);
      const errorMessage = 
        error.response?.data?.detail || 
        error.message || 
        'Login failed. Please check your credentials.';
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Register new user
   */
  const register = async (name, email, password) => {
    try {
      const userData = await registerAPI({ name, email, password });
      // Registration successful, but user needs approval
      return {
        success: true,
        message: 'Registration successful! Please wait for admin approval.',
        user: userData,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Registration failed',
      };
    }
  };

  /**
   * Logout user and clear all auth data
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('token');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to access auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

