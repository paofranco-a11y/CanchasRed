
export function validarFormulario(formData) {
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