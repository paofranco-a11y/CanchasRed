import { useState, useEffect } from 'react';
import { canchasService, reservasService, authService } from '../services/api';

export function PanelRol({ usuario, onCanchaCreada }) {
  const [reservas, setReservas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [nuevaCancha, setNuevaCancha] = useState({
    nombre: '',
    deporte: 'fútbol',
    precio_hora: '',
    ubicacion: '',
    descripcion: '',
    imagen_url: 'src/assets/img/portfolio/canchaFutbol.jpg',
  });
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (usuario.rol === 'deportista' || usuario.rol === 'admin') {
      reservasService.misReservas().then(setReservas).catch(console.error);
    }
    if (usuario.rol === 'admin') {
      authService.listarUsuarios().then(setUsuarios).catch(console.error);
    }
  }, [usuario]);

  const handleCrearCancha = async (e) => {
    e.preventDefault();
    try {
      await canchasService.crear({
        ...nuevaCancha,
        precio_hora: Number(nuevaCancha.precio_hora),
      });
      setMensaje('¡Cancha publicada exitosamente en el catálogo!');
      setNuevaCancha({
        nombre: '',
        deporte: 'fútbol',
        precio_hora: '',
        ubicacion: '',
        descripcion: '',
        imagen_url: 'src/assets/img/portfolio/canchaFutbol.jpg',
      });
      onCanchaCreada();
    } catch (err) {
      setMensaje(`Error: ${err.message}`);
    }
  };

  const handleCancelarReserva = async (id) => {
    await reservasService.cancelar(id);
    const actualizadas = await reservasService.misReservas();
    setReservas(actualizadas);
  };

  return (
    <section className="page-section bg-light" style={{ paddingTop: '120px', minHeight: '80vh' }}>
      <div className="container">
        <h2 className="section-heading text-uppercase mb-4">
          {usuario.rol === 'deportista' && 'Mis Reservas'}
          {usuario.rol === 'dueno' && 'Panel Dueño de Cancha — Publicar Recinto'}
          {usuario.rol === 'admin' && 'Panel Administrador CanchasRed'}
        </h2>

        {mensaje && <div className="alert alert-info">{mensaje}</div>}

        {/* FORMULARIO DE PUBLICACIÓN PARA DUEÑO Y ADMIN */}
        {(usuario.rol === 'dueno' || usuario.rol === 'admin') && (
          <div className="card p-4 mb-5 shadow-sm">
            <h5>Publicar Nueva Cancha</h5>
            <form onSubmit={handleCrearCancha} className="row g-3 mt-1">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre del recinto (ej: Complejo Los Leones)"
                  required
                  value={nuevaCancha.nombre}
                  onChange={(e) => setNuevaCancha({ ...nuevaCancha, nombre: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={nuevaCancha.deporte}
                  onChange={(e) => setNuevaCancha({ ...nuevaCancha, deporte: e.target.value })}
                >
                  <option value="fútbol">Fútbol</option>
                  <option value="tenis">Tenis</option>
                  <option value="basquetbol">Basquetbol</option>
                  <option value="vóleibol">Vóleibol</option>
                  <option value="pádel">Pádel</option>
                </select>
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Precio por hora (CLP)"
                  required
                  value={nuevaCancha.precio_hora}
                  onChange={(e) => setNuevaCancha({ ...nuevaCancha, precio_hora: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Comuna / Dirección"
                  required
                  value={nuevaCancha.ubicacion}
                  onChange={(e) => setNuevaCancha({ ...nuevaCancha, ubicacion: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="URL de imagen"
                  value={nuevaCancha.imagen_url}
                  onChange={(e) => setNuevaCancha({ ...nuevaCancha, imagen_url: e.target.value })}
                />
              </div>
              <div className="col-12">
                <textarea
                  className="form-control"
                  placeholder="Descripción de la cancha (superficie, iluminación, estacionamiento...)"
                  value={nuevaCancha.descripcion}
                  onChange={(e) => setNuevaCancha({ ...nuevaCancha, descripcion: e.target.value })}
                />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary">Publicar Cancha</button>
              </div>
            </form>
          </div>
        )}

        {/* LISTADO DE RESERVAS PARA DEPORTISTA Y ADMIN */}
        {(usuario.rol === 'deportista' || usuario.rol === 'admin') && (
          <div className="card p-4 mb-4 shadow-sm">
            <h5>{usuario.rol === 'admin' ? 'Todas las Reservas de la Plataforma' : 'Historial de Mis Reservas'}</h5>
            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Duración</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((r) => (
                  <tr key={r.id}>
                    <td>{r.fecha}</td>
                    <td>{r.hora_inicio}:00 hrs</td>
                    <td>{r.duracion_horas} hr(s)</td>
                    <td>${Number(r.total_pagar).toLocaleString('es-CL')}</td>
                    <td>
                      <span className={`badge ${r.estado === 'confirmada' ? 'bg-success' : 'bg-secondary'}`}>
                        {r.estado}
                      </span>
                    </td>
                    <td>
                      {r.estado === 'confirmada' && (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleCancelarReserva(r.id)}>
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* LISTADO DE USUARIOS SOLO PARA ADMIN */}
        {usuario.rol === 'admin' && (
          <div className="card p-4 shadow-sm">
            <h5>Usuarios Registrados ({usuarios.length})</h5>
            <ul className="list-group mt-2">
              {usuarios.map((u) => (
                <li key={u.id} className="list-group-item d-flex justify-content-between">
                  <span>{u.nombre} ({u.email})</span>
                  <span className="badge bg-dark">{u.rol}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}