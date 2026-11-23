import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderConProveedores } from '../../components/__tests__/renderConProveedores';
import { leer } from '../../utils/storage';
import { authService } from '../../services/api';
import Login from '../Login';

// Mock de useNavigate para comprobar a qué ruta se redirige
const { navegarMock } = vi.hoisted(() => ({ navegarMock: vi.fn() }));
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => navegarMock,
}));

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear();
    navegarMock.mockClear();
  });
  afterEach(() => { vi.restoreAllMocks(); });

  it('muestra los errores de correo y contraseña al enviar el formulario vacío', () => {
    // preparar
    renderConProveedores(<Login />);
    // actuar
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    // comprobar
    expect(screen.getByText('Ingresa tu correo.')).toBeInTheDocument();
    expect(screen.getByText('Ingresa tu contraseña.')).toBeInTheDocument();
    expect(navegarMock).not.toHaveBeenCalled();
  });

  it('con credenciales correctas guarda la sesión con JWT (sin clave) y navega al perfil del dueño', async () => {
    // preparar: registramos al dueño en el backend simulado
    await authService.registro({ nombre: 'Dueño Test', correo: 'dueno@mail.com', clave: '123456', rol: 'dueno' });
    renderConProveedores(<Login />);
    // actuar
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'dueno@mail.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    // comprobar
    await waitFor(() => expect(navegarMock).toHaveBeenCalledWith('/perfil-dueno'));
    const sesion = leer('sesion', null);
    expect(sesion).toMatchObject({ correo: 'dueno@mail.com', rol: 'dueno' });
    expect(sesion.token).toBeTruthy();
    expect(sesion.clave).toBeUndefined();
    expect(localStorage.getItem('usuarios')).toBeNull();
  });
});
