/**
 * Fitness Checkup API client
 *
 * Handles communication with backend fitness checkup endpoints:
 * - GET /fitness-checkups/due - Get members with due checkups
 * - POST /fitness-checkups/{id}/mark-done - Mark a checkup as completed
 */

import api from "./axios";

/**
 * Fetch members with fitness checkups due within the next 2 days
 *
 * @returns {Promise<Array>} Array of member objects with due checkups
 * @throws {Error} If the API request fails
 */
export const getFitnesCheckupsDue = async () => {
  try {
    const response = await api.get("/fitness-checkups/due");
    return response.data;
  } catch (error) {
    console.error("Error fetching fitness checkups due:", error);
    throw error;
  }
};

/**
 * Mark a fitness checkup as completed for a member
 *
 * Updates:
 * - last_fitness_checkup_date = today
 * - next_fitness_checkup_date = today + 21 days
 *
 * @param {number} memberId - The member's ID
 * @returns {Promise<Object>} Updated member object
 * @throws {Error} If the API request fails or member not found
 */
export const markFitnessCheckupDone = async (memberId) => {
  try {
    const response = await api.post(
      `/fitness-checkups/${memberId}/mark-done`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error marking fitness checkup done for member ${memberId}:`,
      error
    );
    throw error;
  }
};
