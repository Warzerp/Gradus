import { useEffect, useState, useCallback } from 'react';
import { similitudService } from '../../services/similitudService';
import { Button } from '../../components/ui/Button';

export function SimilitudesPage() {
  const [pagina, setPagina]         = useState({ content: [], totalElements: 0, totalPages: 0 });
  const [pageNum, setPageNum]       = useState(0);
  const [cargando, setCargando]     = useState(false);
  const [detectando, setDetectando] = useState(false);
  const [mensaje, setMensaje]       = useState('');

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const data = await similitudService.listarPendientes(pageNum, 20);
      setPagina(data);
    } catch {
      setMensaje('Error al cargar similitudes');
    } finally {
      setCargando(false);
    }
  }, [pageNum]);

  useEffect(() => { cargar(); }, [cargar]);

  const detectar = async () => {
    setDetectando(true);
    try {
      const res = await similitudService.detectar();
      setMensaje(`Detección completada: ${res.nuevosDetectados} nuevos pares detectados`);
      cargar();
    } catch {
      setMensaje('Error al ejecutar detección');
    } finally {
      setDetectando(false);
    }
  };

  const revisar = async (id, requiereAccion) => {
    try {
      await similitudService.marcarRevisado(id, requiereAccion);
      setMensaje(`Similitud #${id} marcada como revisada`);
      cargar();
    } catch {
      setMensaje('Error al marcar como revisada');
    }
  };

  const scoreColor = (score) => {
    const n = parseFloat(score);
    if (n >= 0.95) return 'text-red-600 font-bold';
    if (n >= 0.85) return 'text-yellow-600 font-semibold';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Alertas de Similitud
        </h2>
        <Button onClick={detectar} disabled={detectando} variant="primary">
          {detectando ? 'Detectando…' : 'Ejecutar Detección'}
        </Button>
      </div>

      {mensaje && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg px-4 py-3 text-sm">
          {mensaje}
        </div>
      )}

      <div className="text-sm text-gray-500 dark:text-gray-400">
        {pagina.totalElements} alertas pendientes de revisión
      </div>

      {cargando ? (
        <div className="text-center py-12 text-gray-400">Cargando…</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {['ID', 'Trabajo A', 'Trabajo B', 'Score', 'Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide text-xs">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
              {pagina.content.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    No hay alertas pendientes
                  </td>
                </tr>
              ) : (
                pagina.content.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-4 py-3 text-gray-500">#{s.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      Trabajo #{s.trabajoAId}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      Trabajo #{s.trabajoBId}
                    </td>
                    <td className={`px-4 py-3 ${scoreColor(s.score)}`}>
                      {(parseFloat(s.score) * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => revisar(s.id, false)}
                        className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                      >
                        Sin acción
                      </button>
                      <button
                        onClick={() => revisar(s.id, true)}
                        className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                      >
                        Requiere acción
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {pagina.totalPages > 1 && (
        <div className="flex items-center gap-2 justify-center">
          <Button variant="secondary" disabled={pageNum === 0} onClick={() => setPageNum(p => p - 1)}>
            ← Anterior
          </Button>
          <span className="text-sm text-gray-500">
            Página {pageNum + 1} de {pagina.totalPages}
          </span>
          <Button variant="secondary" disabled={pageNum + 1 >= pagina.totalPages} onClick={() => setPageNum(p => p + 1)}>
            Siguiente →
          </Button>
        </div>
      )}
    </div>
  );
}
