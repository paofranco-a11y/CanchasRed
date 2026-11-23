import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { beforeEach, afterEach, vi } from 'vitest';

// En pruebas unitarias simulamos los endpoints de FastAPI (/api/v1/auth/*) en memoria
let usuariosRegistradosTest = [];

beforeEach(() => {
  usuariosRegistradosTest = [
    { id: 'admin-1', nombre: 'Administrador', email: 'usuario_admin@duocuc.cl', password: '123456', rol: 'admin' },
  ];

  vi.spyOn(globalThis, 'fetch').mockImplementation(async (url, options = {}) => {
    const ruta = String(url);

    // POST /api/v1/auth/registro
    if (ruta.endsWith('/auth/registro') && options.method === 'POST') {
      const body = JSON.parse(options.body || '{}');
      const existe = usuariosRegistradosTest.some((u) => u.email === body.email);
      if (existe) {
        return {
          ok: false,
          status: 400,
          json: async () => ({ detail: 'Este correo ya está registrado.' }),
        };
      }
      const nuevo = {
        id: `u-${usuariosRegistradosTest.length + 1}`,
        nombre: body.nombre || 'Usuario',
        email: body.email,
        password: body.password,
        rol: body.rol || 'deportista',
      };
      usuariosRegistradosTest.push(nuevo);
      return {
        ok: true,
        status: 201,
        json: async () => ({ id: nuevo.id, nombre: nuevo.nombre, email: nuevo.email, rol: nuevo.rol }),
      };
    }

    // POST /api/v1/auth/login
    if (ruta.endsWith('/auth/login') && options.method === 'POST') {
      const params = new URLSearchParams(options.body);
      const email = params.get('username');
      const password = params.get('password');
      const encontrado = usuariosRegistradosTest.find((u) => u.email === email && u.password === password);
      if (!encontrado) {
        return {
          ok: false,
          status: 401,
          json: async () => ({ detail: 'Correo o contraseña incorrectos.' }),
        };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          access_token: `jwt-token-${encontrado.id}`,
          token_type: 'bearer',
          rol: encontrado.rol,
          nombre: encontrado.nombre,
        }),
      };
    }

    // GET /api/v1/auth/perfil
    if (ruta.endsWith('/auth/perfil')) {
      const authHeader = options.headers?.Authorization || '';
      const id = authHeader.replace('Bearer jwt-token-', '');
      const encontrado = usuariosRegistradosTest.find((u) => u.id === id);
      if (encontrado) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: encontrado.id,
            nombre: encontrado.nombre,
            email: encontrado.email,
            rol: encontrado.rol,
          }),
        };
      }
    }

    throw new Error('offline-test');
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
