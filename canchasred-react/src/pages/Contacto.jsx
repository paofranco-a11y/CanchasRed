import { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { EMAIL_RE, TELEFONO_RE } from '../utils/validators';

const VACIO = { nombre: '', email: '', telefono: '', mensaje: '' };

function Contacto() {
  const [values, setValues] = useState(VACIO);
  const [touched, setTouched] = useState({ nombre: false, email: false, telefono: false, mensaje: false });
  const [submitted, setSubmitted] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const errors = {
    nombre: values.nombre.trim() === '' ? 'Ingresa tu nombre.' : '',
    email: EMAIL_RE.test(values.email) ? '' : 'Ingresa un email válido.',
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
    <>
      <NavBar />
      <section className="page-section" id="contact" style={{ paddingTop: '10rem' }}>
        <div className="container">
          <div className="text-center">
            <h2 className="section-heading text-uppercase">Contáctanos</h2>
            <h3 className="section-subheading text-muted">Escríbenos y te responderemos a la brevedad.</h3>
          </div>
          <form id="contactForm" onSubmit={handleSubmit} noValidate>
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

export default Contacto;
