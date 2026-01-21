/**
 * Trainers API endpoints.
 */
import apiClient from './axios';

export const getTrainers = async () => {
  const response = await apiClient.get('/trainers');
  return response.data;
};

export const getTrainerById = async (id) => {
  const response = await apiClient.get(`/trainers/${id}`);
  return response.data;
};

export const createTrainer = async (data) => {
  console.log('api/trainers.createTrainer: calling POST /trainers', data);
  try {
    const response = await apiClient.post('/trainers', data);
    console.log('api/trainers.createTrainer: response', response.status, response.data);
    return response.data;
  } catch (err) {
    console.error('api/trainers.createTrainer: error', err);
    throw err;
  }
};

export const updateTrainer = async (id, data) => {
  const response = await apiClient.put(`/trainers/${id}`, data);
  return response.data;
};

export const deleteTrainer = async (id) => {
  const response = await apiClient.delete(`/trainers/${id}`);
  return response.data;
};
