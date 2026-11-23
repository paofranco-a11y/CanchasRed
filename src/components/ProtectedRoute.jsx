import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protege una ruta: sin sesión (o con otro rol) redirige a /login
function ProtectedRoute({ rol, children }) {
  const { usuario } = useAuth();

  if (!usuario || (rol && usuario.rol !== rol)) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;
