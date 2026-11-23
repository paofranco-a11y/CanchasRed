import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import CanchasList from '../components/CanchasList';
import CanchaForm from '../components/CanchaForm';
import ConfirmModal from '../components/ConfirmModal';
import { useAuth } from '../context/AuthContext';
import { leer, guardar } from '../utils/storage';
import { canchasService } from '../services/api';

const MENSAJE_SIN_ESPACIO = 'No hay espacio para guardar la imagen. Usa una imagen más liviana.';

function PerfilDueno() {
  const { usuario } = useAuth();
  // Estado de la página (se pasa a los hijos por props)
  const [todas, setTodas] = useState(() => leer('canchas', []));
  const [vista, setVista] = useState('lista');       // 'lista' | 'form'
  const [editando, setEditando] = useState(null);    // cancha en edición o null
  const [aEliminar, setAEliminar] = useState(null);  // cancha pendiente de confirmar
  const [errorGuardado, setErrorGuardado] = useState('');

  // Sincroniza las canchas del dueño desde FastAPI cuando hay sesión con token JWT
  useEffect(() => {
    if (!usuario?.token) return;
    let activo = true;
    canchasService.listar()
      .then((remotas) => {
        if (!activo) return;
        const delDueno = remotas
          .filter((c) => !c.dueno_id || !usuario.id || c.dueno_id === usuario.id)
          .map((c) => ({ ...c, correoDueno: usuario.correo }));
        setTodas((prev) => {
          const idsRemotos = new Set(delDueno.map((c) => c.id));
          const localesRestantes = prev.filter((c) => !idsRemotos.has(c.id) && !/^[a-f\d]{24}$/i.test(c.id));
          return [...delDueno, ...localesRestantes];
        });
      })
      .catch(() => {});
    return () => { activo = false; };
  }, [usuario]);

  // Datos derivados: solo las canchas del dueño con sesión
  const mias = todas.filter(
    (c) => c.correoDueno === usuario.correo || (usuario.id && c.dueno_id === usuario.id)
  );
  const activas = mias.filter((c) => c.disponible).length;

  // Guarda en localStorage y solo actualiza el estado si hubo espacio
  const persistir = (nuevas) => {
    if (!guardar('canchas', nuevas)) {
      setErrorGuardado(MENSAJE_SIN_ESPACIO);
      return false;
    }
    setTodas(nuevas);
    setErrorGuardado('');
    return true;
  };

  const abrirForm = (cancha) => {
    setEditando(cancha);
    setErrorGuardado('');
    setVista('form');
  };

  const handleGuardar = async (datos) => {
    if (usuario?.token) {
      try {
        if (editando && /^[a-f\d]{24}$/i.test(editando.id)) {
          const actualizada = await canchasService.actualizar(editando.id, datos);
          const conDueno = { ...actualizada, correoDueno: usuario.correo };
          const nuevas = todas.map((c) => (c.id === editando.id ? conDueno : c));
          setTodas(nuevas);
          guardar('canchas', nuevas);
        } else {
          const creada = await canchasService.crear(datos);
          const conDueno = { ...creada, correoDueno: usuario.correo };
          const nuevas = [...todas, conDueno];
          setTodas(nuevas);
          guardar('canchas', nuevas);
        }
        setErrorGuardado('');
        setEditando(null);
        setVista('lista');
        return;
      } catch (err) {
        setErrorGuardado(err.message || 'No se pudo guardar la cancha en el servidor.');
        return;
      }
    }

    const nuevas = editando
      ? todas.map((c) => (c.id === editando.id ? { ...c, ...datos } : c))
      : [...todas, { id: Date.now().toString(), ...datos, correoDueno: usuario.correo }];
    if (persistir(nuevas)) {
      setEditando(null);
      setVista('lista');
    }
  };

  const confirmarEliminar = async () => {
    if (usuario?.token && /^[a-f\d]{24}$/i.test(aEliminar.id)) {
      try {
        await canchasService.eliminar(aEliminar.id);
      } catch (err) {
        alert(err.message || 'No se pudo eliminar la cancha en el servidor.');
        setAEliminar(null);
        return;
      }
    }
    persistir(todas.filter((c) => c.id !== aEliminar.id));
    setAEliminar(null);
  };

  return (
    <>
      <NavBar solido />
      <main className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
        <h1 className="mb-4">Perfil Dueño de Cancha</h1>

        <div className="row mb-4">
          <div className="col-md-4 mb-3 mb-md-0">
            <div className="card text-center p-3"><h3>{mias.length}</h3><p className="text-muted mb-0">Canchas publicadas</p></div>
          </div>
          <div className="col-md-4 mb-3 mb-md-0">
            <div className="card text-center p-3"><h3>{activas}</h3><p className="text-muted mb-0">Activas</p></div>
          </div>
          <div className="col-md-4">
            <div className="card text-center p-3"><h3 className="fs-5 text-break">{usuario.correo}</h3><p className="text-muted mb-0">Cuenta</p></div>
          </div>
        </div>

        <ul className="nav nav-pills mb-4">
          <li className="nav-item">
            <button type="button" className={'nav-link' + (vista === 'lista' ? ' active' : '')}
              onClick={() => setVista('lista')}>Mis Canchas</button>
          </li>
          <li className="nav-item">
            <button type="button" className={'nav-link' + (vista === 'form' ? ' active' : '')}
              onClick={() => abrirForm(null)}>Agregar Cancha</button>
          </li>
        </ul>

        {vista === 'lista' ? (
          <section>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h4 className="mb-0">Mis Canchas</h4>
                <small className="text-muted">Listado de tus publicaciones</small>
              </div>
              <button type="button" className="btn btn-dark" onClick={() => abrirForm(null)}>+ Nueva Cancha</button>
            </div>
            <CanchasList canchas={mias} onEditar={abrirForm} onEliminar={setAEliminar} />
          </section>
        ) : (
          <CanchaForm
            key={editando ? editando.id : 'nueva'}
            cancha={editando}
            onGuardar={handleGuardar}
            onCancelar={() => { setEditando(null); setVista('lista'); }}
            errorGuardado={errorGuardado}
          />
        )}
      </main>

      {aEliminar && (
        <ConfirmModal nombre={aEliminar.nombre} onConfirmar={confirmarEliminar} onCancelar={() => setAEliminar(null)} />
      )}
      <Footer />
    </>
  );
}

export default PerfilDueno;
