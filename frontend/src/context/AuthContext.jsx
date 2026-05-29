/**
 * AuthContext.jsx
 *
 * Contexto global de autenticación.
 * Estado: user, isAuthenticated, isLoading
 * Métodos: login, logout, checkAuth
 *
 * No hace llamadas HTTP directamente; delega a authService.
 * Al montar, intenta restaurar la sesión usando el refresh token guardado.
 */

import { createContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';
import { saveTokens, getRefreshToken, clearTokens } from '../utils/tokenStorage';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]                     = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading]           = useState(true);

  // ─── Restaurar sesión al montar ──────────────────────────────────────────
  const checkAuth = useCallback(async () => {
    const storedRefresh = getRefreshToken();
    if (!storedRefresh) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await authService.refreshToken(storedRefresh);
      saveTokens(data.access_token, data.refresh_token);
      const decoded = parseJwt(data.access_token);
      setUser({ email: decoded.sub, rol: decoded.roles?.[0] });
      setIsAuthenticated(true);
    } catch {
      clearTokens();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ─── Login ───────────────────────────────────────────────────────────────
  const login = async (credentials) => {
    const data = await authService.login(credentials);
    saveTokens(data.access_token, data.refresh_token);
    const decoded = parseJwt(data.access_token);
    setUser({ email: decoded.sub, rol: decoded.roles?.[0] });
    setIsAuthenticated(true);
    return decoded; // devuelve claims para redirección por rol
  };

  // ─── Logout ──────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Helper: decodifica payload del JWT sin verificar firma ──────────────────
function parseJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}
