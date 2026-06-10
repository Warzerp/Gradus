/**
 * AppRouter.jsx — Definición central de todas las rutas de la aplicación.
 * Usa React Router v6 con <Routes> y <Route>.
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { LoginPage }    from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import GestionAutores   from '../pages/AutoresPage';
import BuscadorPage     from '../pages/BuscadorPage';
import { useAuth }      from '../hooks/useAuth';

function RootRedirect() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const adminRoles = ['ROLE_ADMIN', 'ROLE_BIBLIOTECARIO'];
  return adminRoles.includes(user?.rol)
    ? <Navigate to="/dashboard" replace />
    : <Navigate to="/buscar" replace />;
}

export function AppRouter() {
  return (
    <Routes>
      {/* Raíz — redirige según estado de sesión y rol */}
      <Route path="/" element={<RootRedirect />} />

      {/* Rutas públicas */}
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rutas privadas */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/buscar"    element={<BuscadorPage />} />
        <Route path="/autores"   element={<GestionAutores />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
