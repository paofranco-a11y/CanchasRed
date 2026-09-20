// Elementos del formulario
const form = document.getElementById('formularioRegistro');
const campoCorreo = document.getElementById('correo');
const campoPassword = document.getElementById('password');
const campoConfirmar = document.getElementById('confirmPassword');

// Funciones para mostrar/quitar mensajes de error
function mostrarError(campo, spanError, mensaje) {
    campo.classList.add('is-invalid');
    spanError.textContent = mensaje;
}

function limpiarError(campo, spanError) {
    campo.classList.remove('is-invalid');
    spanError.textContent = '';
}

// Validación al enviar el formulario
form.addEventListener('submit', function (e) {
    e.preventDefault();
    let formularioValido = true;

    // Correo
    const errorCorreo = document.getElementById('errorCorreo');
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (campoCorreo.value.trim() === '' || !regexEmail.test(campoCorreo.value.trim())) {
        mostrarError(campoCorreo, errorCorreo, 'Ingresa un correo válido.');
        formularioValido = false;
    } else {
        limpiarError(campoCorreo, errorCorreo);
    }

    // Contraseña
    const errorPassword = document.getElementById('errorPassword');
    if (campoPassword.value.trim().length < 6) {
        mostrarError(campoPassword, errorPassword, 'La contraseña debe tener al menos 6 caracteres.');
        formularioValido = false;
    } else {
        limpiarError(campoPassword, errorPassword);
    }

    // Confirmar contraseña
    const errorConfirmar = document.getElementById('errorConfirmPassword');
    if (campoConfirmar.value.trim() !== campoPassword.value.trim() || campoConfirmar.value.trim() === '') {
        mostrarError(campoConfirmar, errorConfirmar, 'Las contraseñas no coinciden.');
        formularioValido = false;
    } else {
        limpiarError(campoConfirmar, errorConfirmar);
    }

    // Si todo pasó, guardamos el usuario
    if (formularioValido) {
        const rolSeleccionado = document.querySelector('input[name="rol"]:checked').value;
        const usuario = {
            correo: campoCorreo.value.trim(),
            clave: campoPassword.value.trim(),
            rol: rolSeleccionado
        };
        localStorage.setItem('usuarioRegistrado', JSON.stringify(usuario));
        alert('Cuenta creada correctamente. Ahora inicia sesión.');
        window.location.href = 'login.html';
    }
});