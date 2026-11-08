import { useState } from 'react';
import { EMAIL_RE, TELEFONO_RE } from '../utils/validators';

const VACIO = { nombre: '', email: '', telefono: '', mensaje: '' };

// Formulario corto de contacto (Home y DetalleCancha). Validación al escribir/blur y al enviar.
function MiniContacto() {
  const [values, setValues] = useState(VACIO);
  const [touched, setTouched] = useState({ nombre: false, email: false, telefono: false, mensaje: false });
  const [submitted, setSubmitted] = useState(false);
  const [enviado, setEnviado] = useState(false);

  // Los errores se derivan de values (no son estado)
  const errors = {
    nombre: values.nombre.trim() === '' ? 'Ingresa tu nombre.' : '',
    email: EMAIL_RE.test(values.email) ? '' : 'Ingresa un correo válido.',
    telefono: values.telefono.trim() === '' ? 'Ingresa tu teléfono.'
      : TELEFONO_RE.test(values.telefono) ? '' : 'Ingresa un teléfono válido.',
    mensaje: values.mensaje.trim() === '' ? 'Escribe tu mensaje.' : '',
  };
  const isValid = (campo) => !errors[campo];
  const fieldClass = (campo) => {
    const mostrar = touched[campo] || submitted;
    if (!mostrar) return 'form-control';
    return isValid(campo) ? 'form-control is-valid' : 'form-control is-invalid';
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setEnviado(false);
  };
  const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).every(isValid)) {
      setEnviado(true);
      setValues(VACIO);
      setTouched({ nombre: false, email: false, telefono: false, mensaje: false });
      setSubmitted(false);
    }
  };

  return (
    <section className="page-section bg-dark text-white" id="mini-contacto">
      <div className="container">
        <div className="text-center mb-4">
          <h2 className="section-heading">¿Tienes dudas?</h2>
          <p className="section-subheading text-white-50">Escríbenos y te ayudamos a encontrar tu cancha ideal.</p>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="row align-items-stretch mb-4">
            <div className="col-md-6">
              <div className="mb-3">
                <input type="text" name="nombre" className={fieldClass('nombre')} placeholder="Nombre" aria-label="Nombre"
                  value={values.nombre} onChange={handleChange} onBlur={handleBlur} />
                <div className="invalid-feedback">{errors.nombre}</div>
              </div>
              <div className="mb-3">
                <input type="email" name="email" className={fieldClass('email')} placeholder="Correo electrónico" aria-label="Correo electrónico"
                  value={values.email} onChange={handleChange} onBlur={handleBlur} />
                <div className="invalid-feedback">{errors.email}</div>
              </div>
              <div className="mb-md-0">
                <input type="tel" name="telefono" className={fieldClass('telefono')} placeholder="Tu teléfono" aria-label="Teléfono"
                  value={values.telefono} onChange={handleChange} onBlur={handleBlur} />
                <div className="invalid-feedback">{errors.telefono}</div>
              </div>
            </div>
            <div className="col-md-6 mt-3 mt-md-0">
              <textarea name="mensaje" className={fieldClass('mensaje') + ' h-100'} placeholder="Mensaje" aria-label="Mensaje"
                style={{ minHeight: '10rem' }} value={values.mensaje} onChange={handleChange} onBlur={handleBlur}></textarea>
              <div className="invalid-feedback">{errors.mensaje}</div>
            </div>
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary">Enviar</button>
          </div>
        </form>
        {enviado && (
          <div className="text-center text-success mt-3">¡Gracias! Te contactaremos pronto.</div>
        )}
      </div>
    </section>
  );
}

export default MiniContacto;
