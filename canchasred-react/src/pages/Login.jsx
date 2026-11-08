import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useAuth, rutaInicio } from '../context/AuthContext';
import { EMAIL_RE } from '../utils/validators';

/**
 * Vista de Inicio de Sesión.
 * Presenta el formulario para que los usuarios registrados ingresen con su correo y contraseña.
 * Conecta con el `AuthContext` para validar credenciales y redirigir al usuario a su panel correspondiente según su rol.
 */

function Login() {
  const { usuario, login } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ correo: '', clave: '' });
  const [touched, setTouched] = useState({ correo: false, clave: false });
  const [submitted, setSubmitted] = useState(false);
  const [errorCredenciales, setErrorCredenciales] = useState('');

  const errors = {
    correo: values.correo.trim() === '' ? 'Ingresa tu correo.'
      : EMAIL_RE.test(values.correo) ? '' : 'Ingresa un correo válido.',
    clave: values.clave === '' ? 'Ingresa tu contraseña.' : '',
  };
  const mostrar = (campo) => (touched[campo] || submitted) && errors[campo];

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrorCredenciales('');
  };
  const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (errors.correo || errors.clave) return;
    const sesion = login(values.correo, values.clave);
    if (!sesion) {
      setErrorCredenciales('Correo o contraseña incorrectos.');
      return;
    }
    navigate(rutaInicio(sesion.rol));
  };

  // Con sesión iniciada no se muestra el login
  if (usuario) return <Navigate to={rutaInicio(usuario.rol)} replace />;

  return (
    <>
      <NavBar solido />
      <main className="contenedor-autenticacion">
        <div className="tarjeta-registro">
          <h1 className="titulo-registro">Inicia sesión</h1>
          <p className="subtitulo-registro">Ingresa tus datos para continuar</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="campo-formulario">
              <label htmlFor="correoLogin">Correo electrónico</label>
              <input type="email" id="correoLogin" name="correo" placeholder="tucorreo@gmail.com"
                className={mostrar('correo') ? 'is-invalid' : ''}
                value={values.correo} onChange={handleChange} onBlur={handleBlur} />
              <span className="mensaje-error">{mostrar('correo')}</span>
            </div>

            <div className="campo-formulario">
              <label htmlFor="passwordLogin">Contraseña</label>
              <input type="password" id="passwordLogin" name="clave" placeholder="••••••••"
                className={mostrar('clave') || errorCredenciales ? 'is-invalid' : ''}
                value={values.clave} onChange={handleChange} onBlur={handleBlur} />
              <span className="mensaje-error">{mostrar('clave') || errorCredenciales}</span>
            </div>

            <button type="submit" className="boton-primario-form">Iniciar sesión</button>
          </form>

          <p className="enlace-alternativo">¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
        </div>
      </main>
      <Footer simple />
    </>
  );
}

export default Login;
