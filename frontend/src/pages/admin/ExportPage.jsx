import { useState } from 'react';
import { exportService } from '../../services/exportService';
import { Button } from '../../components/ui/Button';

export function ExportPage() {
  const [estado, setEstado] = useState({ csv: 'idle', json: 'idle' });
  const [error, setError]   = useState('');

  const exportar = async (formato) => {
    setEstado(e => ({ ...e, [formato]: 'cargando' }));
    setError('');
    try {
      if (formato === 'csv') await exportService.exportarCsv();
      else await exportService.exportarJson();
      setEstado(e => ({ ...e, [formato]: 'ok' }));
      setTimeout(() => setEstado(e => ({ ...e, [formato]: 'idle' })), 3000);
    } catch {
      setError(`Error al exportar ${formato.toUpperCase()}`);
      setEstado(e => ({ ...e, [formato]: 'idle' }));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Exportación de Reportes
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ExportCard
          titulo="Exportar CSV"
          descripcion="Descarga todos los trabajos publicados en formato CSV. Compatible con Excel y Google Sheets."
          icono="📊"
          estado={estado.csv}
          onExportar={() => exportar('csv')}
        />
        <ExportCard
          titulo="Exportar JSON"
          descripcion="Descarga todos los trabajos publicados en formato JSON. Ideal para integraciones y análisis de datos."
          icono="🗃️"
          estado={estado.json}
          onExportar={() => exportar('json')}
        />
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700
                      rounded-xl p-4 text-sm text-amber-800 dark:text-amber-300">
        <strong>Nota:</strong> Solo se exportan trabajos con estado PUBLICADO.
        Cada descarga queda registrada en el log de auditoría.
      </div>
    </div>
  );
}

function ExportCard({ titulo, descripcion, icono, estado, onExportar }) {
  const cargando = estado === 'cargando';
  const ok       = estado === 'ok';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
                    shadow-sm p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{icono}</span>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{titulo}</h3>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 flex-1">{descripcion}</p>
      <Button variant="primary" onClick={onExportar} disabled={cargando}>
        {cargando ? 'Descargando…' : ok ? '✓ Descargado' : 'Descargar'}
      </Button>
    </div>
  );
}
