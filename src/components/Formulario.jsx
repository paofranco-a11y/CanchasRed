import { useState } from 'react';



export function Formulario() {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
    });

    const [errors, setErrors] = useState({});
    const [enviado, setEnviado] = useState(false);

    // Actualiza el estado conforme el usuario escribe
    const handleChange = (e) => {
    const { id, value } = e.target;
    const campo = id.replace('mini', '').toLowerCase();

    if (campo === 'telefono') {
        // Reemplaza todo lo que no sea un número por un string vacío
        const soloNumeros = value.replace(/\D/g, '');
        setFormData({ ...formData, [campo]: soloNumeros });
    } else {
        setFormData({ ...formData, [campo]: value });
    }
    };

    // Función de validación
    const validar = () => {
    let nuevosErrores = {};
    if (!formData.nombre.trim()) nuevosErrores.nombre = true;
    
    // Validación de email
    const regexEmail = /\S+@\S+\.\S+/;
    if (!formData.email.trim() || !regexEmail.test(formData.email)) {
        nuevosErrores.email = true;
    }
    
    // Validación de teléfono: que no esté vacío y que sean solo números
    const regexTelefono = /^\d+$/;
    if (!formData.telefono.trim() || !regexTelefono.test(formData.telefono)) {
        nuevosErrores.telefono = true;
    }
    
    if (!formData.mensaje.trim()) nuevosErrores.mensaje = true;

    return nuevosErrores;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const erroresEncontrados = validar();
        setErrors(erroresEncontrados);

        if (Object.keys(erroresEncontrados).length === 0) {
            setEnviado(true);
            // Aquí puedes enviar los datos al servidor
        } else {
            setEnviado(false);
        }
    };

    function validarFormulario(formData) {
    let errores = {};
    if (!formData.nombre || !formData.nombre.trim()) errores.nombre = true;
    
    const regexEmail = /\S+@\S+\.\S+/;
    if (!formData.email || !regexEmail.test(formData.email)) {
        errores.email = true;
    }
    
    if (!formData.telefono || !formData.telefono.trim()) errores.telefono = true;
    if (!formData.mensaje || !formData.mensaje.trim()) errores.mensaje = true;

    return errores;
    }

    return (
        <section className="page-section bg-dark text-white" id="mini-contacto">
            <div className="container">
                <div className="text-center mb-4">
                    <h2 className="section-heading">¿Tienes dudas?</h2>
                    <p className="section-subheading text-white-50">Escríbenos y te ayudamos a encontrar tu cancha ideal.</p>
                </div>
                <form id="miniContactForm" className="form-validar" onSubmit={handleSubmit} noValidate>
                    <div className="row align-items-stretch mb-4">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.nombre ? 'is-invalid' : ''}`} 
                                    id="miniNombre" 
                                    placeholder="Nombre" 
                                    value={formData.nombre}
                                    onChange={handleChange}
                                />
                                <div className="invalid-feedback">Ingresa tu nombre.</div>
                            </div>
                            <div className="mb-3">
                                <input 
                                    type="email" 
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
                                    id="miniEmail" 
                                    placeholder="Correo electrónico" 
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <div className="invalid-feedback">Ingresa un correo válido.</div>
                            </div>
                            <div className="mb-md-0">
                                <input 
                                    type="tel" 
                                    className={`form-control ${errors.telefono ? 'is-invalid' : ''}`} 
                                    id="miniTelefono" 
                                    placeholder="Tu teléfono" 
                                    value={formData.telefono}
                                    onChange={handleChange}
                                />
                                <div className="invalid-feedback">Ingresa tu teléfono.</div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <textarea 
                                className={`form-control h-100 ${errors.mensaje ? 'is-invalid' : ''}`} 
                                id="miniMensaje" 
                                placeholder="Mensaje" 
                                value={formData.mensaje}
                                onChange={handleChange}
                                style={{ minHeight: '10rem' }}
                            ></textarea>
                            <div className="invalid-feedback">Escribe tu mensaje.</div>
                        </div>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary">Enviar</button>
                    </div>
                </form>
                <div id="miniContactoOk" className={`text-center text-success mt-3 ${enviado ? '' : 'd-none'}`}>
                    ¡Gracias! Te contactaremos pronto.
                </div>
            </div>
        </section>
    );
}