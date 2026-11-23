// import: traemos useState para manejar el formulario y expresiones regulares para validar email y teléfono
import { useState } from 'react';
import { EMAIL_RE, TELEFONO_RE } from '../utils/validators';

// Objeto molde con campos vacíos que usamos para iniciar y limpiar el formulario
const VACIO = { nombre: '', email: '', telefono: '', mensaje: '' };

// Formulario de consulta rápida usado en Home y Detalle; valida mientras el usuario escribe y al enviar
function MiniContacto() {
  // useState: hook para guardar datos que si cambian, hacen que React vuelva a dibujar la pantalla
  // values guarda el texto escrito, touched si el usuario ya tocó el campo, y submitted si apretó el botón enviar
  const [values, setValues] = useState(VACIO);
  const [touched, setTouched] = useState({ nombre: false, email: false, telefono: false, mensaje: false });
  const [submitted, setSubmitted] = useState(false);
  const [enviado, setEnviado] = useState(false);

  // errors se calcula a partir de values y no se guarda en useState para no duplicar datos ni desincronizarnos
  // Si el campo está vacío o no cumple la expresión regular (ej: correo sin @), guarda el mensaje de error
  const errors = {
    nombre: values.nombre.trim() === '' ? 'Ingresa tu nombre.' : '',
    email: EMAIL_RE.test(values.email) ? '' : 'Ingresa un correo válido.',
    telefono: values.telefono.trim() === '' ? 'Ingresa tu teléfono.'
      : TELEFONO_RE.test(values.telefono) ? '' : 'Ingresa un teléfono válido.',
    mensaje: values.mensaje.trim() === '' ? 'Escribe tu mensaje.' : '',
  };
  const isValid = (campo) => !errors[campo];

  // fieldClass: decide qué clase de Bootstrap poner; no muestra errores hasta que el campo fue tocado o se envió el form
  const fieldClass = (campo) => {
    const mostrar = touched[campo] || submitted;
    if (!mostrar) return 'form-control';
    return isValid(campo) ? 'form-control is-valid' : 'form-control is-invalid';
  };

  // handleChange: se ejecuta cada vez que el usuario teclea una letra en cualquiera de los inputs
  // e.target: es el input exacto del HTML donde el usuario está escribiendo
  // {...values}: copia todo lo que ya teníamos escrito para no borrar los otros campos al actualizar uno solo
  // [e.target.name]: e.target.value: propiedad dinámica; ej: si escribo "a" en nombre, values pasa a { ...values, nombre: 'a' }
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setEnviado(false);
  };

  // handleBlur: se activa cuando el usuario sale del input (blur) y lo marca como tocado para activar los mensajes de error
  const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true });

  // handleSubmit: se ejecuta cuando se hace clic en el botón Enviar del formulario
  // e.preventDefault(): frena el comportamiento por defecto del navegador para que no recargue la página completa
  // Si todos los campos son válidos, activa el mensaje de confirmación y resetea todos los inputs con el objeto VACIO
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
        {/* Formulario controlado: el valor de cada input viene del estado values y cualquier cambio pasa por handleChange */}
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

// export default: exporta este componente para poder incrustarlo en Home.jsx y DetalleCancha.jsx
export default MiniContacto;
