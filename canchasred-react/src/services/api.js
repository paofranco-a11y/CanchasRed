// Servicio de conexión REST con el backend FastAPI (canchas-red-api)
import { CANCHAS_ESTATICAS, IMAGEN_POR_DEFECTO } from '../data/canchas';
import { leer } from '../utils/storage';

export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

// Obtiene los encabezados HTTP e inyecta el token JWT si existe una sesión activa
export function getHeaders(isJson = true) {
  const sesion = leer('sesion', null);
  const token = sesion?.token || localStorage.getItem('token');
  const headers = {};
  if (isJson) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// Resuelve imágenes vacías o rutas relativas guardadas en la BD usando las imágenes locales según deporte
export function resolverImagen(imagenUrl, deporte = '') {
  if (imagenUrl && (imagenUrl.startsWith('data:image/') || imagenUrl.startsWith('http://') || imagenUrl.startsWith('https://'))) {
    return imagenUrl;
  }
  const dep = String(deporte).toLowerCase();
  const url = String(imagenUrl || '');
  if (url.includes('canchaFutbol') || dep.includes('fút') || dep.includes('fut')) {
    return CANCHAS_ESTATICAS[1]?.imagen || IMAGEN_POR_DEFECTO;
  }
  if (url.includes('canchaBasquet') || dep.includes('basq') || dep.includes('básq')) {
    return CANCHAS_ESTATICAS[2]?.imagen || IMAGEN_POR_DEFECTO;
  }
  if (url.includes('canchaTenis') || dep.includes('tenis')) {
    return CANCHAS_ESTATICAS[0]?.imagen || IMAGEN_POR_DEFECTO;
  }
  return IMAGEN_POR_DEFECTO;
}

// Traduce el modelo CanchaOut de FastAPI al formato usado por los componentes React
export function mapearCanchaDesdeApi(doc) {
  return {
    id: String(doc.id || doc._id || ''),
    nombre: doc.nombre || '',
    deporte: doc.deporte || 'Fútbol',
    comuna: doc.ubicacion ?? doc.comuna ?? '',
    precio: Number(doc.precio_hora ?? doc.precio ?? 0),
    descripcion: doc.descripcion || 'Recinto deportivo disponible en CanchasRed.',
    imagen: resolverImagen(doc.imagen_url ?? doc.imagen, doc.deporte),
    disponible: doc.activa !== undefined ? Boolean(doc.activa) : (doc.disponible ?? true),
    dueno_id: doc.dueno_id || '',
    correoDueno: doc.correoDueno || '',
  };
}

// Traduce los datos de CanchaForm al modelo CanchaBase / CanchaUpdate que espera FastAPI
export function mapearCanchaHaciaApi(datos) {
  return {
    nombre: datos.nombre,
    deporte: datos.deporte,
    precio_hora: Number(datos.precio),
    ubicacion: datos.comuna,
    descripcion: datos.descripcion || '',
    imagen_url: datos.imagen || '',
    activa: datos.disponible !== undefined ? Boolean(datos.disponible) : true,
  };
}

export const authService = {
  async registro({ nombre, correo, clave, rol, telefono = null }) {
    const res = await fetch(`${API_URL}/auth/registro`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        nombre: (nombre || correo.split('@')[0]).trim(),
        email: correo.trim().toLowerCase(),
        password: clave,
        telefono,
        rol,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      const error = new Error(data.detail || 'Este correo ya está registrado.');
      error.status = res.status;
      throw error;
    }
    return data;
  },

  async login(correo, clave) {
    const correoLimpio = correo.trim().toLowerCase();
    const hacerLogin = async () => {
      const formData = new URLSearchParams();
      formData.append('username', correoLimpio);
      formData.append('password', clave);
      return fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });
    };

    let res = await hacerLogin();

    // Si es la cuenta admin por defecto y aún no existe en MongoDB, la registramos automáticamente
    if (res.status === 401 && correoLimpio === 'usuario_admin@duocuc.cl' && clave === '123456') {
      try {
        await authService.registro({
          nombre: 'Administrador',
          correo: correoLimpio,
          clave,
          rol: 'admin',
        });
        res = await hacerLogin();
      } catch {
        // Si ya existía con otra clave, dejamos que continúe el flujo normal de 401
      }
    }

    const data = await res.json();
    if (!res.ok) {
      const error = new Error(data.detail || 'Correo o contraseña incorrectos.');
      error.status = res.status;
      throw error;
    }

    let perfil = { id: '', email: correoLimpio, nombre: data.nombre || '', rol: data.rol };
    try {
      const resPerfil = await fetch(`${API_URL}/auth/perfil`, {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      if (resPerfil.ok) {
        const datosPerfil = await resPerfil.json();
        perfil = {
          id: datosPerfil.id || '',
          email: datosPerfil.email || correoLimpio,
          nombre: datosPerfil.nombre || data.nombre || '',
          rol: datosPerfil.rol || data.rol,
        };
      }
    } catch {
      // Si falla la consulta de perfil, conservamos los datos devueltos por /login
    }

    localStorage.setItem('token', data.access_token);
    return {
      id: perfil.id,
      correo: perfil.email,
      nombre: perfil.nombre,
      rol: perfil.rol,
      token: data.access_token,
    };
  },

  async listarUsuarios() {
    const res = await fetch(`${API_URL}/auth/usuarios`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'No autorizado para listar usuarios.');
    return Array.isArray(data) ? data : [];
  },

  async actualizarUsuario(id, datos) {
    const res = await fetch(`${API_URL}/auth/usuarios/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(datos),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Error al actualizar usuario.');
    return data;
  },

  async eliminarUsuario(id) {
    const res = await fetch(`${API_URL}/auth/usuarios/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Error al eliminar usuario.');
    return data;
  },
};

export const canchasService = {
  async listar() {
    const res = await fetch(`${API_URL}/canchas/`);
    if (!res.ok) throw new Error('Error al cargar canchas desde el servidor.');
    const data = await res.json();
    return Array.isArray(data) ? data.map(mapearCanchaDesdeApi) : [];
  },

  async crear(datosCancha) {
    const res = await fetch(`${API_URL}/canchas/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(mapearCanchaHaciaApi(datosCancha)),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'No autorizado para crear canchas.');
    return mapearCanchaDesdeApi(data);
  },

  async actualizar(id, datosCancha) {
    const res = await fetch(`${API_URL}/canchas/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(mapearCanchaHaciaApi(datosCancha)),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Error al actualizar la cancha.');
    return mapearCanchaDesdeApi(data);
  },

  async eliminar(id) {
    const res = await fetch(`${API_URL}/canchas/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Error al eliminar la cancha.');
    return data;
  },
};

export const reservasService = {
  async crear({ canchaId, fecha, hora, horas }) {
    const horaInicio = typeof hora === 'number'
      ? hora
      : parseInt(String(hora).split(':')[0], 10) || 18;

    const res = await fetch(`${API_URL}/reservas/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        cancha_id: canchaId,
        fecha,
        hora_inicio: horaInicio,
        duracion_horas: Number(horas) || 1,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Error al crear la reserva.');
    return data;
  },

  async misReservas() {
    const res = await fetch(`${API_URL}/reservas/mis-reservas`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Error al obtener las reservas.');
    return Array.isArray(data) ? data : [];
  },

  async cancelar(id) {
    const res = await fetch(`${API_URL}/reservas/${id}/cancelar`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Error al cancelar la reserva.');
    return data;
  },
};
