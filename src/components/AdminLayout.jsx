// import trae herramientas de React o librerías externas para usarlas en este archivo.
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/admin.css';

// Componente plantilla para la administración. props son datos o contenido que nos pasa el padre; aquí { children } es la página que va adentro.
function AdminLayout({ children }) {
  // Sacamos los datos de la sesión del admin y la función para redirigir a otra página.
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  // Función que se activa al hacer clic en Salir: cierra la sesión y manda al usuario a la portada.
  const salir = (e) => {
    e.preventDefault(); // Evitamos que el enlace '#' recargue la página.
    logout();
    navigate('/');
  };

  // El return entrega el HTML (JSX) que el navegador va a pintar en pantalla.
  return (
    <div className="d-flex flex-column flex-md-row">
      {/* Menú lateral fijo a la izquierda con enlaces a las tres secciones del panel */}
      <nav className="sidebar d-flex flex-column flex-shrink-0 p-3 bg-light border-end position-sticky top-0">
        <form className="mb-3" role="search" onSubmit={(e) => e.preventDefault()}>
          <input className="form-control" type="search" placeholder="Search..." aria-label="Search" />
        </form>

        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            {/* Link cambia de ruta en el navegador sin recargar toda la página web */}
            <Link to="/actividad-admin" className="nav-link d-flex align-items-center gap-2 text-dark">
              <i className="bi bi-house"></i> Resumen
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/usuarios" className="nav-link d-flex align-items-center gap-2 text-dark">
              <i className="bi bi-people"></i> Usuarios
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/analiticas" className="nav-link d-flex align-items-center gap-2 text-dark">
              <i className="bi bi-bar-chart"></i> Analíticas
            </Link>
          </li>
        </ul>

        <hr />

        {/* Zona inferior del menú con el correo del admin autenticado y el botón de salida */}
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="fw-semibold small">ADMIN</div>
            {/* Mostramos el correo del admin que está guardado en el contexto */}
            <div className="text-muted small text-break">{usuario?.correo}</div>
          </div>
          <a href="#" className="btn btn-sm btn-outline-secondary" onClick={salir}>Salir</a>
        </div>
      </nav>

      {/* Aquí se incrusta el contenido hijo específico de cada pantalla administrativa */}
      <main className="flex-grow-1 p-4">{children}</main>
    </div>
  );
}

// export default permite que otros archivos puedan importar y reutilizar este componente.
export default AdminLayout;
