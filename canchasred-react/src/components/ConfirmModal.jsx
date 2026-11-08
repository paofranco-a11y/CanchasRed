/**
 * Componente modal genérico de confirmación.
 * Utilizado para solicitar confirmación al usuario antes de ejecutar acciones críticas,
 * tales como eliminar una cancha, cerrar sesión o cancelar una reserva.
 */

// Modal de confirmación para eliminar una cancha (controlado por el padre).
function ConfirmModal({ nombre, onConfirmar, onCancelar }) {
  return (
    <>
      <div className="modal d-block show" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirmar eliminación</h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCancelar}></button>
            </div>
            <div className="modal-body">
              <p className="mb-1">Cancha a eliminar:</p>
              <p className="fw-bold">{nombre}</p>
              <p>¿Estás seguro que deseas eliminar esta cancha? Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onCancelar}>Cancelar</button>
              <button type="button" className="btn btn-dark" onClick={onConfirmar}>Confirmar</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </>
  );
}

export default ConfirmModal;
