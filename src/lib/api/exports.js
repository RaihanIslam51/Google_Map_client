// lib/api/exports.js
import API from '../api';

const MOCK_EXPORTS = [
  { _id: 'e1', name: 'restaurant-dinajpur', keyword: 'restaurant in Dinajpur', format: 'csv', records: 94, status: 'ready', createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), downloadUrl: '#' },
  { _id: 'e2', name: 'hotel-dinajpur', keyword: 'hotel in Dinajpur', format: 'json', records: 65, status: 'ready', createdAt: new Date(Date.now() - 4 * 3600000).toISOString(), downloadUrl: '#' },
  { _id: 'e3', name: 'all-businesses', keyword: null, format: 'csv', records: 1284, status: 'processing', createdAt: new Date(Date.now() - 10 * 60000).toISOString(), downloadUrl: null },
];

export const exportsApi = {
  async getAll() {
    try {
      const { data } = await API.get('/exports');
      return data;
    } catch {
      return { success: true, data: MOCK_EXPORTS, _mock: true };
    }
  },

  async create(payload) {
    try {
      const { data } = await API.post('/exports', payload);
      return data;
    } catch {
      return { success: true, data: { _id: `e${Date.now()}`, ...payload, status: 'processing', createdAt: new Date().toISOString() }, _mock: true };
    }
  },

  async download(id) {
    try {
      const { data } = await API.get(`/exports/${id}/download`, { responseType: 'blob' });
      return data;
    } catch {
      return null;
    }
  },
};
