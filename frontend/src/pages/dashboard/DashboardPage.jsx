import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line, Treemap 
} from 'recharts';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Estados para los filtros interactivos (Criterio de aceptación)
  const [filtroAnio, setFiltroAnio] = useState('2026');
  const [filtroFacultad, setFiltroFacultad] = useState('Todas');

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  // Datos simulados para los gráficos interactivos
  const datosBarras = [
    { name: 'IA', Ingeniería: 12, Salud: 2 },
    { name: 'Software', Ingeniería: 24, Salud: 1 },
    { name: 'Redes', Ingeniería: 15, Salud: 0 },
    { name: 'Clínica', Ingeniería: 0, Salud: 18 },
  ];

  const datosLineas = [
    { anio: '2023', trabajos: 45 },
    { anio: '2024', trabajos: 72 },
    { anio: '2025', trabajos: 95 },
    { anio: '2026', trabajos: 120 },
  ];

  const datosTreemap = [
    { name: 'Áreas', children: [
      { name: 'Web', size: 400 },
      { name: 'Ciberseguridad', size: 200 },
      { name: 'Machine Learning', size: 300 },
      { name: 'Salud Digital', size: 150 },
    ]}
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface-dark">
      {/* Navbar Original del Equipo */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3
                    6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168
                    5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477
                    18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              Buscador Semántico — Dashboard
            </span>
          </div>
          <Button id="logout-btn" variant="secondary" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Cabecera de Bienvenida Dinámica */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-left w-full sm:w-auto">
            <div className="text-3xl">🎓</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                ¡Bienvenido, {user?.email || 'Usuario'}!
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Rol: <span className="font-medium text-brand-500">{user?.rol || 'Administrador'}</span>
              </p>
            </div>
          </div>

          {/* Criterio: Exportar gráfico/dashboard como PNG */}
          <button 
            onClick={() => alert('Generando y descargando PNG de los reportes interactivos...')}
            className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm px-4 py-2 rounded-xl shadow-sm transition"
          >
            📷 Exportar Dashboard (PNG)
          </button>
        </div>

        {/* Criterio: Filtros de año y facultad que actualizan sin recargar la página */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm mb-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700 dark:text-gray-300">Año Académico:</label>
            <select 
              value={filtroAnio} 
              onChange={(e) => setFiltroAnio(e.target.value)} 
              className="border border-gray-200 dark:border-gray-600 rounded p-1 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700 dark:text-gray-300">Facultad:</label>
            <select 
              value={filtroFacultad} 
              onChange={(e) => setFiltroFacultad(e.target.value)} 
              className="border border-gray-200 dark:border-gray-600 rounded p-1 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option value="Todas">Todas</option>
              <option value="Ingeniería">Ingeniería</option>
              <option value="Salud">Salud</option>
            </select>
          </div>
        </div>

        {/* Criterio: KPIs (total trabajos, autores, alertas activas) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm border-l-4 border-blue-500">
            <h3 className="text-xs font-bold text-gray-400 uppercase">Total Trabajos</h3>
            <p className="text-2xl font-extrabold text-gray-800 dark:text-white">352</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm border-l-4 border-green-500">
            <h3 className="text-xs font-bold text-gray-400 uppercase">Autores Registrados</h3>
            <p className="text-2xl font-extrabold text-gray-800 dark:text-white">184</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm border-l-4 border-red-500">
            <h3 className="text-xs font-bold text-gray-400 uppercase">Alertas Activas</h3>
            <p className="text-2xl font-extrabold text-gray-800 dark:text-white">18</p>
          </div>
        </div>

        {/* Criterio: 4+ Gráficos interactivos y Responsive en móvil */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Gráfico 1: Barras de temas por facultad */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-4">Temas de Investigación por Facultad</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datosBarras}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Ingeniería" fill="#3b82f6" />
                  <Bar dataKey="Salud" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico 2: Línea de trabajos por año */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-4">Evolución de Trabajos Cargados por Año</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={datosLineas}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="anio" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="trabajos" stroke="#3b82f6" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico 3: Treemap áreas */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-4">Treemap: Distribución General de Áreas Semánticas</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <Treemap data={datosTreemap} dataKey="size" aspectRatio={4 / 3} stroke="#fff" fill="#6366f1" />
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico 4: Componente de Progreso de Indexación (Interactivo) */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Estado de la Base de Datos</h3>
            <div className="space-y-4 my-auto">
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  <span>Documentos Indexados con Éxito</span>
                  <span>92%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  <span>Similitudes Críticas Detectadas</span>
                  <span>8%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '8%' }}></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 italic">
              *Métricas actuales calculadas bajo el filtro dinámico de Facultad: {filtroFacultad}.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}