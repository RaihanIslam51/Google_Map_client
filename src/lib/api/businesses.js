// lib/api/businesses.js
import API from '../api';

export const businessesApi = {
  /**
   * GET /api/businesses
   * Returns paginated list of businesses — no mock fallback
   */
  async getAll({ page = 1, limit = 20, search = '', category = '', keyword = '', isTarget } = {}) {
    const params = new URLSearchParams({ page, limit });
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (keyword) params.set('keyword', keyword);
    if (isTarget !== undefined && isTarget !== null) params.set('isTarget', isTarget);
    const { data } = await API.get(`/businesses?${params}`);
    return data;
  },

  async getById(id) {
    const { data } = await API.get(`/businesses/${id}`);
    return data;
  },

  async deleteById(id) {
    try {
      const { data } = await API.delete(`/businesses/${id}`);
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete business');
    }
  },

  async toggleTarget(id, isTarget) {
    try {
      const { data } = await API.patch(`/businesses/${id}/target`, { isTarget });
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update target status');
    }
  },

  async deleteBulk({ ids, keyword, category } = {}) {
    try {
      const payload = {};
      if (ids) payload.ids = ids;
      if (keyword) payload.keyword = keyword;
      if (category) payload.category = category;
      const { data } = await API.post('/businesses/bulk-delete', payload);
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete selected leads');
    }
  },

  async getStats() {
    const { data } = await API.get('/businesses/stats');
    return data;
  },
};
