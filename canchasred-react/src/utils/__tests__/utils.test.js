import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { leer, guardar, borrar } from '../storage';
import { normalizar, formatearPrecio } from '../validators';
import { leerImagen } from '../imagen';

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
