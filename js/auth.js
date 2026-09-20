document.addEventListener('DOMContentLoaded', function () {
    const estaLogueado = localStorage.getItem('usuarioLogueado');
    const menuInvitado = document.getElementById('menuInvitado');
    const menuUsuario = document.getElementById('menuUsuario');

    if (estaLogueado && menuInvitado && menuUsuario) {
        menuInvitado.classList.add('d-none');
        menuUsuario.classList.remove('d-none');
    }

    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('usuarioLogueado');
            window.location.href = 'index.html';
        });
    }
});