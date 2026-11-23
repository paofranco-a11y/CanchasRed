// import trae funciones o componentes de React y de nuestros archivos para usarlos aquí.
import { useState } from 'react';
import { EMAIL_RE } from '../utils/validators';

// Opciones de roles disponibles para asignar en el menú desplegable del formulario.
const ROLES_INVITACION = [
  { valor: 'admin', texto: 'admin' },
  { valor: 'dueno', texto: 'dueño' },
  { valor: 'deportista', texto: 'deportista' },
];

// props: datos y funciones que envía el padre (onInvitar para guardar y onCerrar para cerrar la ventana).
function InvitarUsuarioModal({ onInvitar, onCerrar }) {
  // useState crea variables de estado que hacen que la pantalla se vuelva a dibujar cuando cambian.
  const [values, setValues] = useState({ nombre: '', correo: '', rol: '' });
  // touched registra si el usuario ya tocó o entró a cada campo para no mostrar errores antes de tiempo.
  const [touched, setTouched] = useState({ nombre: false, correo: false, rol: false });
  // submitted recuerda si se intentó enviar el formulario para mostrar todas las validaciones de una vez.
  const [submitted, setSubmitted] = useState(false);

  // errors se calcula a partir de values y no se guarda en estado: si values cambia, errors se recalcula solo.
  const errors = {
    nombre: values.nombre.trim().length >= 3 ? '' : 'Ingresa el nombre completo (mínimo 3 caracteres).',
    correo: EMAIL_RE.test(values.correo.trim()) ? '' : 'Ingresa un correo electrónico válido.',
    rol: values.rol ? '' : 'Debes seleccionar un rol.',
  };
  // Comprobamos si un campo específico no tiene mensaje de error pendiente.
  const isValid = (campo) => !errors[campo];

  // Devuelve las clases de Bootstrap (is-valid o is-invalid) solo si ya se tocó el input o se intentó enviar.
  const fieldClass = (campo, base = 'form-control') => {
    const mostrar = touched[campo] || submitted;
    if (!mostrar) return base;
    return isValid(campo) ? `${base} is-valid` : `${base} is-invalid`;
  };

  // e.target representa la etiqueta HTML donde ocurrió el evento; leemos su name y su value.
  // Copiamos los valores anteriores con {...values} y actualizamos solo el campo que escribió el usuario.
  // Ejemplo: si escribe en "correo", values pasa a tener { ...values, correo: 'ana@gmail.com' }.
  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  // Cuando el usuario sale del input (onBlur), marcamos ese campo como tocado para validar.
  const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true });

  // Se activa al presionar el botón de enviar invitación.
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue por defecto al enviar el formulario.
    setSubmitted(true); // Marcamos el formulario como enviado para revelar cualquier error pendiente.
    if (!Object.keys(errors).every(isValid)) return; // Si algún campo sigue fallando, nos detenemos aquí.
    // Si todo es válido, avisamos al componente padre enviándole los datos limpios sin espacios extras.
    onInvitar({ nombre: values.nombre.trim(), correo: values.correo.trim(), rol: values.rol });
  };

  // El return dibuja el modal con la estructura de Bootstrap y el fondo oscuro.
  return (
    <>
      <div className="modal d-block show" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmit} noValidate>
              <div className="modal-header">
                <h1 className="modal-title fs-5">Invitar usuario</h1>
                <button type="button" className="btn-close" aria-label="Close" onClick={onCerrar}></button>
              </div>

              <div className="modal-body">
                {/* Campo de texto controlado para el nombre */}
                <div className="mb-3">
                  <label htmlFor="inviteName" className="form-label">Nombre completo</label>
                  <input type="text" id="inviteName" name="nombre" className={fieldClass('nombre')}
                    value={values.nombre} onChange={handleChange} onBlur={handleBlur} />
                  <div className="invalid-feedback">{errors.nombre}</div>
                </div>

                {/* Campo de texto controlado para el correo electrónico */}
                <div className="mb-3">
                  <label htmlFor="inviteEmail" className="form-label">Correo electrónico</label>
                  <input type="email" id="inviteEmail" name="correo" className={fieldClass('correo')}
                    value={values.correo} onChange={handleChange} onBlur={handleBlur} />
                  <div className="invalid-feedback">{errors.correo}</div>
                </div>

                {/* Selector desplegable para asignar el rol */}
                <div className="mb-3">
                  <label htmlFor="inviteRol" className="form-label">Rol</label>
                  <select id="inviteRol" name="rol" className={fieldClass('rol', 'form-select')}
                    value={values.rol} onChange={handleChange} onBlur={handleBlur}>
                    <option value="" disabled>Selecciona un rol...</option>
                    {/* .map recorre la lista de roles para generar una etiqueta <option> por cada uno */}
                    {ROLES_INVITACION.map((r) => <option key={r.valor} value={r.valor}>{r.texto}</option>)}
                  </select>
                  <div className="invalid-feedback">{errors.rol}</div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={onCerrar}>Cancelar</button>
                <button type="submit" className="btn btn-dark">Enviar invitación</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Fondo oscuro translúcido detrás del modal */}
      <div className="modal-backdrop show"></div>
    </>
  );
}

// export default permite compartir este componente para que Usuarios.jsx lo use en su pantalla.
export default InvitarUsuarioModal;
