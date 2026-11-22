import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderConProveedores } from '../../components/__tests__/renderConProveedores';
import { leer } from '../../utils/storage';
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

  it('con credenciales correctas guarda la sesión y navega al perfil del dueño', () => {
    // preparar: un dueño ya registrado
    localStorage.setItem('usuarios', JSON.stringify([{ correo: 'dueno@mail.com', clave: '123456', rol: 'dueno' }]));
    renderConProveedores(<Login />);
    // actuar
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'dueno@mail.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    // comprobar
    expect(leer('sesion', null)).toEqual({ correo: 'dueno@mail.com', rol: 'dueno' });
    expect(navegarMock).toHaveBeenCalledWith('/perfil-dueno');
  });
});
