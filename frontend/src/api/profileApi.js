import api from './axiosConfig';

export const profileApi = {
  getProfile: async () => {
    const response = await api.get('/api/profile/');
    return response.data; // User detail with nested profile: { id, username, email, first_name, last_name, profile: { bio, location } }
  },
  updateProfile: async (data) => {
    const response = await api.put('/api/profile/', data);
    return response.data;
  },
  getBookmarks: async (page = 1) => {
    const response = await api.get('/api/signets/', { params: { page } });
    return response.data; // Paginated list of bookmarks (depth=1: includes nested article)
  },
  addBookmark: async (articleId) => {
    const response = await api.post('/api/signets/', { article: articleId });
    return response.data;
  },
  removeBookmark: async (bookmarkId) => {
    const response = await api.delete(`/api/signets/${bookmarkId}/`);
    return response.data;
  }
};
