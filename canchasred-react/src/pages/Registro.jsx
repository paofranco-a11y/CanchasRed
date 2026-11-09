import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useAuth, rutaInicio } from '../context/AuthContext';
import { EMAIL_RE } from '../utils/validators';


/**
 * Vista de Registro de Usuarios.
 * Permite a nuevos usuarios crear una cuenta en el sistema, seleccionando su rol en la plataforma
 * (cliente o dueño de cancha) y recopilando la información necesaria para crear el perfil.
 */

// Opciones del selector de rol
const ROLES = [
  { valor: 'dueno', sigla: 'DC', titulo: 'Dueño de Cancha', detalle: 'Publica y gestiona recintos' },
  { valor: 'deportista', sigla: 'DP', titulo: 'Deportista', detalle: 'Reserva canchas deportivas' },
];

function Registro() {
  const { usuario, registrar } = useAuth();
  const navigate = useNavigate();
  const [rol, setRol] = useState('dueno');
  const [values, setValues] = useState({ correo: '', clave: '', confirmar: '' });
  const [touched, setTouched] = useState({ correo: false, clave: false, confirmar: false });
  const [submitted, setSubmitted] = useState(false);
  const [errorCorreoRepetido, setErrorCorreoRepetido] = useState('');

  const errors = {
    correo: EMAIL_RE.test(values.correo) ? '' : 'Ingresa un correo válido.',
    clave: values.clave.length >= 6 ? '' : 'La contraseña debe tener al menos 6 caracteres.',
    confirmar: values.confirmar === values.clave && values.confirmar !== '' ? '' : 'Las contraseñas no coinciden.',
  };
  const mostrar = (campo) => (touched[campo] || submitted) && errors[campo];

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrorCorreoRepetido('');
  };
  const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (errors.correo || errors.clave || errors.confirmar) return;
    const resultado = registrar(values.correo, values.clave, rol);
    if (!resultado.ok) {
      setErrorCorreoRepetido(resultado.error);
      return;
    }
    alert('Cuenta creada correctamente. Ahora inicia sesión.');
    navigate('/login');
  };

  if (usuario) return <Navigate to={rutaInicio(usuario.rol)} replace />;

  const errorCorreo = mostrar('correo') || errorCorreoRepetido;

  return (
    <>
      <NavBar solido />
      <main className="contenedor-autenticacion">
        <div className="tarjeta-registro">
          <h1 className="titulo-registro">Crea tu cuenta</h1>
          <p className="subtitulo-registro">Regístrate para empezar</p>

          <div className="selector-roles">
            {ROLES.map((r) => (
              <label key={r.valor} className="opcion-rol">
                <input type="radio" name="rol" value={r.valor} checked={rol === r.valor} onChange={() => setRol(r.valor)} />
                <div className="tarjeta-rol-info">
                  <span className="badge-rol">{r.sigla}</span>
                  <strong>{r.titulo}</strong>
                  <small>{r.detalle}</small>
                </div>
              </label>
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="campo-formulario">
              <label htmlFor="correo">Correo electrónico</label>
              <input type="email" id="correo" name="correo" placeholder="tucorreo@gmail.com" maxLength="100"
                className={errorCorreo ? 'is-invalid' : ''}
                value={values.correo} onChange={handleChange} onBlur={handleBlur} />
              <span className="mensaje-error">{errorCorreo}</span>
            </div>

            <div className="campo-formulario">
              <label htmlFor="password">Contraseña</label>
              <input type="password" id="password" name="clave" placeholder="••••••••"
                className={mostrar('clave') ? 'is-invalid' : ''}
                value={values.clave} onChange={handleChange} onBlur={handleBlur} />
              <span className="mensaje-error">{mostrar('clave')}</span>
            </div>

            <div className="campo-formulario">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input type="password" id="confirmPassword" name="confirmar" placeholder="••••••••"
                className={mostrar('confirmar') ? 'is-invalid' : ''}
                value={values.confirmar} onChange={handleChange} onBlur={handleBlur} />
              <span className="mensaje-error">{mostrar('confirmar')}</span>
            </div>

            <button type="submit" className="boton-primario-form">Crear cuenta</button>
          </form>

          <p className="enlace-alternativo">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
        </div>
      </main>
      <Footer simple />
    </>
  );
}

export default Registro;
