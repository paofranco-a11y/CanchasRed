import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Catalogo } from './components/Catalogo';
import { Formulario } from './components/Formulario';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { PanelRol } from './components/PanelRol';
import { AdminDashboard } from './components/AdminDashboard';
import { authService } from './services/api';
import './css/styles.css';
import './css/style2.css';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [mostrarAuth, setMostrarAuth] = useState(false);
  const [vistaActual, setVistaActual] = useState('inicio'); // 'inicio' | 'panel'
  const [recargarCanchas, setRecargarCanchas] = useState(0);

  useEffect(() => {
    const sesionGuardada = authService.getUsuarioActual();
    if (sesionGuardada) setUsuario(sesionGuardada);
  }, []);

  const handleCerrarSesion = () => {
    authService.logout();
    setUsuario(null);
    setVistaActual('inicio');
  };

  // Vista exclusiva del Administrador con Sidebar
  if (vistaActual === 'panel' && usuario?.rol === 'admin') {
    return (
      <AdminDashboard
        usuario={usuario}
        onVolverCatalogo={() => setVistaActual('inicio')}
        onCerrarSesion={handleCerrarSesion}
      />
    );
  }

  return (
    <div id="page-top" className={mostrarAuth || vistaActual === 'panel' ? 'pagina-nav-estatico' : ''}>
      <Navbar
        usuario={usuario}
        onAbrirAuth={() => setMostrarAuth(true)}
        onCerrarSesion={handleCerrarSesion}
        vistaActual={vistaActual}
        setVistaActual={(vista) => {
          setMostrarAuth(false);
          setVistaActual(vista);
        }}
      />

      {mostrarAuth ? (
        <AuthModal
          visible={mostrarAuth}
          onCerrar={() => setMostrarAuth(false)}
          onLoginExitoso={(datosUsuario) => {
            setUsuario(datosUsuario);
            setMostrarAuth(false);
            if (datosUsuario.rol === 'admin') setVistaActual('panel');
          }}
        />
      ) : vistaActual === 'panel' && usuario ? (
        <PanelRol
          usuario={usuario}
          onCanchaCreada={() => setRecargarCanchas((prev) => prev + 1)}
        />
      ) : (
        <>
          <Hero />
          <Catalogo
            usuario={usuario}
            onAbrirAuth={() => setMostrarAuth(true)}
            recargarTrigger={recargarCanchas}
          />
          <Formulario />
        </>
      )}

      <Footer />
    </div>
  );
}