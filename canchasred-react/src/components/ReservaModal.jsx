import { useState } from 'react';
import { formatearPrecio } from '../utils/validators';

// Fecha de hoy en formato YYYY-MM-DD (hora local)
function hoy() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

// Modal de reserva controlado por estado (sin la API JS de Bootstrap).
function ReservaModal({ cancha, onConfirmar, onCerrar }) {
  const [values, setValues] = useState({ fecha: '', hora: '', horas: '1' });
  const [submitted, setSubmitted] = useState(false);

  // Error derivado de los valores
  const error = !values.fecha || !values.hora ? 'Debes elegir fecha y hora.'
    : values.fecha < hoy() ? 'La fecha no puede ser anterior a hoy.' : '';

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (error) return;
    const horas = Math.min(5, Math.max(1, Number(values.horas) || 1));
    onConfirmar({ fecha: values.fecha, hora: values.hora, horas });
  };

  return (
    <>
      <div className="modal d-block show" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleSubmit} noValidate>
            <div className="modal-header">
              <h5 className="modal-title">Reservar cancha</h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar}></button>
            </div>
            <div className="modal-body">
              <p className="fw-bold mb-1">{cancha.nombre}</p>
              <p className="text-muted mb-3">{formatearPrecio(cancha.precio)} /hora</p>

              <label className="form-label" htmlFor="reservaFecha">Fecha</label>
              <input type="date" className="form-control mb-3" id="reservaFecha" name="fecha"
                min={hoy()} value={values.fecha} onChange={handleChange} />

              <label className="form-label" htmlFor="reservaHora">Hora</label>
              <input type="time" className="form-control mb-3" id="reservaHora" name="hora"
                value={values.hora} onChange={handleChange} />

              <label className="form-label" htmlFor="reservaHoras">Cantidad de horas</label>
              <input type="number" className="form-control" id="reservaHoras" name="horas"
                min="1" max="5" value={values.horas} onChange={handleChange} />

              {submitted && error && <div className="text-danger mt-3">{error}</div>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onCerrar}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Confirmar Reserva</button>
            </div>
          </form>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </>
  );
}

export default ReservaModal;
