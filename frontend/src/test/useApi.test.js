/**
 * useApi.test.js
 *
 * Tests unitarios para el hook useApi.
 * Verifica:
 *  1. Estado inicial (data=null, loading=false, error=null).
 *  2. loading=true durante la ejecución, false al terminar.
 *  3. Guarda el resultado en `data` cuando la función tiene éxito.
 *  4. Guarda el mensaje de error en `error` cuando la función falla.
 *  5. Re-lanza el error para que el consumidor pueda capturarlo.
 *  6. Limpia el error previo al re-ejecutar.
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useApi } from '../hooks/useApi';

describe('useApi', () => {
  it('1. tiene estado inicial correcto', () => {
    const { result } = renderHook(() => useApi(vi.fn()));

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.execute).toBe('function');
  });

  it('2. establece loading=true durante la ejecución', async () => {
    // Promesa que no resuelve inmediatamente
    let resolve;
    const apiFn = vi.fn(() => new Promise((r) => { resolve = r; }));
    const { result } = renderHook(() => useApi(apiFn));

    // Lanzar execute sin await para capturar loading en medio
    let executePromise;
    act(() => {
      executePromise = result.current.execute();
    });

    expect(result.current.loading).toBe(true);

    // Resolver la promesa
    await act(async () => {
      resolve({ ok: true });
      await executePromise;
    });

    expect(result.current.loading).toBe(false);
  });

  it('3. guarda el resultado en data cuando tiene éxito', async () => {
    const responseData = { id: 1, nombre: 'Juan' };
    const apiFn = vi.fn().mockResolvedValue(responseData);
    const { result } = renderHook(() => useApi(apiFn));

    await act(async () => {
      await result.current.execute('arg1');
    });

    expect(apiFn).toHaveBeenCalledWith('arg1');
    expect(result.current.data).toEqual(responseData);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('4. guarda el mensaje en error cuando la función falla (response.data.message)', async () => {
    const apiFn = vi.fn().mockRejectedValue({
      response: { data: { message: 'Credenciales inválidas' } },
    });
    const { result } = renderHook(() => useApi(apiFn));

    await act(async () => {
      try {
        await result.current.execute();
      } catch {
        // se espera que relance
      }
    });

    expect(result.current.error).toBe('Credenciales inválidas');
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('4b. usa err.message cuando no hay response.data.message', async () => {
    const apiFn = vi.fn().mockRejectedValue(new Error('Network Error'));
    const { result } = renderHook(() => useApi(apiFn));

    await act(async () => {
      try {
        await result.current.execute();
      } catch {
        // esperado
      }
    });

    expect(result.current.error).toBe('Network Error');
  });

  it('4c. usa fallback "Error inesperado" cuando no hay mensaje', async () => {
    const apiFn = vi.fn().mockRejectedValue({});
    const { result } = renderHook(() => useApi(apiFn));

    await act(async () => {
      try {
        await result.current.execute();
      } catch {
        // esperado
      }
    });

    expect(result.current.error).toBe('Error inesperado');
  });

  it('5. re-lanza el error para que el consumidor pueda capturarlo', async () => {
    const originalError = new Error('fallo de red');
    const apiFn = vi.fn().mockRejectedValue(originalError);
    const { result } = renderHook(() => useApi(apiFn));

    await act(async () => {
      await expect(result.current.execute()).rejects.toThrow('fallo de red');
    });
  });

  it('6. limpia el error previo al re-ejecutar', async () => {
    const apiFn = vi.fn()
      .mockRejectedValueOnce(new Error('primer error'))
      .mockResolvedValueOnce({ ok: true });

    const { result } = renderHook(() => useApi(apiFn));

    // Primera ejecución — falla
    await act(async () => {
      try { await result.current.execute(); } catch { /* esperado */ }
    });
    expect(result.current.error).toBe('primer error');

    // Segunda ejecución — éxito, error debe limpiarse
    await act(async () => {
      await result.current.execute();
    });
    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual({ ok: true });
  });
});
