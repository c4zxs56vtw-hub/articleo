import api from './axiosConfig';

export const articlesApi = {
  getAll: async (params) => {
    const response = await api.get('/api/articles/', { params });
    return response.data; // DRF paginated response: { count, next, previous, results }
  },
  getById: async (id) => {
    const response = await api.get(`/api/articles/${id}/`);
    return response.data; // Single Article detail (ArticleReadSerializer)
  },
  create: async (data) => {
    const response = await api.post('/api/articles/', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/api/articles/${id}/`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/articles/${id}/`);
    return response.data;
  },
  toggleLike: async (id) => {
    const response = await api.post(`/api/articles/${id}/like/`);
    return response.data; // { liked: boolean, likes_count: number }
  },
  getSimilaires: async (id) => {
    const response = await api.get(`/api/articles/${id}/similaires/`);
    return response.data; // Paginated or list of similar articles
  }
};
