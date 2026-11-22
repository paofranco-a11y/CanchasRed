// import: traemos componentes visuales, el contexto de autenticación y funciones para leer datos y dar formato
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { leer } from '../utils/storage';
import { formatearPrecio } from '../utils/validators';

// Página donde el deportista puede consultar el historial de todas las canchas que ha reservado
function MisReservas() {
  // useAuth: obtiene los datos de la sesión actual; aquí sacamos el correo del deportista
  const { usuario } = useAuth();

  // Dato calculado a partir del estado: filtra las reservas de localStorage que pertenezcan solo a este usuario
  const reservas = leer('reservas', []).filter((r) => r.correoUsuario === usuario.correo);

  return (
    <>
      {/* Barra de navegación en modo oscuro fijo para que sea legible sin cabecera con foto */}
      <NavBar solido />
      <main className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
        <h1 className="mb-4">Mis Reservas</h1>

        {/* Tarjetas informativas con el total de reservas realizadas y el correo del usuario conectado */}
        <div className="row mb-4">
          <div className="col-md-6 mb-3 mb-md-0">
            <div className="card text-center p-3">
              <h3>{reservas.length}</h3>
              <p className="text-muted mb-0">Reservas realizadas</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card text-center p-3">
              <h3 className="fs-5 text-break">{usuario.correo}</h3>
              <p className="text-muted mb-0">Cuenta</p>
            </div>
          </div>
        </div>

        {/* Listado dinámico de reservas del usuario activo */}
        <div className="list-group">
          {/* .map: itera sobre cada reserva del usuario y genera un item con cancha, fecha, hora y precio */}
          {reservas.map((r) => (
            <div key={r.id} className="list-group-item">
              <strong>{r.cancha}</strong><br />
              <span className="text-muted">{r.fecha} - {r.hora} ({r.horas} hora{r.horas > 1 ? 's' : ''})</span><br />
              <span>{formatearPrecio(r.precio)} /hora</span>
            </div>
          ))}
        </div>
        {/* Mensaje que se muestra si el deportista aún no tiene ninguna reserva registrada */}
        {reservas.length === 0 && <p className="text-muted text-center py-4">Aún no tienes reservas.</p>}
      </main>
      <Footer />
    </>
  );
}

// export default: exporta el componente para que App.jsx lo registre en la ruta protegida /mis-reservas
export default MisReservas;
