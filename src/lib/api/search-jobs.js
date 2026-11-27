// lib/api/search-jobs.js
import axios from 'axios';
import API from '../api';

const LOCAL_ENGINE_URL = 'http://localhost:5000/api';

const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const getAuthHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('ws_token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  return headers;
};

export const searchJobsApi = {
  async getAll({ page = 1, limit = 20, status = '', search = '' } = {}) {
    try {
      const params = new URLSearchParams({ page, limit });
      if (status) params.set('status', status);
      if (search) params.set('search', search);
      const { data } = await API.get(`/search-jobs?${params}`);
      return data;
    } catch {
      return { success: true, data: [], total: 0, page: 1, pages: 1 };
    }
  },

  async getById(id) {
    try {
      const { data } = await API.get(`/search-jobs/${id}`);
      return data;
    } catch {
      return { success: true, data: null };
    }
  },

  async create(payload) {
    try {
      // 1. Try sending to Local PC Engine only when running on local desktop browser
      if (isLocalhost) {
        try {
          const localRes = await axios.post(`${LOCAL_ENGINE_URL}/search-jobs`, payload, {
            headers: getAuthHeaders(),
            timeout: 1000 * 60 * 60, // 1 hour timeout for extraction
          });
          if (localRes?.data) return localRes.data;
        } catch (localErr) {
          // If local engine returned a 4xx response from server logic (e.g. validation), throw it
          if (localErr.response && localErr.response.status < 500) {
            throw new Error(localErr.response.data?.message || 'Scrape job failed');
          }
        }
      }

      // 2. Fallback to default API instance
      const { data } = await API.post('/search-jobs', payload, {
        timeout: 1000 * 60 * 60,
      });
      return data;
    } catch (err) {
      if (err.response) throw new Error(err.response.data?.message || 'Failed to create job');
      throw err;
    }
  },

  async getLiveStatus() {
    try {
      if (isLocalhost) {
        try {
          const localRes = await axios.get(`${LOCAL_ENGINE_URL}/search-jobs/live-status`, {
            headers: getAuthHeaders(),
            timeout: 1500,
          });
          if (localRes?.data?.data && localRes.data.data.status !== 'idle') {
            return localRes.data;
          }
        } catch (e) {}
      }

      const { data } = await API.get('/search-jobs/live-status');
      return data || { success: false, data: null };
    } catch {
      return { success: false, data: null };
    }
  },

  async getLiveLogs() {
    try {
      if (isLocalhost) {
        try {
          const localRes = await axios.get(`${LOCAL_ENGINE_URL}/search-jobs/logs`, {
            headers: getAuthHeaders(),
            timeout: 1500,
          });
          if (localRes?.data?.logs && Array.isArray(localRes.data.logs) && localRes.data.logs.length > 0) {
            return localRes.data;
          }
        } catch (e) {}
      }

      const { data } = await API.get('/search-jobs/logs');
      return data || { success: false, logs: [] };
    } catch {
      return { success: false, logs: [] };
    }
  },

  async stop() {
    try {
      if (isLocalhost) {
        try {
          await axios.post(`${LOCAL_ENGINE_URL}/search-jobs/stop`, {}, {
            headers: getAuthHeaders(),
            timeout: 2000,
          });
        } catch (e) {}
      }
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
      return { success: true };
    }
  },
};
