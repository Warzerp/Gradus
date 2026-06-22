import { useEffect, useState, useCallback } from 'react';
import { auditoriaService } from '../../services/auditoriaService';
import { Button } from '../../components/ui/Button';

const ACCIONES = ['', 'SEARCH', 'UPLOAD', 'UPDATE', 'DOWNLOAD', 'LOGIN', 'LOGOUT', 'DELETE'];

const accionBadge = {
  LOGIN:    'bg-green-100 text-green-700',
  LOGOUT:   'bg-gray-100 text-gray-600',
  SEARCH:   'bg-blue-100 text-blue-700',
  UPLOAD:   'bg-purple-100 text-purple-700',
  UPDATE:   'bg-yellow-100 text-yellow-700',
  DOWNLOAD: 'bg-indigo-100 text-indigo-700',
  DELETE:   'bg-red-100 text-red-700',
};

export function AuditoriaPage() {
  const [pagina, setPagina]         = useState({ content: [], totalElements: 0, totalPages: 0 });
  const [pageNum, setPageNum]       = useState(0);
  const [accionFiltro, setAccionFiltro] = useState('');
  const [cargando, setCargando]     = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const data = accionFiltro
        ? await auditoriaService.listarPorAccion(accionFiltro, pageNum, 30)
        : await auditoriaService.listar(pageNum, 30);
      setPagina(data);
    } catch {
      // mantener estado anterior
    } finally {
      setCargando(false);
    }
  }, [pageNum, accionFiltro]);

  useEffect(() => { cargar(); }, [cargar]);

  const cambiarFiltro = (accion) => {
    setAccionFiltro(accion);
    setPageNum(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Registro de Auditoría
        </h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">Filtrar acción:</label>
          <select
            value={accionFiltro}
            onChange={e => cambiarFiltro(e.target.value)}
            className="text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800
                       text-gray-700 dark:text-gray-300 px-3 py-1.5"
          >
            {ACCIONES.map(a => (
              <option key={a} value={a}>{a || 'Todas'}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        {pagina.totalElements} registros encontrados
      </div>

      {cargando ? (
        <div className="text-center py-12 text-gray-400">Cargando…</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {['ID', 'Acción', 'Usuario ID', 'Rol', 'IP Origen', 'Detalle', 'Fecha'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide text-xs">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
              {pagina.content.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    No hay registros
                  </td>
                </tr>
              ) : (
                pagina.content.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-4 py-3 text-gray-400 text-xs">#{a.id}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${accionBadge[a.accion] || 'bg-gray-100 text-gray-600'}`}>
                        {a.accion}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{a.usuarioId ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{a.rol ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{a.ipOrigen ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate text-xs">
                      {a.detalle ? JSON.stringify(a.detalle) : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(a.registradoEn).toLocaleString()}
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
