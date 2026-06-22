import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute }       from './PrivateRoute';
import { LoginPage }          from '../pages/auth/LoginPage';
import { RegisterPage }       from '../pages/auth/RegisterPage';
import { DashboardPage, DashboardHome } from '../pages/dashboard/DashboardPage';
import { SimilitudesPage }    from '../pages/admin/SimilitudesPage';
import { AuditoriaPage }      from '../pages/admin/AuditoriaPage';
import { ExportPage }         from '../pages/admin/ExportPage';
import GestionAutores         from '../pages/AutoresPage';
import BuscadorPage           from '../pages/BuscadorPage';
import { useAuth }            from '../hooks/useAuth';

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
      <Route path="/" element={<RootRedirect />} />

      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<PrivateRoute />}>
        {/* Dashboard con layout anidado */}
        <Route path="/dashboard" element={<DashboardPage />}>
          <Route index element={<DashboardHome />} />
          <Route path="similitudes" element={<SimilitudesPage />} />
          <Route path="auditoria"   element={<AuditoriaPage />} />
          <Route path="exportar"    element={<ExportPage />} />
        </Route>

        <Route path="/buscar"  element={<BuscadorPage />} />
        <Route path="/autores" element={<GestionAutores />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
