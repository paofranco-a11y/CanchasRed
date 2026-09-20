/* Validación de formularios con JavaScript — en tiempo real */

const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexTelefono = /^[0-9+\s]{7,15}$/;

// Muestra el mensaje de error y marca el campo como inválido
function mostrarError(campo, texto) {
    campo.classList.add('is-invalid');
    const feedback = campo.parentElement.querySelector('.invalid-feedback');
    if (feedback) feedback.textContent = texto;
}

// Quita el error cuando el campo ya es válido
function limpiarError(campo) {
    campo.classList.remove('is-invalid');
}

// Revisa un campo y devuelve true/false según si es válido
function validarCampo(campo) {
    const valor = campo.value.trim();
    const tipo = campo.getAttribute('data-type') || campo.type;

    if (valor === '') {
        mostrarError(campo, 'Este campo es obligatorio.');
        return false;
    }

    if (tipo === 'email' && !regexCorreo.test(valor)) {
        mostrarError(campo, 'Ingresa un correo válido, ej: nombre@dominio.cl');
        return false;
    }

    if (tipo === 'tel' && !regexTelefono.test(valor)) {
        mostrarError(campo, 'Ingresa solo números, ej: +56912345678');
        return false;
    }

    limpiarError(campo);
    return true;
}

// Aplica la validación (en tiempo real + al enviar) a cada formulario con clase "form-validar"
document.querySelectorAll('.form-validar').forEach(function (form) {
    const campos = form.querySelectorAll('[data-required="true"]');

    // Validación en tiempo real: mientras el usuario escribe
    campos.forEach(function (campo) {
        campo.addEventListener('input', function () {
            validarCampo(campo);
        });
    });

    // Validación al enviar (revisa todo antes de aceptar el envío)
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        let formularioValido = true;
        campos.forEach(function (campo) {
            if (!validarCampo(campo)) {
                formularioValido = false;
            }
        });

        if (formularioValido) {
            form.reset();
            campos.forEach(limpiarError);

            const successMsg = form.querySelector('#submitSuccessMessage');
            if (successMsg) successMsg.classList.remove('d-none');

            const miniOk = document.getElementById('miniContactoOk');
            if (form.id === 'miniContactForm' && miniOk) miniOk.classList.remove('d-none');
        }
    });
});