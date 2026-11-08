import { formatearPrecio } from '../utils/validators';


/**
 * Componente para renderizar la lista de canchas registradas.
 * En el panel del dueño, muestra sus canchas publicadas con acciones para editar, cambiar estado de disponibilidad
 * o eliminar la publicación.
 */

// Lista de canchas del dueño. Los botones avisan al padre con callbacks.
function CanchasList({ canchas, onEditar, onEliminar }) {
  if (canchas.length === 0) {
    return <p className="text-muted text-center py-4">Aún no tienes canchas publicadas.</p>;
  }

  return (
    <div className="list-group">
      {canchas.map((c) => (
        <div key={c.id} className="list-group-item d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center gap-3">
            {c.imagen && (
              <img src={c.imagen} alt={c.nombre} width="60" height="60" style={{ objectFit: 'cover', borderRadius: '6px' }} />
            )}
            <div>
              <strong>{c.nombre}</strong>
              <div className="text-muted small">
                {c.deporte}{' '}
                <span className={'badge ' + (c.disponible ? 'bg-success' : 'bg-secondary')}>
                  {c.disponible ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              <div>{formatearPrecio(c.precio)}/hr</div>
            </div>
          </div>
          <div>
            <button type="button" className="btn btn-outline-dark btn-sm me-2" onClick={() => onEditar(c)}>Ver detalle</button>
            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => onEliminar(c)}>Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CanchasList;
