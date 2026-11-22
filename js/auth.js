document.addEventListener('DOMContentLoaded', function () {
    const estaLogueado = localStorage.getItem('usuarioLogueado');
    const rolActivo = localStorage.getItem('rolActivo');

    const menuInvitado = document.getElementById('menuInvitado');
    const menuUsuario = document.getElementById('menuUsuario');
    const menuDueno = document.getElementById('menuDueno');
    const footerInvitado = document.getElementById('footerLinksInvitado');
    const footerUsuario = document.getElementById('footerLinksUsuario');
    const footerDueno = document.getElementById('footerLinksDueno');

    if (estaLogueado && rolActivo === 'dueno' && menuDueno) {
        menuInvitado.classList.add('d-none');
        if (menuUsuario) menuUsuario.classList.add('d-none');
        menuDueno.classList.remove('d-none');
    } else if (estaLogueado && menuInvitado && menuUsuario) {
        menuInvitado.classList.add('d-none');
        menuUsuario.classList.remove('d-none');
    }

    if (estaLogueado && rolActivo === 'dueno' && footerDueno) {
        footerInvitado.classList.add('d-none');
        if (footerUsuario) footerUsuario.classList.add('d-none');
        footerDueno.classList.remove('d-none');
    } else if (estaLogueado && footerInvitado && footerUsuario) {
        footerInvitado.classList.add('d-none');
        footerUsuario.classList.remove('d-none');
    }

    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('usuarioLogueado');
            localStorage.removeItem('rolActivo');
            window.location.href = 'index.html';
        });
    }

    const btnCerrarSesionDueno = document.getElementById('btnCerrarSesionDueno');
    if (btnCerrarSesionDueno) {
        btnCerrarSesionDueno.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('usuarioLogueado');
            localStorage.removeItem('rolActivo');
            window.location.href = 'index.html';
        });
    }
});