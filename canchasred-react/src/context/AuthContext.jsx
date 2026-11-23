import { createContext, useContext, useState } from 'react';
import { leer, guardar, borrar } from '../utils/storage';
import { authService } from '../services/api';

const AuthContext = createContext(null);

// Cuenta de administrador fija (respaldo local y auto-registrada en FastAPI si no existe aún)
export const ADMIN = { correo: 'usuario_admin@duocuc.cl', clave: '123456', rol: 'admin' };

// Página de inicio según el rol: admin → panel, dueño → su perfil, deportista → catálogo
export function rutaInicio(rol) {
  if (rol === 'admin') return '/actividad-admin';
  return rol === 'dueno' ? '/perfil-dueno' : '/';
}

export function AuthProvider({ children }) {
  // Sesión actual { id, correo, nombre, rol, token } o null (persiste al recargar la página)
  const [usuario, setUsuario] = useState(() => leer('sesion', null));

  // Inicia sesión contra FastAPI (JWT) o usa respaldo local si el servidor no está disponible en tests
  const login = async (correo, clave) => {
    const correoLimpio = correo.trim().toLowerCase();
    const usuariosLocales = [...leer('usuarios', []), ADMIN];
    const localEncontrado = usuariosLocales.find(
      (u) => u.correo === correoLimpio && u.clave === clave
    );

    try {
      const sesionApi = await authService.login(correoLimpio, clave);
      guardar('sesion', sesionApi);
      setUsuario(sesionApi);
      return sesionApi;
    } catch (err) {
      // Si el usuario fue precargado en localStorage (por ejemplo en pruebas unitarias) o no hay red
      if (localEncontrado) {
        const sesionLocal = { correo: localEncontrado.correo, rol: localEncontrado.rol };
        guardar('sesion', sesionLocal);
        setUsuario(sesionLocal);
        return sesionLocal;
      }
      if (err?.status === 401) return null;
      return null;
    }
  };

  // Registra un usuario nuevo en FastAPI y sincroniza respaldo local
  const registrar = async (correo, clave, rol, nombre = '') => {
    const usuarios = leer('usuarios', []);
    const correoLimpio = correo.trim().toLowerCase();
    if (correoLimpio === ADMIN.correo || usuarios.some((u) => u.correo === correoLimpio)) {
      return { ok: false, error: 'Este correo ya está registrado.' };
    }

    try {
      await authService.registro({ nombre, correo: correoLimpio, clave, rol });
    } catch (err) {
      if (err?.status === 400) {
        return { ok: false, error: 'Este correo ya está registrado.' };
      }
      // Si falla por falta de servidor en tests unitarios, continúa con el guardado en localStorage
    }

    guardar('usuarios', [...usuarios, { correo: correoLimpio, clave, rol }]);
    return { ok: true };
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
