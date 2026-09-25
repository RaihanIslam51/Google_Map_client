// lib/api/analytics.js
import API from '../api';

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

const MOCK_ACTIVITY = Array.from({ length: 7 }, (_, i) => ({
  date: daysAgo(6 - i),
  businesses: [120, 340, 520, 780, 920, 1100, 1284][i],
  searches: [3, 8, 12, 18, 22, 28, 34][i],
}));

export const analyticsApi = {
  async getDashboardStats() {
    try {
      const { data } = await API.get('/businesses/stats');
      return data;
    } catch {
      return {
        success: true,
        data: {
          totalBusinesses: 1284,
          totalSearches: 48,
          successfulRuns: 42,
          currentlyRunning: 2,
          duplicates: 137,
          failedRecords: 23,
          changePercent: {
            totalBusinesses: 12.4,
            totalSearches: 8.3,
            successfulRuns: 5.0,
            currentlyRunning: 0,
            duplicates: -3.2,
            failedRecords: -1.1,
          },
        },
        _mock: true,
      };
    }
  },

  async getActivity({ days = 7 } = {}) {
    try {
      const { data } = await API.get(`/analytics/activity?days=${days}`);
      return data;
    } catch {
      const count = Math.min(days, 90);
      const items = Array.from({ length: count }, (_, i) => ({
        date: daysAgo(count - 1 - i),
        businesses: Math.floor(100 + Math.random() * 1200),
        searches: Math.floor(1 + Math.random() * 10),
      }));
      return { success: true, data: days === 7 ? MOCK_ACTIVITY : items, _mock: true };
    }
  },

  async getCategoryDistribution() {
    try {
      const { data } = await API.get('/analytics/categories');
      return data;
    } catch {
      return {
        success: true,
        data: [
          { category: 'Restaurant', count: 423 },
          { category: 'School', count: 302 },
          { category: 'Hotel', count: 218 },
          { category: 'Hospital', count: 187 },
          { category: 'Pharmacy', count: 154 },
        ],
        _mock: true,
      };
    }
  },
};
