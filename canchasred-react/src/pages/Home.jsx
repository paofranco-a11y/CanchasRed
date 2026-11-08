import { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import MiniContacto from '../components/MiniContacto';
import CanchaCard from '../components/CanchaCard';
import FiltrosDeporte from '../components/FiltrosDeporte';
import { CANCHAS_ESTATICAS } from '../data/canchas';
import { leer } from '../utils/storage';
import { normalizar } from '../utils/validators';

function Home() {
  // Estado de la página: texto buscado y deporte activo (se pasan a los hijos por props)
  const [busqueda, setBusqueda] = useState('');
  const [deporte, setDeporte] = useState('Todos');
  const [guardadas] = useState(() => leer('canchas', []));

  // Datos derivados: se calculan en cada render, no se guardan
  const todas = [...CANCHAS_ESTATICAS, ...guardadas.filter((c) => c.disponible === true)];
  const texto = normalizar(busqueda);
  const visibles = todas.filter((c) => {
    const coincideTexto = !texto ||
      [c.nombre, c.comuna, c.deporte].some((campo) => normalizar(campo).includes(texto));
    const coincideDeporte = deporte === 'Todos' || normalizar(c.deporte) === normalizar(deporte);
    return coincideTexto && coincideDeporte;
  });

  return (
    <>
      <NavBar />
      <header className="masthead">
        <div className="container contenido-centrado">
          <div className="masthead-heading text-uppercase">Encuentra tu Cancha</div>
          <p className="masthead-subheading">Descubre las mejores canchas de deporte en tu área.</p>
          <div className="caja-busqueda">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar canchas por ubicación o deporte"
              aria-label="Buscar canchas"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
      </header>

      <FiltrosDeporte activo={deporte} onCambiar={setDeporte} />

      <main className="page-section" id="catalogo">
        <div className="container">
          <p className="contador-canchas">
            {visibles.length} {visibles.length === 1 ? 'cancha disponible' : 'canchas disponibles'}
          </p>
          <div className="row">
            {visibles.map((c) => <CanchaCard key={c.id} cancha={c} />)}
          </div>
          {visibles.length === 0 && <p className="text-center text-muted">No se encontraron canchas.</p>}
        </div>
      </main>

      <MiniContacto />
      <Footer />
    </>
  );
}

export default Home;
