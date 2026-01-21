/**
 * Membership Plans API client
 */
import apiClient from './axios';

export const getPlans = async () => {
  const res = await apiClient.get('/plans');
  return res.data;
};

export const getPlan = async (id) => {
  const res = await apiClient.get(`/plans/${id}`);
  return res.data;
};

export const createPlan = async (data) => {
  const res = await apiClient.post('/plans/', data);
  return res.data;
};

export const updatePlan = async (id, data) => {
  const res = await apiClient.put(`/plans/${id}`, data);
  return res.data;
};

export const deletePlan = async (id) => {
  const res = await apiClient.delete(`/plans/${id}`);
  return res.data;
};

export default {
  getPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
};
