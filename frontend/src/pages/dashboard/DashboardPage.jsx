/**
 * DashboardPage.jsx — Página de dashboard post-login.
 * Placeholder para Sprint 2; muestra info del usuario y botón de cierre de sesión.
 */

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface-dark">
      {/* Navbar */}
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
              Buscador Semántico
            </span>
          </div>
          <Button id="logout-btn" variant="secondary" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </div>
      </nav>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100
                        dark:border-gray-700 shadow-sm p-8 text-center">
          <div className="text-4xl mb-4">🎓</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            ¡Bienvenido, {user?.email}!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-1">
            Rol: <span className="font-medium text-brand-500">{user?.rol}</span>
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-4">
            El buscador semántico estará disponible en el Sprint 3.
          </p>
        </div>
      </main>
    </div>
  );
}
