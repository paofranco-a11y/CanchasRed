import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import MiniContacto from '../components/MiniContacto';
import ReservaModal from '../components/ReservaModal';
import { useAuth } from '../context/AuthContext';
import { CANCHAS_ESTATICAS, IMAGEN_POR_DEFECTO } from '../data/canchas';
import { leer, guardar } from '../utils/storage';
import { formatearPrecio } from '../utils/validators';

function DetalleCancha() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [aviso, setAviso] = useState('');

  // La cancha se busca siempre por id (estáticas + guardadas por dueños)
  const cancha = [...CANCHAS_ESTATICAS, ...leer('canchas', [])].find((c) => c.id === id);

  const reservar = () => {
    if (!usuario) {
      alert('Debes iniciar sesión para reservar una cancha.');
      navigate('/login');
      return;
    }
    if (usuario.rol !== 'deportista') {
      setAviso('Solo los deportistas pueden reservar.');
      return;
    }
    setAviso('');
    setModalAbierto(true);
  };

  const confirmar = ({ fecha, hora, horas }) => {
    const reservas = leer('reservas', []);
    guardar('reservas', [
      ...reservas,
      {
        id: Date.now().toString(),
        canchaId: cancha.id,
        cancha: cancha.nombre,
        precio: cancha.precio,
        fecha,
        hora,
        horas,
        correoUsuario: usuario.correo,
      },
    ]);
    setModalAbierto(false);
    alert('¡Reserva confirmada!');
    navigate('/mis-reservas');
  };

  return (
    <>
      <NavBar solido />
      <main className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
        {!cancha ? (
          <div className="text-center py-5">
            <p className="text-muted">No encontramos esta cancha.</p>
            <Link to="/" className="btn btn-primary">Volver al inicio</Link>
          </div>
        ) : (
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <img src={cancha.imagen || IMAGEN_POR_DEFECTO} alt={cancha.nombre} className="img-fluid rounded"
                style={{ width: '100%', maxHeight: '420px', objectFit: 'cover' }} />
            </div>
            <div className="col-lg-5">
              <span className="badge bg-success mb-2">{cancha.deporte}</span>
              <h1 className="mb-1">{cancha.nombre}</h1>
              <p className="text-muted">{cancha.comuna}</p>
              <p className="mb-4">{cancha.descripcion}</p>
              <h3 className="mb-4"><strong>{formatearPrecio(cancha.precio)}</strong> <span className="text-muted fs-6">/hora</span></h3>
              <button type="button" className="btn btn-primary btn-lg" onClick={reservar}>Reservar</button>
              {aviso && <div className="text-danger mt-3">{aviso}</div>}
            </div>
          </div>
        )}
      </main>

      {modalAbierto && (
        <ReservaModal cancha={cancha} onConfirmar={confirmar} onCerrar={() => setModalAbierto(false)} />
      )}

      <MiniContacto />
      <Footer />
    </>
  );
}

export default DetalleCancha;
