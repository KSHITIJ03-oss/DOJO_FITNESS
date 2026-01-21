/**
 * Public API endpoints for lead generation.
 * Handles trial requests and membership inquiries from public website visitors.
 * 
 * Backend Integration:
 * - POST /queries/ - Creates a new query (trial or membership inquiry)
 * - All queries are stored with status="new" by default
 * - Admin can later view and manage these queries in the admin dashboard
 */
import apiClient from './axios';

/**
 * Submit a free trial request
 * @param {Object} data - { name, mobile, email, preferred_time_slot, message }
 * @returns {Promise} Created query object
 */
export const submitTrialRequest = async (data) => {
  // Backend endpoint: POST /queries/
  // The backend accepts: name, mobile, email (optional), message (optional)
  // For trial requests, we include preferred_time_slot in the message field
  const payload = {
    name: data.name,
    mobile: data.mobile,
    email: data.email || null,
    message: data.preferred_time_slot 
      ? `Trial Request - Preferred Time: ${data.preferred_time_slot}. ${data.message || ''}`.trim()
      : data.message || 'Free trial request',
  };

  try {
    console.log('Submitting trial request:', payload);
    const response = await apiClient.post('/queries', payload);
    console.log('Trial request successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Trial request error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    });
    throw error;
  }
};

/**
 * Submit a membership inquiry/join request
 * @param {Object} data - { name, mobile, email, interested_plan, message }
 * @returns {Promise} Created query object
 */
export const submitJoinRequest = async (data) => {
  // Backend endpoint: POST /queries/
  // For membership inquiries, include interested_plan in the message field
  const payload = {
    name: data.name,
    mobile: data.mobile,
    email: data.email || null,
    message: data.interested_plan
      ? `Membership Inquiry - Interested Plan: ${data.interested_plan}. ${data.message || ''}`.trim()
      : data.message || 'Membership inquiry',
  };

  try {
    console.log('Submitting join request:', payload);
    const response = await apiClient.post('/queries', payload);
    console.log('Join request successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Join request error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    });
    throw error;
  }
};

/**
 * Submit a general contact form query
 * @param {Object} data - { name, mobile, email, message }
 * @returns {Promise} Created query object
 */
export const submitContactRequest = async (data) => {
  const payload = {
    name: data.name,
    mobile: data.mobile,
    email: data.email || null,
    message: data.message || 'Contact form submission',
  };

  try {
    console.log('Submitting contact request:', payload);
    const response = await apiClient.post('/queries', payload);
    console.log('Contact request successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Contact request error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    });
    throw error;
  }
};

