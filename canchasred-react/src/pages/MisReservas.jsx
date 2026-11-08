import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { leer } from '../utils/storage';
import { formatearPrecio } from '../utils/validators';

function MisReservas() {
  const { usuario } = useAuth();

  // Solo las reservas del correo con sesión
  const reservas = leer('reservas', []).filter((r) => r.correoUsuario === usuario.correo);

  return (
    <>
      <NavBar solido />
      <main className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
        <h1 className="mb-4">Mis Reservas</h1>

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

        <div className="list-group">
          {reservas.map((r) => (
            <div key={r.id} className="list-group-item">
              <strong>{r.cancha}</strong><br />
              <span className="text-muted">{r.fecha} - {r.hora} ({r.horas} hora{r.horas > 1 ? 's' : ''})</span><br />
              <span>{formatearPrecio(r.precio)} /hora</span>
            </div>
          ))}
        </div>
        {reservas.length === 0 && <p className="text-muted text-center py-4">Aún no tienes reservas.</p>}
      </main>
      <Footer />
    </>
  );
}

export default MisReservas;
