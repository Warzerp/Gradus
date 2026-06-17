import React, { useState } from 'react';

export default function AlertasPage() {
  const [alertas, setAlertas] = useState([
    { id: 1, titulo: "Implementación de IA en Agro", autor: "Carlos Mendoza", score: 94, estado: "Pendiente", duplicadoCon: "Algoritmos de IA en el Campo (2025)" },
    { id: 2, titulo: "Diseño de red de datos Unipamplona", autor: "Ana Martinez", score: 45, estado: "Revisado", duplicadoCon: "Ninguno - Coincidencia baja" },
    { id: 3, titulo: "Estudio macroeconómico regional", autor: "Diana Prada", score: 88, estado: "Pendiente", duplicadoCon: "Análisis económico de la región (2024)" },
  ]);

  const [filtroEstado, setFiltroEstado] = useState('Todos');

  // Criterio: Cambiar estado (Simula persistencia modificando el estado de React)
  const cambiarEstado = (id, nuevoEstado) => {
    setAlertas(alertas.map(alerta => 
      alerta.id === id ? { ...alerta, estado: nuevoEstado } : alerta
    ));
  };

  const alertasFiltradas = alertas.filter(alerta => 
    filtroEstado === 'Todos' ? true : alerta.estado === filtroEstado
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Panel de Control: Bibliotecario</h1>
      <p className="text-sm text-gray-500 mb-6">Revisión de trabajos de grado nuevos y control de plagio/similitud semántica.</p>

      {/* Criterio: Filtro por estado pendiente/revisado */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Filtrar Estado:</span>
        <select 
          value={filtroEstado} 
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="border rounded p-1.5 bg-white text-sm"
        >
          <option value="Todos">Todos</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Revisado">Revisado</option>
        </select>
      </div>

      {/* Criterio: Tabla de alertas con badge de score */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trabajo Recibido</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Autor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score Similitud</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alerta Duplicado</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {alertasFiltradas.map((alerta) => (
              <tr key={alerta.id} className={alerta.estado === 'Pendiente' ? 'bg-orange-50/50' : ''}>
                <td className="px-6 py-4 font-medium text-gray-900">{alerta.titulo}</td>
                <td className="px-6 py-4 text-gray-600">{alerta.autor}</td>
                <td className="px-6 py-4">
                  {/* Badge de Score */}
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    alerta.score >= 80 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {alerta.score}%
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 italic">{alerta.duplicadoCon}</td>
                <td className="px-6 py-4 text-center space-x-2">
                  {alerta.estado === 'Pendiente' ? (
                    <>
                      <button 
                        onClick={() => cambiarEstado(alerta.id, 'Revisado')}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                      >
                        Aprobar (Revisado)
                      </button>
                      <button 
                        onClick={() => alert('Notificación enviada al autor para corrección')}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                      >
                        Requiere Acción
                      </button>
                    </>
                  ) : (
                    <span className="text-green-600 font-medium text-xs bg-green-50 px-2 py-1 rounded border border-green-200">
                      ✓ Completado
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}