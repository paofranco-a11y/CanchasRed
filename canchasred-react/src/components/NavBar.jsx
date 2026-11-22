import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/img/logos/LogoCancha.svg';


/**
 * Componente de barra de navegación superior.
 * Muestra dinámicamente las opciones del menú según el estado de la sesión y el rol del usuario
 * (invitado, cliente, dueño de cancha). Permite acceder al login, registro, perfil del dueño y cerrar sesión.
 */

// Barra de navegación. Prop "solido": navbar siempre oscuro (páginas sin hero).
function NavBar({ solido = false }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(false);   // menú colapsable en móvil
  const [encogido, setEncogido] = useState(false); // navbar-shrink al hacer scroll

  // Igual que js/scripts.js: al hacer scroll el navbar se encoge y oscurece
  useEffect(() => {
    const alScroll = () => setEncogido(window.scrollY !== 0);
    alScroll();
    document.addEventListener('scroll', alScroll);
    return () => document.removeEventListener('scroll', alScroll);
  }, []);

  const cerrar = () => setAbierto(false);

  const salir = (e) => {
    e.preventDefault();
    cerrar();
    logout();
    navigate('/');
  };

  const rol = usuario?.rol;

  const nav = (
    <nav
      className={'navbar navbar-expand-lg navbar-dark fixed-top' + (encogido ? ' navbar-shrink' : '')}
      id="mainNav"
    >
      <div className="container">
        <Link className="navbar-brand" to={rol === 'dueno' ? '/perfil-dueno' : '/'} onClick={cerrar}>
          <img src={logo} alt="Logo CanchasRed" className="logo-navbar" /> CanchasRed
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarResponsive"
          aria-expanded={abierto}
          aria-label="Toggle navigation"
          onClick={() => setAbierto(!abierto)}
        >
          Menu <i className="fas fa-bars ms-1"></i>
        </button>
        <div className={'collapse navbar-collapse' + (abierto ? ' show' : '')} id="navbarResponsive">
          <ul className="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/" onClick={cerrar}>Inicio</Link></li>
            {!usuario && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/nosotros" onClick={cerrar}>Nosotros</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/blogs" onClick={cerrar}>Blog</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/contacto" onClick={cerrar}>Contacto</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/login" onClick={cerrar}>Iniciar sesión / Registrarse</Link></li>
              </>
            )}
            {rol === 'deportista' && (
              <li className="nav-item"><Link className="nav-link" to="/mis-reservas" onClick={cerrar}>Mis Reservas</Link></li>
            )}
            {rol === 'dueno' && (
              <li className="nav-item"><Link className="nav-link" to="/perfil-dueno" onClick={cerrar}>Mi Perfil</Link></li>
            )}
            {rol === 'admin' && (
              <li className="nav-item"><Link className="nav-link" to="/actividad-admin" onClick={cerrar}>Panel Admin</Link></li>
            )}
            {usuario && (
              <li className="nav-item"><a className="nav-link" href="#" onClick={salir}>Salir</a></li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );

  // La clase pagina-nav-estatico (styles2.css) fuerza el fondo oscuro
  return solido ? <div className="pagina-nav-estatico">{nav}</div> : nav;
}

export default NavBar;
