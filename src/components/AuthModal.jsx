import { useState } from 'react';
import { authService } from '../services/api';

export function AuthModal({ visible, onCerrar, onLoginExitoso }) {
  const [esRegistro, setEsRegistro] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    rol: 'deportista',
  });

  if (!visible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      if (esRegistro) {
        await authService.registro(form);
      }
      const sesion = await authService.login(form.email, form.password);
      onLoginExitoso({
        token: sesion.access_token,
        rol: sesion.rol,
        nombre: sesion.nombre,
      });
      onCerrar();
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="contenedor-autenticacion" style={{ textAlign: 'left' }}>
      <div className="tarjeta-registro shadow-sm">
        <div className="mb-3">
          <button
            type="button"
            className="btn btn-link text-muted p-0 text-decoration-none small"
            onClick={onCerrar}
          >
            ← Volver al inicio
          </button>
        </div>

        <h2
          className="titulo-registro"
          style={{ color: '#212529', fontWeight: '700' }}
        >
          {esRegistro ? 'Crear cuenta' : 'Inicia sesión'}
        </h2>
        <p className="subtitulo-registro">
          {esRegistro
            ? 'Elige tu rol y completa tus datos'
            : 'Ingresa tus datos para continuar'}
        </p>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleSubmit}>
          {esRegistro && (
            <>
              <div className="selector-roles">
                <label className="opcion-rol">
                  <input
                    type="radio"
                    name="rol"
                    value="deportista"
                    checked={form.rol === 'deportista'}
                    onChange={(e) => setForm({ ...form, rol: e.target.value })}
                  />
                  <div className="tarjeta-rol-info" style={{ color: '#212529' }}>
                    <span className="badge-rol">Deportista</span>
                    <strong>Reservar</strong>
                    <small>Busca y reserva canchas</small>
                  </div>
                </label>

                <label className="opcion-rol">
                  <input
                    type="radio"
                    name="rol"
                    value="dueno"
                    checked={form.rol === 'dueno'}
                    onChange={(e) => setForm({ ...form, rol: e.target.value })}
                  />
                  <div className="tarjeta-rol-info" style={{ color: '#212529' }}>
                    <span className="badge-rol">Dueño</span>
                    <strong>Publicar</strong>
                    <small>Administra tus recintos</small>
                  </div>
                </label>
              </div>

              <div className="campo-formulario">
                <label>Nombre completo</label>
                <input
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  required
                  style={{ backgroundColor: '#ffffff', color: '#212529' }}
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
              </div>

              <div className="campo-formulario">
                <label>Teléfono</label>
                <input
                  type="tel"
                  placeholder="912345678"
                  style={{ backgroundColor: '#ffffff', color: '#212529' }}
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                />
              </div>
            </>
          )}

          <div className="campo-formulario">
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="tucorreo@gmail.com"
              required
              style={{ backgroundColor: '#ffffff', color: '#212529' }}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="campo-formulario">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              style={{ backgroundColor: '#ffffff', color: '#212529' }}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="boton-primario-form"
            disabled={cargando}
          >
            {cargando
              ? 'Procesando...'
              : esRegistro
              ? 'Crear cuenta'
              : 'Iniciar sesión'}
          </button>
        </form>

        <p className="enlace-alternativo">
          {esRegistro ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
          <a
            href="#cambiar-modo"
            style={{ color: '#ffc800', fontWeight: '600' }}
            onClick={(e) => {
              e.preventDefault();
              setEsRegistro(!esRegistro);
              setError('');
            }}
          >
            {esRegistro ? 'Inicia sesión' : 'Regístrate'}
          </a>
        </p>
      </div>
    </div>
  );
}