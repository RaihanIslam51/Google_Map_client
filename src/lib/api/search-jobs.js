// lib/api/search-jobs.js
import API from '../api';

const MOCK_JOBS = [
  { _id: 'j1', keyword: 'restaurant in Dinajpur', location: 'Dinajpur', status: 'completed', maxResults: 100, collected: 94, createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  { _id: 'j2', keyword: 'hotel in Dinajpur', location: 'Dinajpur', status: 'completed', maxResults: 100, collected: 65, createdAt: new Date(Date.now() - 4 * 3600000).toISOString() },
  { _id: 'j3', keyword: 'hospital in Dinajpur', location: 'Dinajpur', status: 'running', maxResults: 100, collected: 41, createdAt: new Date(Date.now() - 1 * 3600000).toISOString() },
  { _id: 'j4', keyword: 'school in Dinajpur', location: 'Dinajpur', status: 'pending', maxResults: 100, collected: 0, createdAt: new Date(Date.now() - 30 * 60000).toISOString() },
  { _id: 'j5', keyword: 'pharmacy in Dinajpur', location: 'Dinajpur', status: 'failed', maxResults: 100, collected: 12, createdAt: new Date(Date.now() - 6 * 3600000).toISOString() },
];

export const searchJobsApi = {
  async getAll({ page = 1, limit = 20, status = '', search = '' } = {}) {
    try {
      const params = new URLSearchParams({ page, limit });
      if (status) params.set('status', status);
      if (search) params.set('search', search);
      const { data } = await API.get(`/search-jobs?${params}`);
      return data;
    } catch {
      let items = MOCK_JOBS;
      if (status) items = items.filter(j => j.status === status);
      if (search) items = items.filter(j => j.keyword.toLowerCase().includes(search.toLowerCase()));
      return { success: true, data: items, total: items.length, page: 1, pages: 1, _mock: true };
    }
  },

  async getById(id) {
    try {
      const { data } = await API.get(`/search-jobs/${id}`);
      return data;
    } catch {
      return { success: true, data: MOCK_JOBS.find(j => j._id === id) || null, _mock: true };
    }
  },

  async create(payload) {
    try {
      const { data } = await API.post('/search-jobs', payload);
      return data;
    } catch (err) {
      if (err.response) throw new Error(err.response.data?.message || 'Failed to create job');
      return { success: true, data: { _id: `j${Date.now()}`, ...payload, status: 'pending', collected: 0, createdAt: new Date().toISOString() }, _mock: true };
    }
  },

  async getLiveStatus() {
    try {
      const { data } = await API.get('/search-jobs/live-status');
      return data || { success: false, data: null };
    } catch {
      return { success: false, data: null };
    }
  },

  async getLiveLogs() {
    try {
      const { data } = await API.get('/search-jobs/logs');
      return data || { success: false, logs: [] };
    } catch {
      return { success: false, logs: [] };
    }
  },

  async stop() {
    try {
      const { data } = await API.post('/search-jobs/stop');
      return data;
    } catch (err) {
      if (err.response) throw new Error(err.response.data?.message || 'Failed to stop job');
      return { success: true };
    }
  },

  async deleteById(id) {
    try {
      const { data } = await API.delete(`/search-jobs/${id}`);
      return data;
    } catch {
      return { success: true, _mock: true };
    }
  },
};
