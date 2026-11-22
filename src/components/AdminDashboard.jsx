import { useState, useEffect } from 'react';
import { authService, canchasService, reservasService } from '../services/api';

export function AdminDashboard({ usuario, onVolverCatalogo, onCerrarSesion }) {
  const [seccion, setSeccion] = useState('resumen'); // 'resumen' | 'usuarios' | 'analiticas'
  const [usuarios, setUsuarios] = useState([]);
  const [canchas, setCanchas] = useState([]);
  const [reservas, setReservas] = useState([]);

  // Filtros y edición para la pestaña Usuarios
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('todos');
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  useEffect(() => {
    Promise.all([
      authService.listarUsuarios().catch(() => []),
      canchasService.listar().catch(() => []),
      reservasService.misReservas().catch(() => []),
    ]).then(([listaUsuarios, listaCanchas, listaReservas]) => {
      setUsuarios(listaUsuarios);
      setCanchas(listaCanchas);
      setReservas(listaReservas);
    });
  }, []);

  // Handlers de edición y eliminación de usuarios
  const handleGuardarEdicion = async (e) => {
    e.preventDefault();
    try {
      const actualizado = await authService.actualizarUsuario(usuarioEditando.id, {
        nombre: usuarioEditando.nombre,
        rol: usuarioEditando.rol,
        telefono: usuarioEditando.telefono,
      });
      setUsuarios((prev) =>
        prev.map((u) => (u.id === actualizado.id ? actualizado : u))
      );
      setUsuarioEditando(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEliminarUsuario = async (id, nombre) => {
    if (!window.confirm(`¿Seguro que deseas eliminar al usuario "${nombre}"?`)) return;
    try {
      await authService.eliminarUsuario(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Cálculos reales desde MongoDB
  const ingresosTotales = reservas
    .filter((r) => r.estado === 'confirmada')
    .reduce((acc, r) => acc + Number(r.total_pagar || 0), 0);

  const ticketPromedio =
    reservas.length > 0 ? Math.round(ingresosTotales / reservas.length) : 0;

  // Filtrado en tiempo real de usuarios
  const usuariosFiltrados = usuarios.filter((u) => {
    const coincideTexto =
      u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email?.toLowerCase().includes(busqueda.toLowerCase());
    const coincideRol =
      filtroRol === 'todos' ||
      u.rol === filtroRol ||
      (filtroRol === 'deportista' && u.rol === 'jugador');
    return coincideTexto && coincideRol;
  });

  // Top canchas calculado dinámicamente
  const topCanchas = canchas.map((c) => {
    const reservasCancha = reservas.filter((r) => r.cancha_id === c.id);
    const ingresos = reservasCancha.reduce((acc, r) => acc + Number(r.total_pagar || 0), 0);
    return {
      id: c.id,
      nombre: c.nombre,
      reservasCount: reservasCancha.length,
      ingresos,
    };
  });

  return (
    <div className="admin-layout">
      {/* SIDEBAR IZQUIERDO */}
      <aside className="admin-sidebar">
        <div>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              if (seccion !== 'usuarios') setSeccion('usuarios');
            }}
          />

          <button
            className={`admin-nav-item ${seccion === 'resumen' ? 'active' : ''}`}
            onClick={() => setSeccion('resumen')}
          >
            <span></span> Resumen
          </button>

          <button
            className={`admin-nav-item ${seccion === 'usuarios' ? 'active' : ''}`}
            onClick={() => setSeccion('usuarios')}
          >
            <span></span> Usuarios
          </button>

          <button
            className={`admin-nav-item ${seccion === 'analiticas' ? 'active' : ''}`}
            onClick={() => setSeccion('analiticas')}
          >
            <span></span> Analíticas
          </button>

          <hr className="my-3" />

          <button className="admin-nav-item text-primary" onClick={onVolverCatalogo}>
            <span>←</span> Ir al Sitio Público
          </button>
        </div>

        <div className="admin-sidebar-footer">
          <div className="fw-bold text-dark">ADMIN</div>
          <div className="text-truncate mb-2">{usuario?.nombre}</div>
          <button className="btn btn-outline-secondary btn-sm w-100" onClick={onCerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="admin-main">
        {/* ==================== VISTA 1: RESUMEN / ACTIVIDAD ==================== */}
        {seccion === 'resumen' && (
          <>
            <h1 className="admin-title">Actividad</h1>
            <p className="admin-subtitle">Resumen general de la plataforma.</p>

            <div className="row g-3">
              <div className="col-md-3">
                <div className="kpi-card">
                  <div className="kpi-label">USUARIOS TOTALES</div>
                  <div className="kpi-value">{usuarios.length}</div>
                  <div className="kpi-trend">+{usuarios.length} registrados</div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="kpi-card">
                  <div className="kpi-label">CANCHAS PUBLICADAS</div>
                  <div className="kpi-value">{canchas.length}</div>
                  <div className="kpi-trend">Activas en catálogo</div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="kpi-card">
                  <div className="kpi-label">RESERVAS TOTALES</div>
                  <div className="kpi-value">{reservas.length}</div>
                  <div className="kpi-trend">En tiempo real</div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="kpi-card">
                  <div className="kpi-label">INGRESOS TOTALES</div>
                  <div className="kpi-value">
                    ${ingresosTotales.toLocaleString('es-CL')}
                  </div>
                  <div className="kpi-trend">CLP acumulados</div>
                </div>
              </div>
            </div>

            <div className="admin-box">
              <div className="admin-box-header">Actividad reciente</div>
              <table className="admin-table">
                <tbody>
                  {usuarios.slice(-3).reverse().map((u) => (
                    <tr key={u.id}>
                      <td>Usuario registrado — {u.nombre} ({u.rol})</td>
                      <td className="text-end text-muted small">MongoDB Atlas</td>
                    </tr>
                  ))}
                  {canchas.slice(-2).reverse().map((c) => (
                    <tr key={c.id}>
                      <td>Cancha publicada — {c.nombre} ({c.deporte})</td>
                      <td className="text-end text-muted small">${Number(c.precio_hora).toLocaleString('es-CL')}/hr</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ==================== VISTA 2: USUARIOS ==================== */}
        {seccion === 'usuarios' && (
          <>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h1 className="admin-title">Usuarios ({usuarios.length})</h1>
                <p className="admin-subtitle">Administrar usuarios y rol.</p>
              </div>
            </div>

            <div className="d-flex gap-2 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by email or Name"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <select
                className="form-select"
                style={{ maxWidth: '200px' }}
                value={filtroRol}
                onChange={(e) => setFiltroRol(e.target.value)}
              >
                <option value="todos">Todos los roles</option>
                <option value="admin">Admin</option>
                <option value="dueno">Dueño</option>
                <option value="deportista">Deportista</option>
              </select>
            </div>

            {/* Formulario rápido cuando haces clic en Editar */}
            {usuarioEditando && (
              <form onSubmit={handleGuardarEdicion} className="card p-3 mb-3 border-dark">
                <h6 className="fw-bold mb-2">Editando usuario: {usuarioEditando.email}</h6>
                <div className="row g-2 align-items-end">
                  <div className="col-md-4">
                    <label className="form-label small mb-1">Nombre</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={usuarioEditando.nombre}
                      onChange={(e) =>
                        setUsuarioEditando({ ...usuarioEditando, nombre: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small mb-1">Rol</label>
                    <select
                      className="form-select form-select-sm"
                      value={usuarioEditando.rol}
                      onChange={(e) =>
                        setUsuarioEditando({ ...usuarioEditando, rol: e.target.value })
                      }
                    >
                      <option value="deportista">Deportista</option>
                      <option value="dueno">Dueño</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small mb-1">Teléfono</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={usuarioEditando.telefono || ''}
                      onChange={(e) =>
                        setUsuarioEditando({ ...usuarioEditando, telefono: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-2 d-flex gap-1">
                    <button type="submit" className="btn btn-dark btn-sm w-100">
                      Guardar
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setUsuarioEditando(null)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </form>
            )}

            <div className="admin-box mt-2">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Rol</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.map((u) => (
                    <tr key={u.id}>
                      <td className="fw-semibold">{u.nombre}</td>
                      <td>
                        <span className={`badge-rol-tabla badge-rol-${u.rol}`}>
                          {u.rol === 'jugador' ? 'deportista' : u.rol}
                        </span>
                      </td>
                      <td>{u.email}</td>
                      <td className="text-muted">{u.telefono || '—'}</td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-1">
                          <button
                            type="button"
                            className="btn btn-outline-dark btn-sm"
                            onClick={() => setUsuarioEditando(u)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleEliminarUsuario(u.id, u.nombre)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ==================== VISTA 3: ANALÍTICAS ==================== */}
        {seccion === 'analiticas' && (
          <>
            <h1 className="admin-title">Analíticas</h1>
            <p className="admin-subtitle">Métricas de ingresos y actividad de la plataforma.</p>

            <div className="row g-3">
              <div className="col-md-4">
                <div className="kpi-card">
                  <div className="kpi-label">INGRESOS ESTE MES</div>
                  <div className="kpi-value">${ingresosTotales.toLocaleString('es-CL')}</div>
                  <div className="kpi-trend">↑ Basado en reservas confirmadas</div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="kpi-card">
                  <div className="kpi-label">RESERVAS ESTE MES</div>
                  <div className="kpi-value">{reservas.length}</div>
                  <div className="kpi-trend">↑ Reservas activas</div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="kpi-card">
                  <div className="kpi-label">TICKET PROMEDIO</div>
                  <div className="kpi-value">${ticketPromedio.toLocaleString('es-CL')}</div>
                  <div className="text-muted small mt-1">por reserva</div>
                </div>
              </div>
            </div>

            <div className="admin-box">
              <div className="admin-box-header">
                <span>Top canchas por ingresos</span>
                <span className="text-muted small fw-normal">*valores en pesos (CLP)</span>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Cancha</th>
                    <th className="text-end">Reservas</th>
                    <th className="text-end">Ingresos</th>
                  </tr>
                </thead>
                <tbody>
                  {topCanchas.map((c) => (
                    <tr key={c.id}>
                      <td>{c.nombre}</td>
                      <td className="text-end">{c.reservasCount}</td>
                      <td className="text-end">${c.ingresos.toLocaleString('es-CL')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}