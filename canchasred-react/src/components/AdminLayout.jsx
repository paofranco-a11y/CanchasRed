import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/admin.css';

// Estructura común de las páginas de administración: barra lateral + contenido (children).
function AdminLayout({ children }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const salir = (e) => {
    e.preventDefault();
    logout();
    navigate('/');
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      <nav className="sidebar d-flex flex-column flex-shrink-0 p-3 bg-light border-end position-sticky top-0">
        <form className="mb-3" role="search" onSubmit={(e) => e.preventDefault()}>
          <input className="form-control" type="search" placeholder="Search..." aria-label="Search" />
        </form>

        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
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

        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="fw-semibold small">ADMIN</div>
            <div className="text-muted small text-break">{usuario?.correo}</div>
          </div>
          <a href="#" className="btn btn-sm btn-outline-secondary" onClick={salir}>Salir</a>
        </div>
      </nav>

      <main className="flex-grow-1 p-4">{children}</main>
    </div>
  );
}

export default AdminLayout;
