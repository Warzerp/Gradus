/**
 * authService.js
 * Funciones puras de llamadas HTTP al módulo de autenticación.
 * Usa axiosInstance (con interceptores); nunca importa Axios directamente.
 */

import axiosInstance from '../utils/axiosInstance';

export const login = async ({ email, password }) => {
  const { data } = await axiosInstance.post('/auth/login', { email, password });
  return data; // { access_token, refresh_token, tipo, expira_en }
};

export const register = async (userData) => {
  const { data } = await axiosInstance.post('/auth/register', userData);
  return data;
};

export const refreshToken = async (refreshToken) => {
  const { data } = await axiosInstance.post('/auth/refresh', {
    refresh_token: refreshToken,
  });
  return data;
};

export const logout = async () => {
  await axiosInstance.post('/auth/logout');
};
