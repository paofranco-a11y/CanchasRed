import { useState, useEffect } from 'react';

export function Navbar({ usuario, onAbrirAuth, onCerrarSesion, vistaActual, setVistaActual }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const etiquetasRol = {
    deportista: 'Deportista',
    dueno: 'Dueño de Cancha',
    admin: 'Administrador',
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark fixed-top ${isScrolled ? 'navbar-shrink' : ''}`} id="mainNav">
      <div className="container-fluid px-4">
        <a
          className="navbar-brand"
          href="#page-top"
          onClick={(e) => { e.preventDefault(); setVistaActual('inicio'); }}
        >
          <img src="src/assets/img/logos/LogoCancha.svg" alt="Logo CanchasRed" className="logo-navbar" /> CanchasRed
        </a>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive">
          Menu <i className="fas fa-bars ms-1"></i>
        </button>

        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav text-uppercase ms-auto py-4 py-lg-0 align-items-lg-center">
            <li className="nav-item">
              <a
                className={`nav-link ${vistaActual === 'inicio' ? 'active' : ''}`}
                href="#catalogo"
                onClick={() => setVistaActual('inicio')}
              >
                Catálogo
              </a>
            </li>

            {usuario && (
              <li className="nav-item">
                <a
                  className={`nav-link ${vistaActual === 'panel' ? 'active text-warning' : ''}`}
                  href="#panel"
                  onClick={(e) => { e.preventDefault(); setVistaActual('panel'); }}
                >
                  {usuario.rol === 'deportista' && 'Mis Reservas'}
                  {usuario.rol === 'dueno' && 'Gestionar Mis Canchas'}
                  {usuario.rol === 'admin' && 'Panel Administrador'}
                </a>
              </li>
            )}

            <li className="nav-item">
              <a className="nav-link" href="#mini-contacto" onClick={() => setVistaActual('inicio')}>
                Contacto
              </a>
            </li>

            {!usuario ? (
              <li className="nav-item ms-lg-2">
                <button className="btn btn-primary btn-sm text-uppercase" onClick={onAbrirAuth}>
                  Iniciar sesión / Registrarse
                </button>
              </li>
            ) : (
              <li className="nav-item ms-lg-3 d-flex align-items-center gap-2">
                <span className="badge bg-warning text-dark">
                  {usuario.nombre} ({etiquetasRol[usuario.rol] || usuario.rol})
                </span>
                <button className="btn btn-outline-light btn-sm" onClick={onCerrarSesion}>
                  Salir
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}