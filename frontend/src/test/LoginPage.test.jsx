/**
 * LoginPage.test.jsx
 *
 * Tests de integración para LoginPage.
 * Verifica:
 *  1. Renderiza el formulario completo (email, password, botón).
 *  2. Muestra errores de validación sin tocar el servidor.
 *  3. Muestra error cuando la contraseña tiene menos de 8 caracteres.
 *  4. Llama a login() con las credenciales correctas y redirige.
 *  5. Muestra error del servidor si login() falla.
 *
 * Nota sobre selectores:
 *  El campo password usa getByPlaceholderText en lugar de getByLabelText
 *  porque el componente Input renderiza un botón con aria-label="Mostrar contraseña"
 *  que también coincide con /contraseña/i, causando "Found multiple elements".
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from '../pages/auth/LoginPage';
import { AuthContext } from '../context/authContext';

// ─── Mock de useNavigate ──────────────────────────────────────────────────────
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

// ─── Helpers de selección ─────────────────────────────────────────────────────
const getEmailInput    = () => screen.getByLabelText(/correo electrónico/i);
// Usamos placeholder para evitar ambigüedad con el botón toggle "Mostrar contraseña"
const getPasswordInput = () => screen.getByPlaceholderText('••••••••');
const getSubmitBtn     = () => screen.getByRole('button', { name: /iniciar sesión/i });

// ─── Helper: renderiza LoginPage con un AuthContext mockeado ──────────────────
function renderLoginPage(loginFn = vi.fn()) {
  const contextValue = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: loginFn,
    logout: vi.fn(),
    checkAuth: vi.fn(),
  };

  return render(
    <MemoryRouter>
      <AuthContext.Provider value={contextValue}>
        <LoginPage />
      </AuthContext.Provider>
    </MemoryRouter>
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  // ── 1. Render básico ────────────────────────────────────────────────────────
  it('1. renderiza el campo email, password y el botón de submit', () => {
    renderLoginPage();

    expect(getEmailInput()).toBeInTheDocument();
    expect(getPasswordInput()).toBeInTheDocument();
    expect(getSubmitBtn()).toBeInTheDocument();
  });

  it('1b. tiene el link a /register', () => {
    renderLoginPage();
    expect(screen.getByRole('link', { name: /regístrate/i })).toHaveAttribute('href', '/register');
  });

  // ── 2. Validación: campos vacíos ────────────────────────────────────────────
  it('2. muestra errores de validación si se envía el formulario vacío', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.click(getSubmitBtn());

    await waitFor(() => {
      expect(screen.getByText(/el email es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/la contraseña es obligatoria/i)).toBeInTheDocument();
    });
  });

  // ── 3. Validación: password corta ───────────────────────────────────────────
  it('3. muestra error si la contraseña tiene menos de 8 caracteres', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(getEmailInput(), 'test@uni.edu.co');
    await user.type(getPasswordInput(), '1234');
    await user.click(getSubmitBtn());

    await waitFor(() => {
      expect(
        screen.getByText(/la contraseña debe tener mínimo 8 caracteres/i)
      ).toBeInTheDocument();
    });
  });

  // ── 4. Login exitoso ────────────────────────────────────────────────────────
  it('4. llama a login() y redirige a /buscar para ROLE_USER', async () => {
    const user = userEvent.setup();
    const loginFn = vi.fn().mockResolvedValue({ roles: ['ROLE_USER'] });
    renderLoginPage(loginFn);

    await user.type(getEmailInput(), 'test@uni.edu.co');
    await user.type(getPasswordInput(), 'password123');
    await user.click(getSubmitBtn());

    await waitFor(() => {
      expect(loginFn).toHaveBeenCalledWith({
        email: 'test@uni.edu.co',
        password: 'password123',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/buscar', { replace: true });
    });
  });

  it('4b. redirige a /dashboard para ROLE_ADMIN', async () => {
    const user = userEvent.setup();
    const loginFn = vi.fn().mockResolvedValue({ roles: ['ROLE_ADMIN'] });
    renderLoginPage(loginFn);

    await user.type(getEmailInput(), 'admin@uni.edu.co');
    await user.type(getPasswordInput(), 'adminpass');
    await user.click(getSubmitBtn());

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  it('4c. redirige a /dashboard para ROLE_BIBLIOTECARIO', async () => {
    const user = userEvent.setup();
    const loginFn = vi.fn().mockResolvedValue({ roles: ['ROLE_BIBLIOTECARIO'] });
    renderLoginPage(loginFn);

    await user.type(getEmailInput(), 'bib@uni.edu.co');
    await user.type(getPasswordInput(), 'bibpass1');
    await user.click(getSubmitBtn());

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  // ── 5. Error del servidor ───────────────────────────────────────────────────
  it('5. muestra el mensaje del servidor cuando login() falla', async () => {
    const user = userEvent.setup();
    const loginFn = vi.fn().mockRejectedValue({
      response: { data: { message: 'Usuario o contraseña incorrectos' } },
    });
    renderLoginPage(loginFn);

    await user.type(getEmailInput(), 'test@uni.edu.co');
    await user.type(getPasswordInput(), 'wrongpass');
    await user.click(getSubmitBtn());

    await waitFor(() => {
      expect(
        screen.getByText(/usuario o contraseña incorrectos/i)
      ).toBeInTheDocument();
    });
  });

  it('5b. muestra mensaje genérico si el servidor no devuelve mensaje', async () => {
    const user = userEvent.setup();
    const loginFn = vi.fn().mockRejectedValue({});
    renderLoginPage(loginFn);

    await user.type(getEmailInput(), 'test@uni.edu.co');
    await user.type(getPasswordInput(), 'somepass1');
    await user.click(getSubmitBtn());

    await waitFor(() => {
      expect(
        screen.getByText(/credenciales inválidas\. inténtalo de nuevo\./i)
      ).toBeInTheDocument();
    });
  });
});
