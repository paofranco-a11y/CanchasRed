import { useState } from 'react';
import { EMAIL_RE } from '../utils/validators';

const ROLES_INVITACION = [
  { valor: 'admin', texto: 'admin' },
  { valor: 'dueno', texto: 'dueño' },
  { valor: 'deportista', texto: 'deportista' },
];

// Modal "Invitar usuario" controlado por estado. Avisa al padre con onInvitar / onCerrar.
function InvitarUsuarioModal({ onInvitar, onCerrar }) {
  const [values, setValues] = useState({ nombre: '', correo: '', rol: '' });
  const [touched, setTouched] = useState({ nombre: false, correo: false, rol: false });
  const [submitted, setSubmitted] = useState(false);

  // Errores derivados de los valores
  const errors = {
    nombre: values.nombre.trim().length >= 3 ? '' : 'Ingresa el nombre completo (mínimo 3 caracteres).',
    correo: EMAIL_RE.test(values.correo.trim()) ? '' : 'Ingresa un correo electrónico válido.',
    rol: values.rol ? '' : 'Debes seleccionar un rol.',
  };
  const isValid = (campo) => !errors[campo];
  const fieldClass = (campo, base = 'form-control') => {
    const mostrar = touched[campo] || submitted;
    if (!mostrar) return base;
    return isValid(campo) ? `${base} is-valid` : `${base} is-invalid`;
  };

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });
  const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!Object.keys(errors).every(isValid)) return;
    onInvitar({ nombre: values.nombre.trim(), correo: values.correo.trim(), rol: values.rol });
  };

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
                <div className="mb-3">
                  <label htmlFor="inviteName" className="form-label">Nombre completo</label>
                  <input type="text" id="inviteName" name="nombre" className={fieldClass('nombre')}
                    value={values.nombre} onChange={handleChange} onBlur={handleBlur} />
                  <div className="invalid-feedback">{errors.nombre}</div>
                </div>

                <div className="mb-3">
                  <label htmlFor="inviteEmail" className="form-label">Correo electrónico</label>
                  <input type="email" id="inviteEmail" name="correo" className={fieldClass('correo')}
                    value={values.correo} onChange={handleChange} onBlur={handleBlur} />
                  <div className="invalid-feedback">{errors.correo}</div>
                </div>

                <div className="mb-3">
                  <label htmlFor="inviteRol" className="form-label">Rol</label>
                  <select id="inviteRol" name="rol" className={fieldClass('rol', 'form-select')}
                    value={values.rol} onChange={handleChange} onBlur={handleBlur}>
                    <option value="" disabled>Selecciona un rol...</option>
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
      <div className="modal-backdrop show"></div>
    </>
  );
}

export default InvitarUsuarioModal;
