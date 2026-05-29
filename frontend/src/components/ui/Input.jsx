/**
 * Input.jsx — Campo de formulario reutilizable.
 *
 * Props:
 *   label       — etiqueta visible encima del input
 *   name        — nombre del campo (para react-hook-form)
 *   type        — tipo HTML (text, email, password, etc.)
 *   placeholder — texto de ejemplo
 *   error       — mensaje de error (de react-hook-form)
 *   register    — resultado de register() de react-hook-form
 *   className   — clases adicionales al contenedor
 */

import { useState } from 'react';

export function Input({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  register,
  className = '',
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={name}
          type={resolvedType}
          placeholder={placeholder}
          {...(register ? register(name) : {})}
          className={`
            w-full rounded-lg border px-3 py-2 text-sm
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            outline-none transition
            focus:ring-2 focus:ring-brand-500 focus:border-transparent
            ${error
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 dark:border-gray-600'
            }
            ${isPassword ? 'pr-10' : ''}
          `}
        />

        {/* Toggle mostrar/ocultar contraseña */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-400
                       hover:text-gray-600 dark:hover:text-gray-300 transition"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? (
              /* Ojo cerrado */
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7
                     a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878
                     9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3
                     3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543
                     7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              /* Ojo abierto */
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943
                     9.542 7-1.274 4.057-5.064 7-9.542 7-4.477
                     0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Mensaje de error */}
      {error && (
        <p className="text-xs text-red-500 mt-0.5" role="alert">
          {error.message || error}
        </p>
      )}
    </div>
  );
}
