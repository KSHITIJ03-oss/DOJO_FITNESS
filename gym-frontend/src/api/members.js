/**
 * Members API endpoints.
 * Handles CRUD operations for gym members.
 */
import apiClient from './axios';

/**
 * Get all members
 * @returns {Promise} Array of member objects
 */
export const getMembers = async () => {
  const response = await apiClient.get('/members');
  return response.data;
};

/**
 * Get a single member by ID
 * @param {number} id - Member ID
 * @returns {Promise} Member object
 */
export const getMemberById = async (id) => {
  const response = await apiClient.get(`/members/${id}`);
  return response.data;
};

/**
 * Create a new member
 * @param {Object} data - Member data { name, phone, age, gender, address, membership_type, membership_start, membership_end }
 * @returns {Promise} Created member object
 */
export const createMember = async (data) => {
  const response = await apiClient.post('/members', data);
  return response.data;
};

/**
 * Update an existing member
 * @param {number} id - Member ID
 * @param {Object} data - Updated member data (all fields optional)
 * @returns {Promise} Updated member object
 */
export const updateMember = async (id, data) => {
  const response = await apiClient.put(`/members/${id}`, data);
  return response.data;
};

/**
 * Delete a member
 * @param {number} id - Member ID
 * @returns {Promise} Success message
 */
export const deleteMember = async (id) => {
  const response = await apiClient.delete(`/members/${id}`);
  return response.data;
};

/**
 * Upload member profile image
 * @param {number} id - Member ID
 * @param {File} imageFile - Image file to upload
 * @returns {Promise} Updated member object with image_url
 */
export const uploadMemberImage = async (id, imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  
  const response = await apiClient.post(`/members/${id}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Delete member profile image
 * @param {number} id - Member ID
 * @returns {Promise} Updated member object with image_url set to null
 */
export const deleteMemberImage = async (id) => {
  const response = await apiClient.delete(`/members/${id}/image`);
  return response.data;
};
