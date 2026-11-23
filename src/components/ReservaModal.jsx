// import: traemos useState para manejar el formulario y formatearPrecio para mostrar el costo en pesos chilenos
import { useState } from 'react';
import { formatearPrecio } from '../utils/validators';

// Calcula la fecha actual en formato AAAA-MM-DD para bloquear fechas pasadas en el selector
function hoy() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

// props: datos y funciones que recibimos del padre (cancha seleccionada, onConfirmar para guardar y onCerrar para salir)
function ReservaModal({ cancha, onConfirmar, onCerrar }) {
  // useState: hook para guardar datos que al cambiar hacen que React redibuje la pantalla (aquí fecha, hora y horas)
  const [values, setValues] = useState({ fecha: '', hora: '', horas: '1' });
  const [submitted, setSubmitted] = useState(false);

  // Dato calculado a partir del estado: se evalúa en cada render sin guardarse en useState para no duplicar datos
  // Verifica que ambos campos estén llenos y que la fecha elegida no sea anterior al día de hoy
  const error = !values.fecha || !values.hora ? 'Debes elegir fecha y hora.'
    : values.fecha < hoy() ? 'La fecha no puede ser anterior a hoy.' : '';

  // handleChange: se dispara cada vez que el usuario modifica un input del formulario
  // e.target: representa el input específico donde se escribió; actualiza dinámicamente con [e.target.name]
  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  // handleSubmit: frena el envío tradicional del navegador con e.preventDefault() y valida los campos
  // Si no hay errores, ajusta las horas entre 1 y 5 y ejecuta el callback onConfirmar que le pasó el componente padre
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (error) return;
    const horas = Math.min(5, Math.max(1, Number(values.horas) || 1));
    onConfirmar({ fecha: values.fecha, hora: values.hora, horas });
  };

  return (
    <>
      {/* Ventana modal de Bootstrap controlada por React mediante clases CSS, sin necesidad del script de Bootstrap */}
      <div className="modal d-block show" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog">
          {/* Formulario controlado: sus campos leen el valor de values y notifican cambios con onChange */}
          <form className="modal-content" onSubmit={handleSubmit} noValidate>
            <div className="modal-header">
              <h5 className="modal-title">Reservar cancha</h5>
              {/* Botón para cerrar la ventana modal ejecutando la función onCerrar recibida por props */}
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar}></button>
            </div>
            <div className="modal-body">
              <p className="fw-bold mb-1">{cancha.nombre}</p>
              <p className="text-muted mb-3">{formatearPrecio(cancha.precio)} /hora</p>

              {/* Selector de fecha con atributo min para impedir seleccionar días anteriores a hoy */}
              <label className="form-label" htmlFor="reservaFecha">Fecha</label>
              <input type="date" className="form-control mb-3" id="reservaFecha" name="fecha"
                min={hoy()} value={values.fecha} onChange={handleChange} />

              <label className="form-label" htmlFor="reservaHora">Hora</label>
              <input type="time" className="form-control mb-3" id="reservaHora" name="hora"
                value={values.hora} onChange={handleChange} />

              {/* Selector de cantidad de horas permitidas (entre 1 y 5 horas por reserva) */}
              <label className="form-label" htmlFor="reservaHoras">Cantidad de horas</label>
              <input type="number" className="form-control" id="reservaHoras" name="horas"
                min="1" max="5" value={values.horas} onChange={handleChange} />

              {/* Muestra el mensaje de validación en rojo solo si el usuario ya presionó el botón de confirmar */}
              {submitted && error && <div className="text-danger mt-3">{error}</div>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onCerrar}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Confirmar Reserva</button>
            </div>
          </form>
        </div>
      </div>
      {/* Fondo oscuro translúcido que aparece detrás de la ventana modal */}
      <div className="modal-backdrop show"></div>
    </>
  );
}

// export default: exporta este componente para que DetalleCancha.jsx pueda abrirlo al presionar Reservar
export default ReservaModal;
