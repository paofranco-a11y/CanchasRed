import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


/**
 * Componente del pie de página de la aplicación.
 * Muestra información institucional, enlaces de navegación secundarios, datos de contacto
 * y derechos de autor. Es visible en todas las páginas de la plataforma.
 */

// Pie de página con enlaces según el rol. Prop "simple": pie de login/registro.
function Footer({ simple = false }) {
  const { usuario } = useAuth();
  const rol = usuario?.rol;

  if (simple) {
    return (
      <footer className="pie-pagina">
        <p>&copy; 2026 CanchasRed - Paola Franco &amp; Alejandra Ruiz. Todos los derechos reservados.</p>
      </footer>
    );
  }

  return (
    <footer className="footer py-4">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-4 text-lg-start">Copyright &copy; CanchasRed 2024</div>
          <div className="col-lg-4 my-3 my-lg-0">
            <a className="btn btn-dark btn-social mx-2" href="#!" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a className="btn btn-dark btn-social mx-2" href="#!" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a className="btn btn-dark btn-social mx-2" href="#!" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <div className="col-lg-4 text-lg-end">
            <Link to="/" className="link-dark text-decoration-none me-3">Inicio</Link>
            {!usuario && (
              <>
                <Link to="/nosotros" className="link-dark text-decoration-none me-3">Nosotros</Link>
                <Link to="/contacto" className="link-dark text-decoration-none me-3">Contacto</Link>
                <Link to="/blogs" className="link-dark text-decoration-none me-3">Blog</Link>
              </>
            )}
            {rol === 'deportista' && <Link to="/mis-reservas" className="link-dark text-decoration-none">Mis Reservas</Link>}
            {rol === 'dueno' && <Link to="/perfil-dueno" className="link-dark text-decoration-none">Mi Perfil</Link>}
            {rol === 'admin' && <Link to="/actividad-admin" className="link-dark text-decoration-none">Panel Admin</Link>}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
