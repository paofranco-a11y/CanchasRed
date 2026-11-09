import { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import InvitarUsuarioModal from '../components/InvitarUsuarioModal';
import { USUARIOS_ADMIN, ROLES_ADMIN } from '../data/admin';
import { normalizar } from '../utils/validators';

const TODOS = 'Todos los roles';

function Usuarios() {
  // Estado de la página
  const [pestana, setPestana] = useState('usuarios'); // 'usuarios' | 'pendientes'
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState(TODOS);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // Datos derivados: usuarios que coinciden con el texto y el rol elegidos
  const texto = normalizar(busqueda);
  const visibles = USUARIOS_ADMIN.filter((u) => {
    const coincideTexto = !texto || normalizar(u.nombre).includes(texto) || normalizar(u.email).includes(texto);
    const coincideRol = filtroRol === TODOS || ROLES_ADMIN[u.rol].etiqueta === filtroRol;
    return coincideTexto && coincideRol;
  });

  // La invitación no se guarda (no hay backend): solo se confirma al administrador
  const invitar = ({ correo }) => {
    setModalAbierto(false);
    setMensaje(`Invitación enviada a ${correo}`);
  };

  return (
    <AdminLayout>
      <header className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h1 className="h3 mb-0">Usuarios ({USUARIOS_ADMIN.length})</h1>
          <p className="text-muted">Administrar usuarios y rol.</p>
        </div>
        <button type="button" className="btn btn-dark" onClick={() => { setMensaje(''); setModalAbierto(true); }}>
          Invita usuarios
        </button>
      </header>

      {mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}

      <ul className="nav nav-tabs mb-3" role="tablist">
        <li className="nav-item" role="presentation">
          <button type="button" role="tab" aria-selected={pestana === 'usuarios'}
            className={'nav-link' + (pestana === 'usuarios' ? ' active' : '')}
            onClick={() => setPestana('usuarios')}>Usuarios</button>
        </li>
        <li className="nav-item" role="presentation">
          <button type="button" role="tab" aria-selected={pestana === 'pendientes'}
            className={'nav-link' + (pestana === 'pendientes' ? ' active' : '')}
            onClick={() => setPestana('pendientes')}>Solicitudes pendientes</button>
        </li>
      </ul>

      {pestana === 'usuarios' ? (
        <div>
          <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
            <input type="search" className="form-control w-auto flex-grow-1" placeholder="Search by email or Name"
              aria-label="Buscar usuario" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            <select className="form-select w-auto" aria-label="Filtrar por rol" value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}>
              <option>{TODOS}</option>
              <option>admin</option>
              <option>dueño</option>
              <option>deportista</option>
            </select>
          </div>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Rol</th>
                  <th scope="col">Email</th>
                  <th scope="col">Joined</th>
                  <th scope="col" className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visibles.map((u) => (
                  <tr key={u.email}>
                    <td>
                      <div className="fw-semibold">{u.nombre}</div>
                      {u.subtitulo && <div className="text-muted small">{u.subtitulo}</div>}
                    </td>
                    <td><span className={ROLES_ADMIN[u.rol].clase}>{ROLES_ADMIN[u.rol].etiqueta}</span></td>
                    <td>{u.email}</td>
                    <td>{u.desde}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-secondary" type="button" aria-label={`Acciones de ${u.nombre}`}>
                        <i className="bi bi-three-dots"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {visibles.length === 0 && <p className="text-muted text-center py-3">No se encontraron usuarios.</p>}
        </div>
      ) : (
        <div className="text-muted text-center py-5">No hay solicitudes pendientes por el momento.</div>
      )}

      {modalAbierto && <InvitarUsuarioModal onInvitar={invitar} onCerrar={() => setModalAbierto(false)} />}
    </AdminLayout>
  );
}

export default Usuarios;
