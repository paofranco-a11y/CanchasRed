import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderConProveedores } from '../../components/__tests__/renderConProveedores';
import Registro from '../Registro';

const { navegarMock } = vi.hoisted(() => ({ navegarMock: vi.fn() }));
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => navegarMock,
}));

describe('Registro', () => {
  beforeEach(() => {
    localStorage.clear();
    navegarMock.mockClear();
    // Mock de alert: jsdom no lo implementa y además queremos comprobarlo
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });
  afterEach(() => { vi.restoreAllMocks(); });

  const llenar = (correo, clave, confirmar) => {
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: correo } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: clave } });
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), { target: { value: confirmar } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
  };

  it('muestra "Las contraseñas no coinciden." cuando las contraseñas son distintas', () => {
    renderConProveedores(<Registro />);
    llenar('dep@mail.com', '123456', '654321');
    expect(screen.getByText('Las contraseñas no coinciden.')).toBeInTheDocument();
    expect(localStorage.getItem('usuarios')).toBeNull();
    expect(navegarMock).not.toHaveBeenCalled();
  });

  it('con datos válidos registra el usuario en la API (sin guardar clave en localStorage) y navega a /login', async () => {
    renderConProveedores(<Registro />);
    fireEvent.click(screen.getByLabelText(/Deportista/));
    llenar('dep@mail.com', '123456', '123456');
    await waitFor(() => expect(navegarMock).toHaveBeenCalledWith('/login'));
    expect(localStorage.getItem('usuarios')).toBeNull();
    expect(window.alert).toHaveBeenCalledWith('Cuenta creada correctamente. Ahora inicia sesión.');
  });
});
