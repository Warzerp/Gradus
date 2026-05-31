/**
 * useAuth.test.js
 *
 * Tests unitarios para el hook useAuth.
 * Verifica:
 *  1. Lanza error cuando se usa fuera de AuthProvider.
 *  2. Devuelve el contexto cuando está dentro de AuthProvider.
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuth } from '../hooks/useAuth';
import { AuthContext } from '../context/authContext';

// ─── Test 1: fuera del provider ──────────────────────────────────────────────
describe('useAuth — fuera de AuthProvider', () => {
  it('lanza un error descriptivo si se usa sin AuthProvider', () => {
    // Silenciar el error de React en consola durante el test
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth debe usarse dentro de <AuthProvider>');

    consoleError.mockRestore();
  });
});

// ─── Test 2: dentro del provider ─────────────────────────────────────────────
describe('useAuth — dentro de AuthProvider', () => {
  const mockValue = {
    user: { email: 'test@uni.edu.co', rol: 'ROLE_USER' },
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    checkAuth: vi.fn(),
  };

  const wrapper = ({ children }) => (
    <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>
  );

  it('devuelve el valor del contexto correctamente', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.user.email).toBe('test@uni.edu.co');
    expect(result.current.user.rol).toBe('ROLE_USER');
  });

  it('expone las funciones login, logout y checkAuth', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
    expect(typeof result.current.checkAuth).toBe('function');
  });
});
