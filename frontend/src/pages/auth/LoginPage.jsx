/**
 * LoginPage.jsx
 *
 * Página de inicio de sesión.
 * - Validación client-side con react-hook-form + zod
 * - Spinner durante el submit
 * - Errores del servidor mostrados con FormError
 * - Redirección por rol tras login exitoso
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';

import { AuthLayout }  from '../../components/layout/AuthLayout';
import { Input }       from '../../components/ui/Input';
import { Button }      from '../../components/ui/Button';
import { FormError }   from '../../components/ui/FormError';
import { useAuth }     from '../../hooks/useAuth';

// ─── Schema de validación ────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('El email no tiene un formato válido'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(8, 'La contraseña debe tener mínimo 8 caracteres'),
});

// ─── Componente ──────────────────────────────────────────────────────────────
export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values) => {
    setServerError('');
    try {
      const decoded = await login(values);
      const adminRoles = ['ROLE_ADMIN', 'ROLE_BIBLIOTECARIO'];
      navigate(adminRoles.includes(decoded?.roles?.[0]) ? '/dashboard' : '/buscar', {
        replace: true,
      });
    } catch (err) {
      setServerError(
        err?.response?.data?.message || 'Credenciales inválidas. Inténtalo de nuevo.'
      );
    }
  };

  return (
    <AuthLayout title="Iniciar sesión" subtitle="Ingresa tus credenciales para continuar">
      <form id="login-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

        <FormError message={serverError} />

        <Input
          label="Correo electrónico"
          name="email"
          type="email"
          placeholder="usuario@universidad.edu.co"
          register={register}
          error={errors.email}
        />

        <Input
          label="Contraseña"
          name="password"
          type="password"
          placeholder="••••••••"
          register={register}
          error={errors.password}
        />

        <Button
          id="login-submit-btn"
          type="submit"
          isLoading={isSubmitting}
          className="w-full mt-2"
        >
          Iniciar Sesión
        </Button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          ¿No tienes cuenta?{' '}
          <Link
            to="/register"
            className="text-brand-500 hover:text-brand-600 font-medium"
          >
            Regístrate
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
