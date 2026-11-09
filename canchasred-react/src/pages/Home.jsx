// import: traemos useState para la memoria de la página, componentes visuales, datos y funciones de búsqueda
import { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import MiniContacto from '../components/MiniContacto';
import CanchaCard from '../components/CanchaCard';
import FiltrosDeporte from '../components/FiltrosDeporte';
import { CANCHAS_ESTATICAS } from '../data/canchas';
import { leer } from '../utils/storage';
import { normalizar } from '../utils/validators';

// Página principal del sitio que muestra el buscador, filtros por categoría y la cuadrícula de canchas
function Home() {
  // useState: guarda en memoria la búsqueda escrita, el deporte seleccionado y las canchas guardadas en el navegador
  const [busqueda, setBusqueda] = useState('');
  const [deporte, setDeporte] = useState('Todos');
  const [guardadas] = useState(() => leer('canchas', []));

  // Datos calculados a partir del estado: unen las canchas base con las publicadas por dueños sin duplicar estado
  const todas = [...CANCHAS_ESTATICAS, ...guardadas.filter((c) => c.disponible === true)];
  const texto = normalizar(busqueda);
  // Filtra las canchas según coincidencia de texto (nombre, comuna o deporte) y el deporte activo seleccionado
  const visibles = todas.filter((c) => {
    const coincideTexto = !texto ||
      [c.nombre, c.comuna, c.deporte].some((campo) => normalizar(campo).includes(texto));
    const coincideDeporte = deporte === 'Todos' || normalizar(c.deporte) === normalizar(deporte);
    return coincideTexto && coincideDeporte;
  });

  return (
    <>
      <NavBar />
      {/* Cabecera principal con foto de fondo y caja de búsqueda en tiempo real */}
      <header className="masthead">
        <div className="container contenido-centrado">
          <div className="masthead-heading text-uppercase">Encuentra tu Cancha</div>
          <p className="masthead-subheading">Descubre las mejores canchas de deporte en tu área.</p>
          <div className="caja-busqueda">
            {/* Input controlado: lee de busqueda y actualiza el estado con e.target.value al escribir */}
            <input
              type="text"
              className="form-control"
              placeholder="Buscar canchas por ubicación o deporte"
              aria-label="Buscar canchas"
              value={busqueda}
              // e.target: es el input HTML donde el usuario teclea; actualiza el estado busqueda al instante
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Barra de filtros por deporte: le pasamos el deporte activo y la función setDeporte por props */}
      <FiltrosDeporte activo={deporte} onCambiar={setDeporte} />

      {/* Sección del catálogo con el contador y las tarjetas de las canchas que pasaron el filtro */}
      <main className="page-section" id="catalogo">
        <div className="container">
          {/* Contador dinámico que muestra cuántas canchas están visibles actualmente */}
          <p className="contador-canchas">
            {visibles.length} {visibles.length === 1 ? 'cancha disponible' : 'canchas disponibles'}
          </p>
          <div className="row">
            {/* .map: recorre cada cancha visible y dibuja una tarjeta CanchaCard pasándole sus datos por props */}
            {visibles.map((c) => <CanchaCard key={c.id} cancha={c} />)}
          </div>
          {/* Mensaje de aviso cuando la búsqueda no coincide con ninguna cancha */}
          {visibles.length === 0 && <p className="text-center text-muted">No se encontraron canchas.</p>}
        </div>
      </main>

      <MiniContacto />
      <Footer />
    </>
  );
}

// export default: permite que App.jsx importe la página Home para cargarla en la ruta raíz ('/')
export default Home;
