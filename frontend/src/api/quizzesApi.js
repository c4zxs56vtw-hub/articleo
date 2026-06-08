import api from './axiosConfig';

export const quizzesApi = {
  getAll: async (categorieId = '') => {
    const url = categorieId ? `/api/quizzes/?categorie=${categorieId}` : '/api/quizzes/';
    const response = await api.get(url);
    return response.data; // Paginated: { count, next, previous, results }
  },
  getById: async (id) => {
    const response = await api.get(`/api/quizzes/${id}/`);
    return response.data; // Nested questions: { id, titre, description, questions }
  }
};

export default quizzesApi;
