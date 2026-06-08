import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { profileApi } from '../api/profileApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Charger les infos de l'utilisateur au chargement si un token est présent
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const profile = await profileApi.getProfile();
          setUser(profile);
        } catch (error) {
          console.error("Échec de chargement du profil", error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();

    // Écouter l'événement personnalisé pour se déconnecter automatiquement en cas d'erreur 401
    const handleAutoLogout = () => {
      logout();
    };

    window.addEventListener('auth-logout', handleAutoLogout);
    return () => {
      window.removeEventListener('auth-logout', handleAutoLogout);
    };
  }, [token]);

  const login = async (username, password) => {
    try {
      setLoading(true);
      const data = await authApi.login(username, password);
      // data contient { token }
      localStorage.setItem('token', data.token);
      setToken(data.token);
      
      // Récupérer les infos de l'utilisateur connecté
      const profile = await profileApi.getProfile();
      setUser(profile);
      return profile;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (registrationData) => {
    try {
      setLoading(true);
      const data = await authApi.register(registrationData);
      // data contient { token, user }
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateUserInfo = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé au sein de AuthProvider');
  }
  return context;
};
