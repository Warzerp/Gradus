/**
 * RegisterPage.jsx
 *
 * Página de registro de nuevo usuario.
 * - Campos: nombre, apellido, email, password, confirmPassword
 * - Validación extra: password === confirmPassword
 * - Redirige a /login con mensaje de éxito tras registro exitoso
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
import * as authService from '../../services/authService';

// ─── Schema de validación ────────────────────────────────────────────────────
const registerSchema = z
  .object({
    nombre: z.string().min(2, 'El nombre debe tener mínimo 2 caracteres'),
    apellido: z.string().min(2, 'El apellido debe tener mínimo 2 caracteres'),
    email: z
      .string()
      .min(1, 'El email es obligatorio')
      .email('El email no tiene un formato válido'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener mínimo 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

// ─── Componente ──────────────────────────────────────────────────────────────
export function RegisterPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async ({ nombre, apellido, email, password }) => {
    setServerError('');
    try {
      await authService.register({ nombre: `${nombre} ${apellido}`, email, password });
      navigate('/login', {
        state: { successMessage: '¡Cuenta creada! Ya puedes iniciar sesión.' },
        replace: true,
      });
    } catch (err) {
      setServerError(
        err?.response?.data?.message || 'Error al registrar. Inténtalo de nuevo.'
      );
    }
  };

  return (
    <AuthLayout title="Crear cuenta" subtitle="Completa los datos para registrarte">
      <form id="register-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

        <FormError message={serverError} />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Nombre"
            name="nombre"
            placeholder="Juan"
            register={register}
            error={errors.nombre}
          />
          <Input
            label="Apellido"
            name="apellido"
            placeholder="Pérez"
            register={register}
            error={errors.apellido}
          />
        </div>

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
          placeholder="Mínimo 8 caracteres"
          register={register}
          error={errors.password}
        />

        <Input
          label="Confirmar contraseña"
          name="confirmPassword"
          type="password"
          placeholder="Repite tu contraseña"
          register={register}
          error={errors.confirmPassword}
        />

        <Button
          id="register-submit-btn"
          type="submit"
          isLoading={isSubmitting}
          className="w-full mt-2"
        >
          Crear cuenta
        </Button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-brand-500 hover:text-brand-600 font-medium">
            Inicia sesión
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
