/**
 * tokenStorage.test.js
 *
 * Tests unitarios para el módulo tokenStorage.
 * Verifica el ciclo completo save → get → clear de tokens.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
} from '../utils/tokenStorage';

describe('tokenStorage', () => {
  beforeEach(() => {
    // Limpiar estado entre tests
    clearTokens();
    localStorage.clear();
  });

  it('1. getAccessToken y getRefreshToken devuelven null si no hay tokens', () => {
    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });

  it('2. saveTokens guarda access token en memoria y refresh en localStorage', () => {
    saveTokens('access-abc', 'refresh-xyz');

    expect(getAccessToken()).toBe('access-abc');
    expect(getRefreshToken()).toBe('refresh-xyz');
    expect(localStorage.getItem('refresh_token')).toBe('refresh-xyz');
  });

  it('3. saveTokens sin refresh_token no rompe localStorage', () => {
    saveTokens('access-abc', null);

    expect(getAccessToken()).toBe('access-abc');
    expect(getRefreshToken()).toBeNull();
  });

  it('4. clearTokens elimina ambos tokens', () => {
    saveTokens('access-abc', 'refresh-xyz');
    clearTokens();

    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
    expect(localStorage.getItem('refresh_token')).toBeNull();
  });

  it('5. saveTokens sobreescribe tokens anteriores', () => {
    saveTokens('access-v1', 'refresh-v1');
    saveTokens('access-v2', 'refresh-v2');

    expect(getAccessToken()).toBe('access-v2');
    expect(getRefreshToken()).toBe('refresh-v2');
  });
});
