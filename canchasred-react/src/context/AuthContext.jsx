import { createContext, useContext, useState } from 'react';
import { leer, guardar, borrar } from '../utils/storage';

/**
 * Contexto de Autenticación (AuthContext).
 * Administra el estado global de la sesión del usuario (usuario actual, rol, token de autenticación).
 * Provee funciones esenciales para el inicio de sesión (login), registro (registro) y cierre de sesión (logout),
 * sincronizando los datos del usuario activo con el almacenamiento local (localStorage).
 */
const AuthContext = createContext(null);

// Cuenta de administrador fija (igual que en js/login.js del sitio original)
export const ADMIN = { correo: 'usuario_admin@duocuc.cl', clave: '123456', rol: 'admin' };

// Página de inicio según el rol: admin → panel, dueño → su perfil, deportista → catálogo
export function rutaInicio(rol) {
  if (rol === 'admin') return '/actividad-admin';
  return rol === 'dueno' ? '/perfil-dueno' : '/';
}

export function AuthProvider({ children }) {
  // Sesión actual { correo, rol } o null
  const [usuario, setUsuario] = useState(() => leer('sesion', null));

  // Devuelve la sesión si las credenciales son correctas, o null si no coinciden
  const login = (correo, clave) => {
    const usuarios = [...leer('usuarios', []), ADMIN];
    const encontrado = usuarios.find(
      (u) => u.correo === correo.trim().toLowerCase() && u.clave === clave
    );
    if (!encontrado) return null;
    const sesion = { correo: encontrado.correo, rol: encontrado.rol };
    guardar('sesion', sesion);
    setUsuario(sesion);
    return sesion;
  };

  // Agrega un usuario nuevo (el correo debe ser único)
  const registrar = (correo, clave, rol) => {
    const usuarios = leer('usuarios', []);
    const correoLimpio = correo.trim().toLowerCase();
    if (correoLimpio === ADMIN.correo || usuarios.some((u) => u.correo === correoLimpio)) {
      return { ok: false, error: 'Este correo ya está registrado.' };
    }
    guardar('usuarios', [...usuarios, { correo: correoLimpio, clave, rol }]);
    return { ok: true };
  };

  const logout = () => {
    borrar('sesion');
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
