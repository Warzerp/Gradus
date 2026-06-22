import { useEffect, useState } from 'react';
import { useNavigate, Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { estadisticasService } from '../../services/estadisticasService';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, CartesianGrid,
} from 'recharts';

const COLORES_PIE = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

const adminNav = [
  { to: '/dashboard',              label: 'Resumen',    end: true },
  { to: '/dashboard/similitudes',  label: 'Similitudes' },
  { to: '/dashboard/auditoria',    label: 'Auditoría'  },
  { to: '/dashboard/exportar',     label: 'Exportar'   },
];

export function DashboardPage() {
  const { user, logout }              = useAuth();
  const navigate                      = useNavigate();
  const [resumen, setResumen]         = useState(null);
  const [tendencia, setTendencia]     = useState([]);
  const [facultades, setFacultades]   = useState([]);
  const [distribucion, setDistribucion] = useState([]);
  const [cargando, setCargando]       = useState(true);

  const isAdmin = ['ROLE_ADMIN', 'ROLE_BIBLIOTECARIO'].includes(user?.rol);

  useEffect(() => {
    if (!isAdmin) return;
    Promise.all([
      estadisticasService.resumen(),
      estadisticasService.tendenciaAnual(),
      estadisticasService.porFacultad(),
      estadisticasService.distribucionEstado(),
    ]).then(([r, t, f, d]) => {
      setResumen(r);
      setTendencia(t.map(item => ({ anio: String(item.anio), total: Number(item.total) })));
      setFacultades(f.map(item => ({ name: item.facultad, value: Number(item.total_trabajos) })));
      setDistribucion(d.map(item => ({ name: item.estado, value: Number(item.total) })));
    }).catch(() => {}).finally(() => setCargando(false));
  }, [isAdmin]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">G</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">Gradus</span>
            {isAdmin && (
              <div className="hidden md:flex items-center gap-1 ml-4">
                {adminNav.map(({ to, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                          : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</span>
            <Button variant="secondary" onClick={handleLogout}>Salir</Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet context={{ resumen, tendencia, facultades, distribucion, cargando }} />
      </main>
    </div>
  );
}

export function DashboardHome() {
  const { user } = useAuth();
  const [resumen, setResumen]         = useState(null);
  const [tendencia, setTendencia]     = useState([]);
  const [facultades, setFacultades]   = useState([]);
  const [distribucion, setDistribucion] = useState([]);
  const [cargando, setCargando]       = useState(true);

  const isAdmin = ['ROLE_ADMIN', 'ROLE_BIBLIOTECARIO'].includes(user?.rol);

  useEffect(() => {
    if (!isAdmin) { setCargando(false); return; }
    Promise.all([
      estadisticasService.resumen(),
      estadisticasService.tendenciaAnual(),
      estadisticasService.porFacultad(),
      estadisticasService.distribucionEstado(),
    ]).then(([r, t, f, d]) => {
      setResumen(r);
      setTendencia(t.map(item => ({ anio: String(item.anio), total: Number(item.total) })));
      setFacultades(f.map(item => ({ name: item.facultad, value: Number(item.total_trabajos) })));
      setDistribucion(d.map(item => ({ name: item.estado, value: Number(item.total) })));
    }).catch(() => {}).finally(() => setCargando(false));
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-8 text-center">
        <div className="text-4xl mb-4">🎓</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Bienvenido, {user?.nombre || user?.email}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Usa el buscador para encontrar trabajos de grado.
        </p>
      </div>
    );
  }

  if (cargando) return <div className="text-center py-20 text-gray-400">Cargando estadísticas…</div>;

  const kpis = [
    { label: 'Total Trabajos',   value: resumen?.total_trabajos ?? 0,                  color: 'indigo' },
    { label: 'Publicados',       value: resumen?.publicados ?? 0,                       color: 'green'  },
    { label: 'Con Embedding',    value: resumen?.con_embedding ?? 0,                    color: 'purple' },
    { label: 'Alertas Pendientes', value: resumen?.alertas_duplicados_pendientes ?? 0,  color: 'red'    },
  ];

  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
    green:  'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    red:    'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <div className="space-y-8">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map(({ label, value, color }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${colorMap[color].split(' ').slice(1).join(' ')}`}>
              {Number(value).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendencia anual */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Publicaciones por Año
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={tendencia} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="anio" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución por estado */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Distribución por Estado
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={distribucion} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {distribucion.map((_, i) => (
                  <Cell key={i} fill={COLORES_PIE[i % COLORES_PIE.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Por facultad */}
        {facultades.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 lg:col-span-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
              Trabajos por Facultad
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={facultades} margin={{ top: 5, right: 10, bottom: 40, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
