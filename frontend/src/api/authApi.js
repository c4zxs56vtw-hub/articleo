import api from './axiosConfig';

export const authApi = {
  login: async (username, password) => {
    const response = await api.post('/api/login/', { username, password });
    return response.data; // Retourne { token: "..." }
  },
  register: async (registrationData) => {
    const response = await api.post('/api/register/', registrationData);
    return response.data; // Retourne { token: "...", user: {...} }
  }
};
