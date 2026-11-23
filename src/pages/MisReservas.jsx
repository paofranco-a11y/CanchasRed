// import: traemos hooks de React, componentes visuales, contexto de autenticación, servicios API y utilidades
import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { CANCHAS_ESTATICAS } from '../data/canchas';
import { leer } from '../utils/storage';
import { formatearPrecio } from '../utils/validators';
import { reservasService, canchasService } from '../services/api';

// Página donde el deportista puede consultar el historial de todas las canchas que ha reservado
function MisReservas() {
  // useAuth: obtiene los datos de la sesión actual; aquí sacamos el correo y token del deportista
  const { usuario } = useAuth();
  const [reservasRemotas, setReservasRemotas] = useState(null);

  // useEffect: si hay sesión con token JWT, consulta las reservas reales del deportista en FastAPI
  useEffect(() => {
    if (!usuario?.token) return;
    let activo = true;

    Promise.all([
      reservasService.misReservas(),
      canchasService.listar().catch(() => leer('canchas_api', [])),
    ])
      .then(([listaReservas, listaCanchas]) => {
        if (!activo) return;
        const catalogo = [...listaCanchas, ...leer('canchas_api', []), ...CANCHAS_ESTATICAS, ...leer('canchas', [])];
        const mapeadas = listaReservas.map((r) => {
          const canchaInfo = catalogo.find((c) => c.id === r.cancha_id);
          const horas = Number(r.duracion_horas) || 1;
          const precioHora = canchaInfo?.precio || Math.round((Number(r.total_pagar) || 0) / horas);
          return {
            id: r.id,
            canchaId: r.cancha_id,
            cancha: canchaInfo?.nombre || `Cancha #${String(r.cancha_id).slice(-4)}`,
            precio: precioHora,
            fecha: r.fecha,
            hora: `${String(r.hora_inicio).padStart(2, '0')}:00`,
            horas,
            estado: r.estado,
            correoUsuario: usuario.correo,
          };
        });
        setReservasRemotas(mapeadas);
      })
      .catch(() => {
        // Si falla la red, se mantiene el respaldo de localStorage
      });

    return () => { activo = false; };
  }, [usuario]);

  // Cancela una reserva activa en el backend y actualiza el estado en pantalla
  const cancelarReserva = async (idReserva) => {
    try {
      await reservasService.cancelar(idReserva);
      setReservasRemotas((prev) =>
        prev ? prev.map((r) => (r.id === idReserva ? { ...r, estado: 'cancelada' } : r)) : prev
      );
    } catch (err) {
      alert(err.message || 'No se pudo cancelar la reserva.');
    }
  };

  // Dato calculado a partir del estado: usa las reservas del backend si están disponibles o las de localStorage
  const reservasLocales = leer('reservas', []).filter((r) => r.correoUsuario === usuario.correo);
  const reservas = reservasRemotas !== null ? reservasRemotas : reservasLocales;

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
            <div key={r.id} className="list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <strong>{r.cancha}</strong>
                {r.estado && (
                  <span className={`badge ms-2 ${r.estado === 'cancelada' ? 'bg-danger' : 'bg-success'}`}>
                    {r.estado}
                  </span>
                )}
                <br />
                <span className="text-muted">{r.fecha} - {r.hora} ({r.horas} hora{r.horas > 1 ? 's' : ''})</span><br />
                <span>{formatearPrecio(r.precio)} /hora</span>
              </div>
              {r.estado === 'confirmada' && usuario?.token && (
                <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => cancelarReserva(r.id)}>
                  Cancelar reserva
                </button>
              )}
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
