import { useState, useEffect } from 'react';
import { TarjetaCancha } from './TarjetaCancha';
import { canchasService, reservasService } from '../services/api';

const DEPORTES = [
  { id: 'todos', label: 'Todos' },
  { id: 'fútbol', label: 'Fútbol' },
  { id: 'tenis', label: 'Tenis' },
  { id: 'basquetbol', label: 'Basquetbol' },
  { id: 'vóleibol', label: 'Vóleibol' },
  { id: 'pádel', label: 'Pádel' },
];

export function Catalogo({ usuario, onAbrirAuth, recargarTrigger }) {
  const [canchas, setCanchas] = useState([]);
  const [filtroActivo, setFiltroActivo] = useState('todos');
  const [cargando, setCargando] = useState(true);
  const [canchaAReservar, setCanchaAReservar] = useState(null);
  const [reservaForm, setReservaForm] = useState({ fecha: '', hora_inicio: 18, duracion_horas: 1 });
  const [mensajeFeedback, setMensajeFeedback] = useState(null);

  const cargarCanchas = async (deporte = filtroActivo) => {
    setCargando(true);
    try {
      const data = await canchasService.listar(deporte);
      setCanchas(data);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCanchas(filtroActivo);
  }, [filtroActivo, recargarTrigger]);

  const handleReservarClick = (cancha) => {
    if (!usuario) {
      onAbrirAuth();
      return;
    }
    setCanchaAReservar(cancha);
    setMensajeFeedback(null);
  };

  const confirmarReserva = async (e) => {
    e.preventDefault();
    try {
      await reservasService.crear({
        cancha_id: canchaAReservar.id,
        fecha: reservaForm.fecha,
        hora_inicio: Number(reservaForm.hora_inicio),
        duracion_horas: Number(reservaForm.duracion_horas),
      });
      setMensajeFeedback({ tipo: 'success', texto: '¡Reserva confirmada con éxito!' });
      setCanchaAReservar(null);
    } catch (err) {
      setMensajeFeedback({ tipo: 'danger', texto: err.message });
    }
  };

  const handleEliminarCancha = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta cancha?')) return;
    try {
      await canchasService.eliminar(id);
      cargarCanchas();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <main className="page-section" id="catalogo">
      <nav className="barra-filtros text-center py-3" aria-label="Filtros por deporte">
        <div className="container">
          {DEPORTES.map((dep) => (
            <button
              key={dep.id}
              type="button"
              className={`btn me-2 mb-2 btn-filtro ${
                filtroActivo === dep.id ? 'btn-primary' : 'btn-outline-primary'
              }`}
              onClick={() => setFiltroActivo(dep.id)}
            >
              {dep.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="container text-start">
        {mensajeFeedback && (
          <div className={`alert alert-${mensajeFeedback.tipo} alert-dismissible`}>
            {mensajeFeedback.texto}
            <button type="button" className="btn-close" onClick={() => setMensajeFeedback(null)}></button>
          </div>
        )}

        <p className="contador-canchas">
          {cargando
            ? 'Cargando canchas...'
            : canchas.length === 1
            ? '1 cancha disponible'
            : `${canchas.length} canchas disponibles`}
        </p>

        <div className="row" id="contenedorCanchas">
          {canchas.map((cancha) => (
            <TarjetaCancha
              key={cancha.id}
              nombre={cancha.nombre}
              comuna={cancha.ubicacion}
              deporte={cancha.deporte}
              descripcion={cancha.descripcion || 'Recinto deportivo disponible en CanchasRed.'}
              precio={`$${Number(cancha.precio_hora).toLocaleString('es-CL')}`}
              imagen={cancha.imagen_url || 'src/assets/img/portfolio/canchaTenis.png'}
              rol={usuario?.rol}
              onReservar={() => handleReservarClick(cancha)}
              onEliminar={() => handleEliminarCancha(cancha.id)}
            />
          ))}
        </div>

        {canchaAReservar && (
          <div className="card p-4 mt-4 border-primary shadow">
            <h5>Reservar: {canchaAReservar.nombre} (${Number(canchaAReservar.precio_hora).toLocaleString('es-CL')}/hr)</h5>
            <form onSubmit={confirmarReserva} className="row g-3 mt-1">
              <div className="col-md-4">
                <label className="form-label">Fecha</label>
                <input
                  type="date"
                  className="form-control"
                  required
                  value={reservaForm.fecha}
                  onChange={(e) => setReservaForm({ ...reservaForm, fecha: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Hora Inicio (8 a 22 hrs)</label>
                <input
                  type="number"
                  min="8"
                  max="22"
                  className="form-control"
                  required
                  value={reservaForm.hora_inicio}
                  onChange={(e) => setReservaForm({ ...reservaForm, hora_inicio: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Duración (horas)</label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  className="form-control"
                  required
                  value={reservaForm.duracion_horas}
                  onChange={(e) => setReservaForm({ ...reservaForm, duracion_horas: e.target.value })}
                />
              </div>
              <div className="col-12 d-flex gap-2">
                <button type="submit" className="btn btn-primary">Confirmar y Pagar</button>
                <button type="button" className="btn btn-secondary" onClick={() => setCanchaAReservar(null)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}