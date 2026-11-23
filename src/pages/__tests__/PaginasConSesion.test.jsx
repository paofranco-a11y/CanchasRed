import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { leer } from '../../utils/storage';
import DetalleCancha from '../DetalleCancha';
import MisReservas from '../MisReservas';
import PerfilDueno from '../PerfilDueno';
import Nosotros from '../Nosotros';
import Blogs from '../Blogs';
import NotFound from '../NotFound';

// Renderiza una ruta con sesión opcional ya guardada en localStorage
function renderRuta(ruta, patron, elemento, sesion = null) {
  if (sesion) localStorage.setItem('sesion', JSON.stringify(sesion));
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <AuthProvider>
        <Routes>
          <Route path={patron} element={elemento} />
          <Route path="*" element={<p>otra pantalla</p>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

const canchaDueno = {
  id: '111', nombre: 'Mi Cancha', deporte: 'Fútbol', comuna: 'Ñuñoa', precio: 10000,
  descripcion: 'Linda', disponible: true, imagen: 'data:image/jpeg;base64,AAA', correoDueno: 'dueno@mail.com',
};
const sesionDueno = { correo: 'dueno@mail.com', rol: 'dueno' };
const sesionDeportista = { correo: 'dep@mail.com', rol: 'deportista' };

describe('Páginas con sesión', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });
  afterEach(() => { vi.restoreAllMocks(); });

  it('DetalleCancha: sin sesión avisa que hay que iniciar sesión', () => {
    renderRuta('/cancha/est-1', '/cancha/:id', <DetalleCancha />);
    fireEvent.click(screen.getByRole('button', { name: 'Reservar' }));
    expect(window.alert).toHaveBeenCalledWith('Debes iniciar sesión para reservar una cancha.');
  });

  it('DetalleCancha: un dueño no puede reservar', () => {
    renderRuta('/cancha/est-1', '/cancha/:id', <DetalleCancha />, sesionDueno);
    fireEvent.click(screen.getByRole('button', { name: 'Reservar' }));
    expect(screen.getByText('Solo los deportistas pueden reservar.')).toBeInTheDocument();
  });

  it('DetalleCancha: un deportista reserva y la reserva queda guardada con su correo', () => {
    renderRuta('/cancha/est-2', '/cancha/:id', <DetalleCancha />, sesionDeportista);
    fireEvent.click(screen.getByRole('button', { name: 'Reservar' }));
    fireEvent.change(screen.getByLabelText('Fecha'), { target: { value: '2099-01-10' } });
    fireEvent.change(screen.getByLabelText('Hora'), { target: { value: '20:00' } });
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Reserva' }));
    const reservas = leer('reservas', []);
    expect(reservas).toHaveLength(1);
    expect(reservas[0]).toMatchObject({ canchaId: 'est-2', cancha: 'Multicancha Barrio Sur', correoUsuario: 'dep@mail.com', horas: 1 });
  });

  it('DetalleCancha: una cancha inexistente muestra un mensaje', () => {
    renderRuta('/cancha/no-existe', '/cancha/:id', <DetalleCancha />);
    expect(screen.getByText('No encontramos esta cancha.')).toBeInTheDocument();
  });

  it('MisReservas: solo muestra las reservas del correo con sesión', () => {
    localStorage.setItem('reservas', JSON.stringify([
      { id: '1', canchaId: 'est-1', cancha: 'Cancha Central Norte', precio: 7000, fecha: '2099-01-01', hora: '10:00', horas: 2, correoUsuario: 'dep@mail.com' },
      { id: '2', canchaId: 'est-2', cancha: 'Multicancha Barrio Sur', precio: 6500, fecha: '2099-01-02', hora: '11:00', horas: 1, correoUsuario: 'otro@mail.com' },
    ]));
    renderRuta('/mis-reservas', '/mis-reservas', <MisReservas />, sesionDeportista);
    expect(screen.getByText('Cancha Central Norte')).toBeInTheDocument();
    expect(screen.queryByText('Multicancha Barrio Sur')).not.toBeInTheDocument();
    expect(screen.getByText('2099-01-01 - 10:00 (2 horas)')).toBeInTheDocument();
  });

  it('MisReservas: sin reservas muestra el mensaje vacío', () => {
    renderRuta('/mis-reservas', '/mis-reservas', <MisReservas />, sesionDeportista);
    expect(screen.getByText('Aún no tienes reservas.')).toBeInTheDocument();
  });

  it('PerfilDueno: solo muestra las canchas del dueño con sesión', () => {
    localStorage.setItem('canchas', JSON.stringify([canchaDueno, { ...canchaDueno, id: '222', nombre: 'Ajena', correoDueno: 'otro@mail.com' }]));
    renderRuta('/perfil-dueno', '/perfil-dueno', <PerfilDueno />, sesionDueno);
    expect(screen.getByText('Mi Cancha')).toBeInTheDocument();
    expect(screen.queryByText('Ajena')).not.toBeInTheDocument();
  });

  it('PerfilDueno: edita una cancha conservando su imagen', () => {
    localStorage.setItem('canchas', JSON.stringify([canchaDueno]));
    renderRuta('/perfil-dueno', '/perfil-dueno', <PerfilDueno />, sesionDueno);
    fireEvent.click(screen.getByRole('button', { name: 'Ver detalle' }));
    expect(screen.getByText('Editar Cancha')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Precio por hora ($)'), { target: { value: '20000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar Cambios' }));
    const guardada = leer('canchas', [])[0];
    expect(guardada.precio).toBe(20000);
    expect(guardada.imagen).toBe(canchaDueno.imagen);
  });

  it('PerfilDueno: elimina una cancha tras confirmar', () => {
    localStorage.setItem('canchas', JSON.stringify([canchaDueno]));
    renderRuta('/perfil-dueno', '/perfil-dueno', <PerfilDueno />, sesionDueno);
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(screen.getByText('Cancha a eliminar:')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
    expect(leer('canchas', [])).toHaveLength(0);
    expect(screen.getByText('Aún no tienes canchas publicadas.')).toBeInTheDocument();
  });

  it('PerfilDueno: si no hay espacio en localStorage muestra el aviso', () => {
    localStorage.setItem('canchas', JSON.stringify([canchaDueno]));
    renderRuta('/perfil-dueno', '/perfil-dueno', <PerfilDueno />, sesionDueno);
    fireEvent.click(screen.getByRole('button', { name: 'Ver detalle' }));
    // mock: setItem falla como cuando se llena el almacenamiento
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('lleno', 'QuotaExceededError'); });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar Cambios' }));
    expect(screen.getByText('No hay espacio para guardar la imagen. Usa una imagen más liviana.')).toBeInTheDocument();
  });
});

describe('Páginas informativas', () => {
  it('Nosotros, Blogs y NotFound se renderizan con su contenido', () => {
    const envolver = (ui) => render(<MemoryRouter><AuthProvider>{ui}</AuthProvider></MemoryRouter>);
    const a = envolver(<Nosotros />);
    expect(screen.getByText('Paola Franco')).toBeInTheDocument();
    a.unmount();
    const b = envolver(<Blogs />);
    expect(screen.getByText('Beneficios de la Digitalización')).toBeInTheDocument();
    b.unmount();
    envolver(<NotFound />);
    expect(screen.getByText('Página no encontrada')).toBeInTheDocument();
  });
});
