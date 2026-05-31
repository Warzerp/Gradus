/**
 * authContext.js
 *
 * Exporta únicamente el objeto Context (sin componentes React).
 * Separado de AuthProvider para cumplir con la regla
 * react-refresh/only-export-components de ESLint.
 */

import { createContext } from 'react';

export const AuthContext = createContext(null);
