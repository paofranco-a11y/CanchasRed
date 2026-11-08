import { useState } from 'react';
import { DEPORTES, COMUNAS } from '../data/canchas';
import { leerImagen, TIPOS_PERMITIDOS } from '../utils/imagen';

/**
 * Formulario para la creación y edición de canchas por parte del dueño.
 * Gestiona el estado de los campos de la cancha (nombre, tipo de deporte, precio, ubicación, imágenes y disponibilidad),
 * valida las entradas y envía la información al almacenamiento o API correspondiente.
 */

// Formulario para crear o editar una cancha (cancha = null → crear).
function CanchaForm({ cancha, onGuardar, onCancelar, errorGuardado = '' }) {
  const editando = Boolean(cancha);

  const [values, setValues] = useState({
    nombre: cancha?.nombre ?? '',
    deporte: cancha?.deporte ?? '',
    comuna: cancha?.comuna ?? '',
    precio: cancha ? String(cancha.precio) : '',
    descripcion: cancha?.descripcion ?? '',
    imagen: '',
    disponible: cancha ? cancha.disponible : true,
  });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [errorArchivo, setErrorArchivo] = useState('');

  const precio = Number(values.precio);

  // Errores derivados de los valores (no son estado)
  const errors = {
    nombre: values.nombre.trim() === '' ? 'Ingresa el nombre de la cancha.' : '',
    deporte: values.deporte === '' ? 'Selecciona un deporte.' : '',
    comuna: values.comuna === '' ? 'Selecciona una comuna.' : '',
    precio: values.precio !== '' && precio >= 1000 && precio <= 100000
      ? '' : 'El precio debe ser mayor a $1.000 y menor a $100.000.',
    descripcion: values.descripcion.trim() === '' ? 'Ingresa una descripción.'
      : values.descripcion.length > 500 ? 'La descripción no puede superar los 500 caracteres.' : '',
    // Al crear la imagen es obligatoria; al editar se conserva la anterior
    imagen: errorArchivo || (!editando && !values.imagen ? 'Debes subir una imagen de la cancha.' : ''),
  };
  const isValid = (campo) => !errors[campo];
  const fieldClass = (campo, base = 'form-control') => {
    const mostrar = touched[campo] || submitted;
    if (!mostrar) return base;
    return isValid(campo) ? `${base} is-valid` : `${base} is-invalid`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true });

  const handleImagen = async (e) => {
    const archivo = e.target.files[0];
    setTouched({ ...touched, imagen: true });
    if (!archivo) {
      setValues({ ...values, imagen: '' });
      return;
    }
    if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
      setErrorArchivo('Solo se permiten imágenes PNG o JPG.');
      setValues({ ...values, imagen: '' });
      return;
    }
    try {
      const dataUrl = await leerImagen(archivo);
      setErrorArchivo('');
      setValues((anterior) => ({ ...anterior, imagen: dataUrl }));
    } catch {
      setErrorArchivo('No se pudo leer la imagen.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!Object.keys(errors).every(isValid)) return;
    onGuardar({
      nombre: values.nombre.trim(),
      deporte: values.deporte,
      comuna: values.comuna,
      precio,
      descripcion: values.descripcion.trim(),
      imagen: values.imagen || cancha?.imagen || '',
      disponible: values.disponible,
    });
  };

  return (
    <section>
      <h4>{editando ? 'Editar Cancha' : 'Agregar Cancha'}</h4>
      <small className="text-muted">Completa los datos para publicar tu cancha</small>

      <form className="mt-4" onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label" htmlFor="nombreCancha">Nombre de la cancha</label>
          <input type="text" id="nombreCancha" name="nombre" className={fieldClass('nombre')}
            placeholder="Ej: Cancha Central Norte" value={values.nombre} onChange={handleChange} onBlur={handleBlur} />
          <div className="invalid-feedback">{errors.nombre}</div>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="deporteCancha">Tipo de deporte</label>
          <select id="deporteCancha" name="deporte" className={fieldClass('deporte', 'form-select')}
            value={values.deporte} onChange={handleChange} onBlur={handleBlur}>
            <option value="">Seleccionar deporte...</option>
            {DEPORTES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <div className="invalid-feedback">{errors.deporte}</div>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="comunaCancha">Comuna</label>
          <select id="comunaCancha" name="comuna" className={fieldClass('comuna', 'form-select')}
            value={values.comuna} onChange={handleChange} onBlur={handleBlur}>
            <option value="">Seleccionar comuna...</option>
            {COMUNAS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="invalid-feedback">{errors.comuna}</div>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="precioCancha">Precio por hora ($)</label>
          <input type="number" id="precioCancha" name="precio" className={fieldClass('precio')}
            placeholder="0" value={values.precio} onChange={handleChange} onBlur={handleBlur} />
          <div className="invalid-feedback">{errors.precio}</div>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="descripcionCancha">Descripción</label>
          <textarea id="descripcionCancha" name="descripcion" className={fieldClass('descripcion')} rows="3"
            placeholder="Describe tu cancha..." value={values.descripcion} onChange={handleChange} onBlur={handleBlur}></textarea>
          <div className="invalid-feedback">{errors.descripcion}</div>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="imagenCancha">Imagen</label>
          <input type="file" id="imagenCancha" name="imagen" className={fieldClass('imagen')}
            accept="image/png, image/jpeg" onChange={handleImagen} />
          <small className="text-muted">PNG, JPG (se reduce automáticamente)</small>
          <div className="invalid-feedback">{errors.imagen}</div>
        </div>

        <div className="form-check form-switch mb-4">
          <input className="form-check-input" type="checkbox" id="disponibleCancha" checked={values.disponible}
            onChange={(e) => setValues({ ...values, disponible: e.target.checked })} />
          <label className="form-check-label" htmlFor="disponibleCancha">Disponible</label>
        </div>

        {errorGuardado && <div className="text-danger mb-3">{errorGuardado}</div>}

        <button type="submit" className="btn btn-dark">{editando ? 'Guardar Cambios' : 'Publicar'}</button>
        {editando && (
          <a href="#" className="ms-3" onClick={(e) => { e.preventDefault(); onCancelar(); }}>Cancelar</a>
        )}
      </form>
    </section>
  );
}

export default CanchaForm;
