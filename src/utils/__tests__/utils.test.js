import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { leer, guardar, borrar } from '../storage';
import { normalizar, formatearPrecio } from '../validators';
import { leerImagen } from '../imagen';
import {
  authService,
  canchasService,
  reservasService,
  mapearCanchaDesdeApi,
  mapearCanchaHaciaApi,
  resolverImagen,
} from '../../services/api';

describe('storage', () => {
  beforeEach(() => { localStorage.clear(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('guarda y lee valores JSON, y devuelve el valor por defecto si no existe', () => {
    expect(leer('x', 'por defecto')).toBe('por defecto');
    expect(guardar('x', { a: 1 })).toBe(true);
    expect(leer('x', null)).toEqual({ a: 1 });
    borrar('x');
    expect(leer('x', null)).toBeNull();
  });

  it('guardar devuelve false cuando no hay espacio (QuotaExceededError)', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('lleno', 'QuotaExceededError'); });
    expect(guardar('x', 'dato')).toBe(false);
  });

  it('leer devuelve el valor por defecto si el JSON está dañado', () => {
    localStorage.setItem('malo', '{no es json');
    expect(leer('malo', [])).toEqual([]);
  });
});

describe('validators', () => {
  it('normalizar quita tildes y mayúsculas', () => {
    expect(normalizar('  Fútbol ÑUÑOA ')).toBe('futbol nunoa');
  });
  it('formatearPrecio usa puntos de miles', () => {
    expect(formatearPrecio(7000)).toBe('$7.000');
    expect(formatearPrecio(100000)).toBe('$100.000');
  });
});

describe('imagen', () => {
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  it('leerImagen redimensiona a 800 px de ancho y devuelve un JPEG (mock de Image y canvas)', async () => {
    // jsdom no carga imágenes ni dibuja canvas: se simulan
    vi.stubGlobal('Image', class {
      set src(_valor) { this.width = 1600; this.height = 800; setTimeout(() => this.onload()); }
    });
    const lienzo = { drawImage: vi.fn() };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(lienzo);
    const aJpeg = vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/jpeg;base64,OK');

    const resultado = await leerImagen(new File(['x'], 'foto.png', { type: 'image/png' }));

    expect(resultado).toBe('data:image/jpeg;base64,OK');
    expect(lienzo.drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 800, 400);
    expect(aJpeg).toHaveBeenCalledWith('image/jpeg', 0.8);
  });
});

describe('api services (FastAPI REST)', () => {
  beforeEach(() => { localStorage.clear(); });

  it('mapearCanchaDesdeApi y mapearCanchaHaciaApi traducen campos entre FastAPI y React', () => {
    const desdeApi = mapearCanchaDesdeApi({
      id: '6b03371a03fef4cdac6b9ea1',
      nombre: 'Cancha API',
      deporte: 'Fútbol',
      precio_hora: 12000,
      ubicacion: 'Ñuñoa',
      descripcion: 'Pasto sintético',
      imagen_url: '',
      activa: true,
      dueno_id: 'dueno123',
    });
    expect(desdeApi).toMatchObject({
      id: '6b03371a03fef4cdac6b9ea1',
      nombre: 'Cancha API',
      deporte: 'Fútbol',
      comuna: 'Ñuñoa',
      precio: 12000,
      disponible: true,
      dueno_id: 'dueno123',
    });

    const haciaApi = mapearCanchaHaciaApi(desdeApi);
    expect(haciaApi).toMatchObject({
      nombre: 'Cancha API',
      deporte: 'Fútbol',
      precio_hora: 12000,
      ubicacion: 'Ñuñoa',
      activa: true,
    });
    expect(resolverImagen('https://ejemplo.com/foto.jpg', 'Tenis')).toBe('https://ejemplo.com/foto.jpg');
  });

  it('authService, canchasService y reservasService se comunican con los endpoints /api/v1', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');

    // 1. Login + Perfil
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ access_token: 'jwt-123', token_type: 'bearer', rol: 'deportista', nombre: 'Paola' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: 'u1', email: 'paola@mail.com', nombre: 'Paola', rol: 'deportista' }),
      });

    const sesion = await authService.login('paola@mail.com', '123456');
    expect(sesion).toEqual({ id: 'u1', correo: 'paola@mail.com', nombre: 'Paola', rol: 'deportista', token: 'jwt-123' });

    // 2. Listar y crear canchas
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => [{ id: 'c1', nombre: 'Central', deporte: 'Tenis', precio_hora: 8000, ubicacion: 'Ñuñoa', activa: true }],
    });
    const lista = await canchasService.listar();
    expect(lista).toHaveLength(1);
    expect(lista[0].comuna).toBe('Ñuñoa');

    // 3. Crear y listar reservas
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ id: 'r1', cancha_id: 'c1', fecha: '2099-01-10', hora_inicio: 19, duracion_horas: 2, estado: 'confirmada' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [{ id: 'r1', cancha_id: 'c1', fecha: '2099-01-10', hora_inicio: 19, duracion_horas: 2, estado: 'confirmada' }],
      });

    const creada = await reservasService.crear({ canchaId: 'c1', fecha: '2099-01-10', hora: '19:00', horas: 2 });
    expect(creada.hora_inicio).toBe(19);
    const misRes = await reservasService.misReservas();
    expect(misRes).toHaveLength(1);
  });
});
