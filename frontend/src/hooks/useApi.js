/**
 * useApi.js — Hook genérico para peticiones HTTP con manejo de loading/error.
 *
 * Uso:
 *   const { data, loading, error, execute } = useApi(miServicio);
 *   await execute(param1, param2);
 */

import { useState, useCallback } from 'react';

export function useApi(apiFn) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFn(...args);
      setData(result);
      return result;
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || 'Error inesperado';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  return { data, loading, error, execute };
}
