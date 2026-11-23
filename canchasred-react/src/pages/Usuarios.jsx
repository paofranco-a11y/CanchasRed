// import trae funciones de React, componentes, servicios API y datos para armar la gestión de usuarios.
import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import InvitarUsuarioModal from '../components/InvitarUsuarioModal';
import { USUARIOS_ADMIN, ROLES_ADMIN } from '../data/admin';
import { normalizar } from '../utils/validators';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

const TODOS = 'Todos los roles';

function Usuarios() {
  const { usuario } = useAuth();
  // useState guarda variables que cambian con la interacción y hacen que la interfaz se actualice sola.
  const [pestana, setPestana] = useState('usuarios'); // guarda qué pestaña está activa ('usuarios' o 'pendientes')
  const [busqueda, setBusqueda] = useState(''); // guarda lo que el admin escribe en el buscador
  const [filtroRol, setFiltroRol] = useState(TODOS); // guarda el rol seleccionado en el filtro desplegable
  const [modalAbierto, setModalAbierto] = useState(false); // indica si el modal de invitar debe verse o no
  const [mensaje, setMensaje] = useState(''); // mensaje verde de confirmación tras invitar a alguien
  const [remotos, setRemotos] = useState([]); // usuarios reales obtenidos desde MongoDB vía FastAPI

  // useEffect: cuando el admin tiene token JWT activo, consulta la lista de usuarios reales del backend
  useEffect(() => {
    if (!usuario?.token) return;
    let activo = true;
    authService.listarUsuarios()
      .then((lista) => {
        if (!activo || !Array.isArray(lista)) return;
        const mapeados = lista.map((u) => ({
          id: u.id,
          nombre: u.nombre || u.email,
          rol: ROLES_ADMIN[u.rol] ? u.rol : 'deportista',
          email: u.email,
          desde: 'MongoDB API',
        }));
        setRemotos(mapeados);
      })
      .catch(() => {});
    return () => { activo = false; };
  }, [usuario]);

  // Unimos la nómina base con los usuarios registrados en el backend sin duplicar correos
  const emailsBase = new Set(USUARIOS_ADMIN.map((u) => u.email.toLowerCase()));
  const todosUsuarios = [
    ...USUARIOS_ADMIN,
    ...remotos.filter((u) => !emailsBase.has(u.email.toLowerCase())),
  ];

  // Datos calculados a partir del estado: no los guardamos en useState porque se deducen de busqueda y filtroRol.
  // normalizar quita tildes y pasa a minúsculas para comparar fácilmente (ej: "José" -> "jose").
  const texto = normalizar(busqueda);
  // Filtramos la lista completa de usuarios según el texto ingresado y el rol elegido.
  const visibles = todosUsuarios.filter((u) => {
    const coincideTexto = !texto || normalizar(u.nombre).includes(texto) || normalizar(u.email).includes(texto);
    const coincideRol = filtroRol === TODOS || ROLES_ADMIN[u.rol].etiqueta === filtroRol;
    return coincideTexto && coincideRol;
  });

  // Función que recibe los datos del modal cuando el admin invita a alguien con éxito.
  const invitar = ({ correo }) => {
    setModalAbierto(false);
    setMensaje(`Invitación enviada a ${correo}`);
  };

  // El return arma toda la página con su encabezado, pestañas, filtros, tabla y modal.
  return (
    <AdminLayout>
      <header className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h1 className="h3 mb-0">Usuarios ({todosUsuarios.length})</h1>
          <p className="text-muted">Administrar usuarios y rol.</p>
        </div>
        {/* Botón que limpia el mensaje anterior y abre el modal cambiando el estado a true */}
        <button type="button" className="btn btn-dark" onClick={() => { setMensaje(''); setModalAbierto(true); }}>
          Invita usuarios
        </button>
      </header>

      {/* Cartel verde de éxito: solo se muestra si la variable mensaje tiene texto */}
      {mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}

      {/* Pestañas de navegación para alternar entre la lista de usuarios y las solicitudes pendientes */}
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

      {/* Si la pestaña activa es 'usuarios' mostramos buscador y tabla; si no, el mensaje de pendientes */}
      {pestana === 'usuarios' ? (
        <div>
          {/* Barra de herramientas con buscador por texto y filtro por rol */}
          <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
            {/* e.target.value lee lo que el usuario escribió en el input y actualiza el estado busqueda */}
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

          {/* Tabla con la lista de usuarios filtrados */}
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
                {/* .map recorre cada usuario visible y crea una fila <tr> con sus datos y su insignia de rol */}
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
          {/* Mensaje amigable cuando la búsqueda no coincide con ningún usuario */}
          {visibles.length === 0 && <p className="text-muted text-center py-3">No se encontraron usuarios.</p>}
        </div>
      ) : (
        <div className="text-muted text-center py-5">No hay solicitudes pendientes por el momento.</div>
      )}

      {/* Renderizado condicional: si modalAbierto es true, pintamos el modal y le pasamos los handlers por props */}
      {modalAbierto && <InvitarUsuarioModal onInvitar={invitar} onCerrar={() => setModalAbierto(false)} />}
    </AdminLayout>
  );
}

// export default permite que la ruta /usuarios cargue este componente en la aplicación.
export default Usuarios;
