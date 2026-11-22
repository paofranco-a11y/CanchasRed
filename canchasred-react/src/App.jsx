import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Nosotros from './pages/Nosotros';
import Blogs from './pages/Blogs';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Registro from './pages/Registro';
import DetalleCancha from './pages/DetalleCancha';
import MisReservas from './pages/MisReservas';
import PerfilDueno from './pages/PerfilDueno';
import ActividadAdmin from './pages/ActividadAdmin';
import Usuarios from './pages/Usuarios';
import Analiticas from './pages/Analiticas';
import NotFound from './pages/NotFound';

/**
 * Componente principal de la estructura de la aplicación.
 * Define la navegación y el árbol de rutas públicas y privadas (mediante React Router),
 * envolviendo la estructura dentro del AuthProvider para dar acceso global al estado de sesión.
 * Contiene la distribución visual base integrando el <NavBar> en la parte superior y <Footer> en el pie de página.
 */
function App() {
  const { pathname } = useLocation();

  // Al cambiar de página volvemos arriba
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/cancha/:id" element={<DetalleCancha />} />
        <Route path="/mis-reservas" element={<ProtectedRoute rol="deportista"><MisReservas /></ProtectedRoute>} />
        <Route path="/perfil-dueno" element={<ProtectedRoute rol="dueno"><PerfilDueno /></ProtectedRoute>} />
        <Route path="/actividad-admin" element={<ProtectedRoute rol="admin"><ActividadAdmin /></ProtectedRoute>} />
        <Route path="/usuarios" element={<ProtectedRoute rol="admin"><Usuarios /></ProtectedRoute>} />
        <Route path="/analiticas" element={<ProtectedRoute rol="admin"><Analiticas /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
