// lib/api/businesses.js
import API from '../api';

export const businessesApi = {
  /**
   * GET /api/businesses
   * Returns paginated list of businesses — no mock fallback
   */
  async getAll({ page = 1, limit = 20, search = '', category = '', keyword = '', isTarget, status } = {}) {
    const params = new URLSearchParams({ page, limit });
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (keyword) params.set('keyword', keyword);
    if (isTarget !== undefined && isTarget !== null) params.set('isTarget', isTarget);
    if (status && status !== 'All') params.set('status', status);
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

  async updateStatus(id, status) {
    try {
      const { data } = await API.patch(`/businesses/${id}/status`, { status });
      return data;
    } catch (err) {
      try {
        const { data } = await API.patch(`/businesses/${id}/target`, { status });
        return data;
      } catch (err2) {
        throw new Error(err.response?.data?.message || err2.response?.data?.message || 'Failed to update status');
      }
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

  async bulkUntarget({ category, keyword } = {}) {
    try {
      const { data } = await API.patch('/businesses/bulk-untarget', { category, keyword });
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to remove targets');
    }
  },

  async getStats() {
    const { data } = await API.get('/businesses/stats');
    return data;
  },
};
