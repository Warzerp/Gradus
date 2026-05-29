/**
 * tokenStorage.js
 *
 * Estrategia de almacenamiento segura:
 * - Access token: variable de módulo (memoria JS) → no accesible desde XSS
 * - Refresh token: localStorage → persiste entre recargas de página
 */

let _accessToken = null;

export const saveTokens = (accessToken, refreshToken) => {
  _accessToken = accessToken;
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
  }
};

export const getAccessToken = () => _accessToken;

export const getRefreshToken = () => localStorage.getItem('refresh_token');

export const clearTokens = () => {
  _accessToken = null;
  localStorage.removeItem('refresh_token');
};
