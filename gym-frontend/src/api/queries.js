/**
 * Queries API endpoints for admin management.
 * Handles CRUD operations for customer queries (trial requests, membership inquiries, contact forms).
 */
import apiClient from './axios';

/**
 * Get all queries
 * @returns {Promise} Array of query objects
 */
export const getQueries = async () => {
  const response = await apiClient.get('/queries');
  return response.data;
};

/**
 * Get a single query by ID
 * Note: Backend may not have GET /queries/{id} endpoint
 * For now, we'll filter from the list
 * @param {number} id - Query ID
 * @returns {Promise} Query object
 */
export const getQueryById = async (id) => {
  // TODO: Check if backend has GET /queries/{id} endpoint
  // For now, fetch all and filter
  const queries = await getQueries();
  return queries.find(q => q.id === parseInt(id)) || null;
};

/**
 * Update query status
 * @param {number} id - Query ID
 * @param {string} status - New status (e.g., 'new', 'contacted', 'converted')
 * @returns {Promise} Success message
 */
export const updateQueryStatus = async (id, status) => {
  // Backend endpoint: PATCH /queries/{query_id}/status?status={status}
  const response = await apiClient.patch(`/queries/${id}/status?status=${status}`);
  return response.data;
};

/**
 * Delete a query
 * @param {number} id - Query ID
 * @returns {Promise} Success message
 */
export const deleteQuery = async (id) => {
  const response = await apiClient.delete(`/queries/${id}`);
  return response.data;
};

