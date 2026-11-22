const form = document.getElementById('formularioLogin');
const campoCorreo = document.getElementById('correoLogin');
const campoPassword = document.getElementById('passwordLogin');

function mostrarError(campo, spanError, mensaje) {
    campo.classList.add('is-invalid');
    spanError.textContent = mensaje;
}

function limpiarError(campo, spanError) {
    campo.classList.remove('is-invalid');
    spanError.textContent = '';
}

form.addEventListener('submit', function (e) {
    e.preventDefault();
    let formularioValido = true;


    const errorCorreo = document.getElementById('errorCorreoLogin');
    if (campoCorreo.value.trim() === '') {
        mostrarError(campoCorreo, errorCorreo, 'Ingresa tu correo.');
        formularioValido = false;
    } else {
        limpiarError(campoCorreo, errorCorreo);
    }

    const errorPassword = document.getElementById('errorPasswordLogin');
    if (campoPassword.value.trim() === '') {
        mostrarError(campoPassword, errorPassword, 'Ingresa tu contraseña.');
        formularioValido = false;
    } else {
        limpiarError(campoPassword, errorPassword);
    }

    if (!formularioValido) return;

    // --- Cuenta de administrador  ---
    const correoIngresado = campoCorreo.value.trim().toLowerCase();
    const claveIngresada = campoPassword.value.trim();

    const usuarioAdmin = 'usuario_admin@duocuc.cl';
    const claveAdmin = '123456';

    if (correoIngresado === usuarioAdmin && claveIngresada === claveAdmin) {
        localStorage.setItem('usuarioLogueado', 'true');
        localStorage.setItem('rolActivo', 'admin');
        window.location.href = 'actividad-admin.html';
        return; 
    }
    // -----------------------------------------------------------------

    const usuarioGuardado = JSON.parse(localStorage.getItem('usuarioRegistrado'));

    if (!usuarioGuardado) {
        mostrarError(campoCorreo, errorCorreo, 'No existe ninguna cuenta registrada.');
        return;
    }

    const correoCoincide = usuarioGuardado.correo === campoCorreo.value.trim();
    const claveCoincide = usuarioGuardado.clave === campoPassword.value.trim();

    if (correoCoincide && claveCoincide) {
        localStorage.setItem('usuarioLogueado', 'true');
        localStorage.setItem('rolActivo', usuarioGuardado.rol);

        if (usuarioGuardado.rol === 'dueno') {
            window.location.href = 'perfil-dueno.html';
        } else {
            window.location.href = 'index.html';
        }
    } else {
        mostrarError(campoPassword, errorPassword, 'Correo o contraseña incorrectos.');
    }

    

});