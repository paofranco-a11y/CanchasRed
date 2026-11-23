import { createContext, useContext, useState } from 'react';
import { leer, guardar, borrar } from '../utils/storage';
import { authService } from '../services/api';

const AuthContext = createContext(null);

// Cuenta de administrador por defecto (registrada en MongoDB Atlas)
export const ADMIN = { correo: 'usuario_admin@duocuc.cl', rol: 'admin' };

// Página de inicio según el rol: admin → panel, dueño → su perfil, deportista → catálogo
export function rutaInicio(rol) {
  if (rol === 'admin') return '/actividad-admin';
  return rol === 'dueno' ? '/perfil-dueno' : '/';
}

export function AuthProvider({ children }) {
  // En localStorage solo se guarda la sesión activa { id, correo, nombre, rol, token } (nunca contraseñas)
  const [usuario, setUsuario] = useState(() => leer('sesion', null));

  // Inicia sesión contra FastAPI (POST /api/v1/auth/login) y guarda solo el token JWT y datos de sesión
  const login = async (correo, clave) => {
    const correoLimpio = correo.trim().toLowerCase();
    try {
      const sesionApi = await authService.login(correoLimpio, clave);
      guardar('sesion', sesionApi);
      setUsuario(sesionApi);
      return sesionApi;
    } catch {
      return null;
    }
  };

  // Registra un usuario nuevo directamente en MongoDB a través de FastAPI (POST /api/v1/auth/registro)
  const registrar = async (correo, clave, rol, nombre = '') => {
    const correoLimpio = correo.trim().toLowerCase();
    if (correoLimpio === ADMIN.correo) {
      return { ok: false, error: 'Este correo ya está registrado.' };
    }
    try {
      await authService.registro({ nombre, correo: correoLimpio, clave, rol });
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err?.message || 'Este correo ya está registrado.' };
    }
  };

  const logout = () => {
    borrar('sesion');
    borrar('token');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, registrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
