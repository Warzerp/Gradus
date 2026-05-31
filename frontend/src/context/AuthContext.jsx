/**
 * AuthContext.jsx
 *
 * Proveedor global de autenticación.
 * Estado: user, isAuthenticated, isLoading
 * Métodos: login, logout, checkAuth
 *
 * No hace llamadas HTTP directamente; delega a authService.
 * Al montar, intenta restaurar la sesión usando el refresh token guardado.
 *
 * NOTA ESLint:
 *  - AuthContext se exporta desde authContext.js (solo context, sin componentes)
 *    para cumplir react-refresh/only-export-components.
 *  - El effect de restauración de sesión NO llama a checkAuth() directamente
 *    (evita react-hooks/set-state-in-effect); la lógica está inlined en el effect.
 */

import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './authContext';
import * as authService from '../services/authService';
import { saveTokens, getRefreshToken, clearTokens } from '../utils/tokenStorage';

export { AuthContext };

export function AuthProvider({ children }) {
  const [user, setUser]                       = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // isLoading arranca en true SOLO si hay un refresh_token guardado que verificar.
  // De lo contrario ya sabemos que no hay sesión → false desde el inicio.
  const [isLoading, setIsLoading]             = useState(
    () => Boolean(getRefreshToken())
  );

  // ─── Restaurar sesión al montar ──────────────────────────────────────────
  // La lógica está inlined dentro del effect con Promises para cumplir con
  // react-hooks/set-state-in-effect: los setState ocurren en .then/.catch,
  // NO de forma síncrona en el cuerpo del effect.
  useEffect(() => {
    const storedRefresh = getRefreshToken();
    if (!storedRefresh) {
      // isLoading ya es false desde useState, no hace falta setState aquí.
      return;
    }

    let cancelled = false;

    authService
      .refreshToken(storedRefresh)
      .then((data) => {
        if (cancelled) return;
        saveTokens(data.access_token, data.refresh_token);
        const decoded = parseJwt(data.access_token);
        setUser({ email: decoded.sub, rol: decoded.roles?.[0] });
        setIsAuthenticated(true);
      })
      .catch(() => {
        if (cancelled) return;
        clearTokens();
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);


  // ─── checkAuth: expuesto en el contexto para refrescar sesión manualmente ─
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
