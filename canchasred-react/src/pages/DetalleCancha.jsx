// import: traemos hooks de React y React Router, componentes compartidos y utilidades de almacenamiento
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

// Vista detallada de una cancha seleccionada, con opción de iniciar el proceso de reserva
function DetalleCancha() {
  // useParams: hook de React Router para leer parámetros de la URL; saca el 'id' de la ruta /cancha/:id
  const { id } = useParams();
  // useAuth: hook personalizado que nos entrega los datos del usuario que tiene la sesión iniciada
  const { usuario } = useAuth();
  // useNavigate: función para redirigir al usuario a otra página por código (ej: hacia /login o /mis-reservas)
  const navigate = useNavigate();
  // useState: guarda si el modal de reserva está abierto o cerrado, y mensajes de advertencia si no puede reservar
  const [modalAbierto, setModalAbierto] = useState(false);
  const [aviso, setAviso] = useState('');

  // Dato calculado a partir del estado: busca la cancha en la lista estática y en las creadas por los dueños
  const cancha = [...CANCHAS_ESTATICAS, ...leer('canchas', [])].find((c) => c.id === id);

  // Valida que el usuario tenga sesión y sea deportista antes de abrir la ventana modal de reserva
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

  // Guarda la reserva en localStorage asociada al correo del usuario y redirige a la vista Mis Reservas
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
      {/* Barra de navegación sólida para que el texto blanco contraste sobre fondo oscuro */}
      <NavBar solido />
      <main className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
        {/* Si la cancha no existe en la lista muestra un aviso amigable y un botón para volver al inicio */}
        {!cancha ? (
          <div className="text-center py-5">
            <p className="text-muted">No encontramos esta cancha.</p>
            <Link to="/" className="btn btn-primary">Volver al inicio</Link>
          </div>
        ) : (
          /* Cuadrícula responsiva: imagen grande a la izquierda y datos con botón a la derecha */
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
              {/* Botón que ejecuta la comprobación de sesión y rol al hacer clic */}
              <button type="button" className="btn btn-primary btn-lg" onClick={reservar}>Reservar</button>
              {/* Mensaje de advertencia si un dueño o usuario sin permiso intenta reservar */}
              {aviso && <div className="text-danger mt-3">{aviso}</div>}
            </div>
          </div>
        )}
      </main>

      {/* Renderizado condicional: muestra el modal solo si el estado modalAbierto es verdadero */}
      {modalAbierto && (
        <ReservaModal cancha={cancha} onConfirmar={confirmar} onCerrar={() => setModalAbierto(false)} />
      )}

      <MiniContacto />
      <Footer />
    </>
  );
}

// export default: exporta la página para que el router la cargue cuando la URL sea /cancha/:id
export default DetalleCancha;
