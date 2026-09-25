// lib/api/businesses.js
import API from '../api';

// ─── Mock data (replace with real API when backend endpoints exist) ──────────
const MOCK_BUSINESSES = [
  { _id: '1', name: 'ABC Restaurant', category: 'Restaurant', address: 'Dinajpur Sadar', phone: '01711000001', website: '', rating: 4.5, reviewCount: 120, latitude: 25.6279, longitude: 88.6338, placeId: 'pid1', mapsUrl: 'https://maps.google.com', searchKeyword: 'restaurant in Dinajpur', scrapedAt: new Date(Date.now() - 2 * 60000).toISOString() },
  { _id: '2', name: 'City Hotel', category: 'Hotel', address: 'Station Road, Dinajpur', phone: '01711000002', website: 'https://cityhotel.com', rating: 4.1, reviewCount: 88, latitude: 25.6301, longitude: 88.6401, placeId: 'pid2', mapsUrl: 'https://maps.google.com', searchKeyword: 'hotel in Dinajpur', scrapedAt: new Date(Date.now() - 10 * 60000).toISOString() },
  { _id: '3', name: 'Dinajpur General Hospital', category: 'Hospital', address: 'Hospital Road, Dinajpur', phone: '01711000003', website: '', rating: 3.8, reviewCount: 210, latitude: 25.6245, longitude: 88.6285, placeId: 'pid3', mapsUrl: 'https://maps.google.com', searchKeyword: 'hospital in Dinajpur', scrapedAt: new Date(Date.now() - 30 * 60000).toISOString() },
  { _id: '4', name: 'Green Pharmacy', category: 'Pharmacy', address: 'Nimtola Bazar, Dinajpur', phone: '01711000004', website: '', rating: 4.2, reviewCount: 45, latitude: null, longitude: null, placeId: 'pid4', mapsUrl: 'https://maps.google.com', searchKeyword: 'pharmacy in Dinajpur', scrapedAt: new Date(Date.now() - 60 * 60000).toISOString() },
  { _id: '5', name: 'Dinajpur High School', category: 'School', address: 'Main Road, Dinajpur', phone: '01711000005', website: '', rating: 4.7, reviewCount: 320, latitude: 25.6310, longitude: 88.6355, placeId: 'pid5', mapsUrl: 'https://maps.google.com', searchKeyword: 'school in Dinajpur', scrapedAt: new Date(Date.now() - 120 * 60000).toISOString() },
  { _id: '6', name: 'Taj Diagnostic Center', category: 'Diagnostic Center', address: 'New Market, Dinajpur', phone: '01711000006', website: 'https://tajdiag.com', rating: 4.3, reviewCount: 67, latitude: 25.6290, longitude: 88.6320, placeId: 'pid6', mapsUrl: 'https://maps.google.com', searchKeyword: 'diagnostic center in Dinajpur', scrapedAt: new Date(Date.now() - 180 * 60000).toISOString() },
];

export const businessesApi = {
  /**
   * GET /api/businesses
   * Returns paginated list of businesses
   */
  async getAll({ page = 1, limit = 20, search = '', category = '', keyword = '', isTarget } = {}) {
    try {
      const params = new URLSearchParams({ page, limit });
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (keyword) params.set('keyword', keyword);
      if (isTarget !== undefined && isTarget !== null) params.set('isTarget', isTarget);
      const { data } = await API.get(`/businesses?${params}`);
      return data;
    } catch {
      // Fallback mock
      let items = MOCK_BUSINESSES;
      if (search) items = items.filter(b => b.name.toLowerCase().includes(search.toLowerCase()) || b.address.toLowerCase().includes(search.toLowerCase()));
      if (category) items = items.filter(b => b.category === category);
      if (isTarget !== undefined && isTarget !== null) {
        items = items.filter(b => Boolean(b.isTarget) === Boolean(isTarget));
      }
      const total = items.length;
      const start = (page - 1) * limit;
      return { success: true, data: items.slice(start, start + limit), total, page, pages: Math.ceil(total / limit) || 1, _mock: true };
    }
  },

  async getById(id) {
    try {
      const { data } = await API.get(`/businesses/${id}`);
      return data;
    } catch {
      const found = MOCK_BUSINESSES.find(b => b._id === id);
      return { success: true, data: found || null, _mock: true };
    }
  },

  async deleteById(id) {
    try {
      const { data } = await API.delete(`/businesses/${id}`);
      return data;
    } catch (err) {
      if (err.response?.status === 404) throw new Error('Business not found');
      return { success: true, _mock: true };
    }
  },

  async toggleTarget(id, isTarget) {
    try {
      const { data } = await API.patch(`/businesses/${id}/target`, { isTarget });
      return data;
    } catch (err) {
      if (err.response?.status === 404) throw new Error('Business not found');
      return { success: true, _mock: true };
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
      if (err.response) throw new Error(err.response.data?.message || 'Failed to delete selected leads');
      return { success: true, _mock: true };
    }
  },

  async getStats() {
    try {
      const { data } = await API.get('/businesses/stats');
      return data;
    } catch {
      return {
        success: true,
        data: {
          total: 1284,
          byCategory: [
            { _id: 'Restaurant', count: 423 },
            { _id: 'School', count: 302 },
            { _id: 'Hotel', count: 218 },
            { _id: 'Hospital', count: 187 },
            { _id: 'Pharmacy', count: 154 },
          ],
        },
        _mock: true,
      };
    }
  },
};

