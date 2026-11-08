import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { renderConProveedores } from '../../components/__tests__/renderConProveedores';
import { leer } from '../../utils/storage';
import Login from '../Login';
import Registro from '../Registro';
import ActividadAdmin from '../ActividadAdmin';
import Usuarios from '../Usuarios';
import Analiticas from '../Analiticas';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import ProtectedRoute from '../../components/ProtectedRoute';

// Mocks: useNavigate para ver la redirección y Bar de Chart.js (jsdom no tiene canvas)
const { navegarMock } = vi.hoisted(() => ({ navegarMock: vi.fn() }));
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => navegarMock,
}));
vi.mock('react-chartjs-2', () => ({
  Bar: ({ data }) => <div data-testid="grafico">{data.labels.join(',')}</div>,
}));

const sesionAdmin = { correo: 'usuario_admin@duocuc.cl', rol: 'admin' };

function renderRuta(ruta, patron, elemento, sesion = null) {
  if (sesion) localStorage.setItem('sesion', JSON.stringify(sesion));
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <AuthProvider>
        <Routes>
          <Route path={patron} element={elemento} />
          <Route path="/login" element={<p>Pantalla de login</p>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('Rol admin', () => {
  beforeEach(() => {
    localStorage.clear();
    navegarMock.mockClear();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });
  afterEach(() => { vi.restoreAllMocks(); });

  const iniciarSesion = (correo, clave) => {
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: correo } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: clave } });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
  };

  it('Login: la cuenta admin guarda la sesión y navega a /actividad-admin', () => {
    renderConProveedores(<Login />);
    iniciarSesion('usuario_admin@duocuc.cl', '123456');
    expect(leer('sesion', null)).toEqual(sesionAdmin);
    expect(navegarMock).toHaveBeenCalledWith('/actividad-admin');
  });

  it('Login: clave incorrecta del admin muestra el error y no guarda sesión', () => {
    renderConProveedores(<Login />);
    iniciarSesion('usuario_admin@duocuc.cl', 'mala-clave');
    expect(screen.getByText('Correo o contraseña incorrectos.')).toBeInTheDocument();
    expect(leer('sesion', null)).toBeNull();
  });

  it('Registro: no permite registrar el correo del administrador', () => {
    renderConProveedores(<Registro />);
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'usuario_admin@duocuc.cl' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(screen.getByText('Este correo ya está registrado.')).toBeInTheDocument();
    expect(leer('usuarios', [])).toHaveLength(0);
  });

  it('ProtectedRoute: un deportista no entra a una ruta de admin', () => {
    renderRuta('/usuarios', '/usuarios',
      <ProtectedRoute rol="admin"><p>Panel</p></ProtectedRoute>, { correo: 'dep@mail.com', rol: 'deportista' });
    expect(screen.getByText('Pantalla de login')).toBeInTheDocument();
  });

  it('ProtectedRoute: sin sesión redirige a /login y el admin sí entra', () => {
    const a = renderRuta('/usuarios', '/usuarios', <ProtectedRoute rol="admin"><p>Panel</p></ProtectedRoute>);
    expect(screen.getByText('Pantalla de login')).toBeInTheDocument();
    a.unmount();
    renderRuta('/usuarios', '/usuarios', <ProtectedRoute rol="admin"><p>Panel</p></ProtectedRoute>, sesionAdmin);
    expect(screen.getByText('Panel')).toBeInTheDocument();
  });

  it('NavBar y Footer muestran "Panel Admin" y "Salir" para el admin', () => {
    localStorage.setItem('sesion', JSON.stringify(sesionAdmin));
    renderConProveedores(<><NavBar /><Footer /></>);
    expect(screen.getAllByRole('link', { name: 'Panel Admin' })).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'Salir' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Mis Reservas' })).not.toBeInTheDocument();
  });

  it('ActividadAdmin muestra las métricas y la actividad reciente', () => {
    renderRuta('/actividad-admin', '/actividad-admin', <ActividadAdmin />, sesionAdmin);
    expect(screen.getByText('Usuarios totales')).toBeInTheDocument();
    expect(screen.getByText('$384.000')).toBeInTheDocument();
    expect(screen.getByText('Nueva reserva — Cancha Central Norte')).toBeInTheDocument();
  });

  it('AdminLayout: "Salir" cierra la sesión y navega al inicio', () => {
    renderRuta('/actividad-admin', '/actividad-admin', <ActividadAdmin />, sesionAdmin);
    fireEvent.click(screen.getByRole('link', { name: 'Salir' }));
    expect(leer('sesion', null)).toBeNull();
    expect(navegarMock).toHaveBeenCalledWith('/');
  });

  it('Analiticas muestra el gráfico (mock de Chart.js) y la tabla de top canchas', () => {
    renderRuta('/analiticas', '/analiticas', <Analiticas />, sesionAdmin);
    expect(screen.getByTestId('grafico')).toHaveTextContent('Ene,Feb,Mar,Abr,May,Jun,Jul,Ago,Sep');
    expect(screen.getByText('Court Tenis Las Flores')).toBeInTheDocument();
  });

  it('Usuarios: el buscador y el filtro por rol reducen la tabla', () => {
    renderRuta('/usuarios', '/usuarios', <Usuarios />, sesionAdmin);
    expect(screen.getByText('Usuarios (7)')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Buscar usuario'), { target: { value: 'CARLOS' } });
    expect(screen.getByText('carlos.rojas@gmail.com')).toBeInTheDocument();
    expect(screen.queryByText('icbelly23@gmail.com')).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Buscar usuario'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Filtrar por rol'), { target: { value: 'dueño' } });
    expect(screen.getAllByRole('row')).toHaveLength(4); // encabezado + 3 dueños
  });

  it('Usuarios: invitar a un usuario muestra la confirmación; la pestaña pendientes está vacía', () => {
    renderRuta('/usuarios', '/usuarios', <Usuarios />, sesionAdmin);
    fireEvent.click(screen.getByRole('button', { name: 'Invita usuarios' }));
    const modal = screen.getByRole('dialog');
    fireEvent.change(within(modal).getByLabelText('Nombre completo'), { target: { value: 'Luis Soto' } });
    fireEvent.change(within(modal).getByLabelText('Correo electrónico'), { target: { value: 'luis@mail.com' } });
    fireEvent.change(within(modal).getByLabelText('Rol'), { target: { value: 'deportista' } });
    fireEvent.click(within(modal).getByRole('button', { name: 'Enviar invitación' }));
    expect(screen.getByText('Invitación enviada a luis@mail.com')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Solicitudes pendientes' }));
    expect(screen.getByText('No hay solicitudes pendientes por el momento.')).toBeInTheDocument();
  });
});
