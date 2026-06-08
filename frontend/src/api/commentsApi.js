import api from './axiosConfig';

export const commentsApi = {
  getByArticleId: async (articleId, page = 1) => {
    const response = await api.get('/api/commentaires/', {
      params: { article: articleId, page }
    });
    return response.data; // Paginated response: { count, next, previous, results }
  },
  create: async (data) => {
    const response = await api.post('/api/commentaires/', data);
    return response.data; // { id, article, auteur, texte, likes_count, user_has_liked, ... }
  },
  delete: async (id) => {
    const response = await api.delete(`/api/commentaires/${id}/`);
    return response.data;
  },
  toggleLike: async (id) => {
    const response = await api.post(`/api/commentaires/${id}/like/`);
    return response.data; // { liked: boolean, likes_count: number }
  }
};
