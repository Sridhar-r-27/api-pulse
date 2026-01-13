import axios from 'axios';

const API_BASE_URL = 'https://api-pulse-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllApisSummary = async () => {
  const response = await api.get('/summary');
  return response.data;
};

export const getSchedulerStatus = async () => {
  const response = await api.get('/scheduler/status');
  return response.data;
};

export const triggerManualTest = async () => {
  const response = await api.post('/scheduler/trigger');
  return response.data;
};

export const stopScheduler = async () => {
  const response = await api.post('/scheduler/stop');
  return response.data;
};

export const resumeScheduler = async () => {
  const response = await api.post('/scheduler/resume');
  return response.data;
};

export const getApiHistory = async (apiName, limit = 20) => {
  const response = await api.get(`/tests/${encodeURIComponent(apiName)}?limit=${limit}`);
  return response.data;
};

export default api;
