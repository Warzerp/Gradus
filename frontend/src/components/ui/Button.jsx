/**
 * Button.jsx — Botón reutilizable con variantes y estado de carga.
 *
 * Props:
 *   children   — contenido del botón
 *   variant    — 'primary' | 'secondary' | 'ghost'
 *   isLoading  — muestra spinner y deshabilita el botón
 *   disabled   — deshabilita sin spinner
 *   type       — 'button' | 'submit' | 'reset'
 *   onClick    — handler de click
 *   className  — clases adicionales
 */

const variants = {
  primary:
    'bg-brand-500 hover:bg-brand-600 text-white shadow-sm disabled:opacity-60',
  secondary:
    'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm disabled:opacity-60 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600',
  ghost:
    'bg-transparent hover:bg-gray-100 text-gray-700 disabled:opacity-60 dark:hover:bg-gray-800 dark:text-gray-300',
};

export function Button({
  children,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center gap-2
        px-4 py-2 rounded-lg text-sm font-medium
        transition-colors duration-150 focus:outline-none
        focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2
        ${variants[variant] ?? variants.primary}
        ${className}
      `}
    >
      {isLoading && (
        <span
          aria-hidden="true"
          className="inline-block h-4 w-4 animate-spin rounded-full
                     border-2 border-white border-t-transparent"
        />
      )}
      {isLoading ? 'Cargando…' : children}
    </button>
  );
}
