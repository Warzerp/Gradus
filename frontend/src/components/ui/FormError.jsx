/**
 * FormError.jsx — Muestra errores de formulario a nivel general (no de campo).
 * Usado para errores del servidor (ej: credenciales inválidas).
 */

export function FormError({ message }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200
                 px-3 py-2 text-sm text-red-700
                 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
    >
      {/* Icono de advertencia */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 mt-0.5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
}
