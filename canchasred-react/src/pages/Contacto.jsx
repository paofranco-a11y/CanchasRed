// import: traemos useState para manejar el formulario y expresiones regulares para validar email y teléfono
import { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { EMAIL_RE, TELEFONO_RE } from '../utils/validators';

// Objeto molde con campos vacíos que usamos para iniciar y limpiar el formulario
const VACIO = { nombre: '', email: '', telefono: '', mensaje: '' };

// Pantalla principal de contacto con mapa de fondo y formulario controlado por React
function Contacto() {
  // useState: guarda en memoria los datos del formulario; si cambian, React vuelve a pintar la pantalla
  // values guarda el texto de los inputs, touched si ya se interactuó con ellos y enviado si el mensaje fue recibido
  const [values, setValues] = useState(VACIO);
  const [touched, setTouched] = useState({ nombre: false, email: false, telefono: false, mensaje: false });
  const [submitted, setSubmitted] = useState(false);
  const [enviado, setEnviado] = useState(false);

  // errors se calcula a partir de values y no se guarda en el estado para evitar datos duplicados y desactualizados
  // Revisa campo por campo; si no cumple (ej: teléfono con letras), guarda el mensaje que se mostrará en pantalla
  const errors = {
    nombre: values.nombre.trim() === '' ? 'Ingresa tu nombre.' : '',
    email: EMAIL_RE.test(values.email) ? '' : 'Ingresa un email válido.',
    telefono: values.telefono.trim() === '' ? 'Ingresa tu teléfono.'
      : TELEFONO_RE.test(values.telefono) ? '' : 'Ingresa un teléfono válido.',
    mensaje: values.mensaje.trim() === '' ? 'Escribe tu mensaje.' : '',
  };
  const isValid = (campo) => !errors[campo];

  // fieldClass: devuelve 'is-valid' o 'is-invalid' de Bootstrap solo si el usuario ya tocó el campo o intentó enviar
  const fieldClass = (campo) => {
    const mostrar = touched[campo] || submitted;
    if (!mostrar) return 'form-control';
    return isValid(campo) ? 'form-control is-valid' : 'form-control is-invalid';
  };

  // handleChange: se ejecuta cada vez que el usuario escribe una letra en cualquier input
  // e.target: representa el input exacto del HTML que disparó el evento
  // {...values}: copia todos los campos existentes para no sobreescribir los otros datos al cambiar uno solo
  // [e.target.name]: e.target.value: propiedad dinámica; ej: si escribo "a" en nombre, values pasa a { ...values, nombre: 'a' }
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setEnviado(false);
  };

  // handleBlur: se ejecuta cuando el usuario hace clic fuera del input (pierde foco), activando la validación visual
  const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true });

  // handleSubmit: se ejecuta al presionar el botón "Enviar Mensaje"
  // e.preventDefault(): evita que el navegador recargue la página completa al enviar
  // Si todos los campos son válidos, muestra el cartel de éxito y limpia los inputs con el objeto VACIO
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
    <>
      <NavBar />
      <section className="page-section" id="contact" style={{ paddingTop: '10rem' }}>
        <div className="container">
          <div className="text-center">
            <h2 className="section-heading text-uppercase">Contáctanos</h2>
            <h3 className="section-subheading text-muted">Escríbenos y te responderemos a la brevedad.</h3>
          </div>
          {/* Formulario controlado donde cada input lee su valor de values y avisa sus cambios con onChange y onBlur */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="row align-items-stretch mb-5">
              <div className="col-md-6">
                <div className="form-group">
                  <input className={fieldClass('nombre')} name="nombre" type="text" placeholder="Nombre *" aria-label="Nombre"
                    value={values.nombre} onChange={handleChange} onBlur={handleBlur} />
                  <div className="invalid-feedback">{errors.nombre}</div>
                </div>
                <div className="form-group">
                  <input className={fieldClass('email')} name="email" type="email" placeholder="Email *" aria-label="Email"
                    value={values.email} onChange={handleChange} onBlur={handleBlur} />
                  <div className="invalid-feedback">{errors.email}</div>
                </div>
                <div className="form-group mb-md-0">
                  <input className={fieldClass('telefono')} name="telefono" type="tel" placeholder="Teléfono *" aria-label="Teléfono"
                    value={values.telefono} onChange={handleChange} onBlur={handleBlur} />
                  <div className="invalid-feedback">{errors.telefono}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group form-group-textarea mb-md-0">
                  <textarea className={fieldClass('mensaje')} name="mensaje" placeholder="Mensaje *" aria-label="Mensaje"
                    value={values.mensaje} onChange={handleChange} onBlur={handleBlur}></textarea>
                  <div className="invalid-feedback">{errors.mensaje}</div>
                </div>
              </div>
            </div>
            {/* Mensaje de confirmación en verde que solo se muestra si el formulario fue enviado con éxito */}
            {enviado && (
              <div className="text-center text-white mb-3 fw-bolder">¡Mensaje enviado con éxito!</div>
            )}
            <div className="text-center">
              <button className="btn btn-primary btn-xl text-uppercase" type="submit">Enviar Mensaje</button>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
}

// export default: exporta la página Contacto para que App.jsx la pueda renderizar en la ruta /contacto
export default Contacto;
