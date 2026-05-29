/**
 * AuthLayout.jsx — Layout centrado para páginas de autenticación.
 * Incluye logo del proyecto, card con sombra y soporte dark mode.
 */

export function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-brand-50 to-indigo-100
                    dark:from-gray-900 dark:to-gray-800
                    px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo + título del proyecto */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14
                          rounded-2xl bg-brand-500 shadow-lg mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3
                   6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168
                   5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477
                   18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Buscador Semántico
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Trabajos de Grado
          </p>
        </div>

        {/* Card del formulario */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl
                        border border-gray-100 dark:border-gray-700 p-8">
          {(title || subtitle) && (
            <div className="mb-6">
              {title && (
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
