import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente Wrapper para la protección de rutas.
 * Verifica si el usuario actual está autenticado y si cuenta con los permisos o roles necesarios (ej. 'dueno').
 * Si cumple los requisitos, renderiza el contenido protegido; de lo contrario, redirige al usuario a la página de login.
 */

// Protege una ruta: sin sesión (o con otro rol) redirige a /login
function ProtectedRoute({ rol, children }) {
  const { usuario } = useAuth();

  if (!usuario || (rol && usuario.rol !== rol)) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;
