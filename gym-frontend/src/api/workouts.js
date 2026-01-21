/**
 * Workouts API endpoints.
 * Note: Workout endpoints are not yet implemented in the backend.
 * These are placeholder functions for future implementation.
 */
import apiClient from './axios';

/**
 * Get all workouts for the current user
 * TODO: Backend endpoint not found - implement in backend
 * Expected: GET /workouts/
 */
export const getWorkouts = async () => {
  try {
    // Request the list endpoint (use trailing slash to avoid redirects)
    const response = await apiClient.get('/workouts/');
    const data = response.data;

    // Defensive handling: backend should return an array, but tolerate
    // { workouts: [...] } or nested shapes during transitions.
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.workouts)) return data.workouts;

    // Unexpected shape: log and return empty array to avoid UI breakage
    console.warn('getWorkouts: unexpected response shape', data);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    // Return empty array for now if endpoint doesn't exist
    if (error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

/**
 * Get a single workout by ID
 * TODO: Backend endpoint not found - implement in backend
 * Expected: GET /workouts/{id}
 */
export const getWorkoutById = async (id) => {
  try {
    const response = await apiClient.get(`/workouts/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Create a new workout
 * TODO: Backend endpoint not found - implement in backend
 * Expected: POST /workouts
 */
export const createWorkout = async (data) => {
  const response = await apiClient.post('/workouts/', data);
  return response.data;
};

/**
 * Update an existing workout
 * TODO: Backend endpoint not found - implement in backend
 * Expected: PUT /workouts/{id}
 */
export const updateWorkout = async (id, data) => {
  const response = await apiClient.put(`/workouts/${id}`, data);
  return response.data;
};

/**
 * Delete a workout
 * TODO: Backend endpoint not found - implement in backend
 * Expected: DELETE /workouts/{id}
 */
export const deleteWorkout = async (id) => {
  const response = await apiClient.delete(`/workouts/${id}`);
  return response.data;
};

