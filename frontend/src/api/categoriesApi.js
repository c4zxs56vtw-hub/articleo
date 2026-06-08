import api from './axiosConfig';

export const categoriesApi = {
  getAll: async () => {
    const response = await api.get('/api/categories/');
    return response.data; // List or paginated list of categories. If paginated: { count, results }
  },
  create: async (data) => {
    const response = await api.post('/api/categories/', data);
    return response.data;
  }
};
