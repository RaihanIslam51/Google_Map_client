// lib/api/scraping-runs.js
import API from '../api';

const MOCK_RUNS = [
  { _id: 'r1', keyword: 'restaurant in Dinajpur', jobId: 'j1', status: 'completed', discovered: 120, processed: 120, saved: 94, duplicates: 23, failed: 3, startedAt: new Date(Date.now() - 2 * 3600000).toISOString(), endedAt: new Date(Date.now() - 1.5 * 3600000).toISOString(), durationMs: 1800000 },
  { _id: 'r2', keyword: 'hotel in Dinajpur', jobId: 'j2', status: 'completed', discovered: 87, processed: 87, saved: 65, duplicates: 19, failed: 3, startedAt: new Date(Date.now() - 4 * 3600000).toISOString(), endedAt: new Date(Date.now() - 3.5 * 3600000).toISOString(), durationMs: 1500000 },
  { _id: 'r3', keyword: 'hospital in Dinajpur', jobId: 'j3', status: 'running', discovered: 103, processed: 78, saved: 64, duplicates: 11, failed: 3, startedAt: new Date(Date.now() - 1 * 3600000).toISOString(), endedAt: null, durationMs: null },
  { _id: 'r4', keyword: 'pharmacy in Dinajpur', jobId: 'j5', status: 'failed', discovered: 34, processed: 12, saved: 8, duplicates: 2, failed: 2, startedAt: new Date(Date.now() - 6 * 3600000).toISOString(), endedAt: new Date(Date.now() - 5.8 * 3600000).toISOString(), durationMs: 720000 },
];

export const scrapingRunsApi = {
  async getAll({ page = 1, limit = 20, status = '' } = {}) {
    try {
      const params = new URLSearchParams({ page, limit });
      if (status) params.set('status', status);
      const { data } = await API.get(`/scraping-runs?${params}`);
      return data;
    } catch {
      let items = MOCK_RUNS;
      if (status) items = items.filter(r => r.status === status);
      return { success: true, data: items, total: items.length, _mock: true };
    }
  },

  async getById(id) {
    try {
      const { data } = await API.get(`/scraping-runs/${id}`);
      return data;
    } catch {
      return { success: true, data: MOCK_RUNS.find(r => r._id === id) || null, _mock: true };
    }
  },

  async stop(id) {
    try {
      const { data } = await API.post(`/scraping-runs/${id}/stop`);
      return data;
    } catch {
      return { success: true, _mock: true };
    }
  },
};
