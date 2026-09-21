// Protección: solo usuarios logueados pueden ver esta página
if (!localStorage.getItem('usuarioLogueado')) {
    window.location.href = 'login.html';
}

const usuarioActual = JSON.parse(localStorage.getItem('usuarioRegistrado'));
const todasLasReservas = JSON.parse(localStorage.getItem('misReservas')) || [];
const reservas = usuarioActual ? todasLasReservas.filter(r => r.correoUsuario === usuarioActual.correo) : [];
const contenedor = document.getElementById('listaReservas');
const vacio = document.getElementById('reservasVacia');

if (reservas.length === 0) {
    vacio.classList.remove('d-none');
} else {
    reservas.forEach(function (r) {
        const item = document.createElement('div');
        item.className = 'list-group-item';
        item.innerHTML = `
            <strong>${r.cancha}</strong><br>
            <span class="text-muted">${r.fecha} - ${r.hora} (${r.horas} hora${r.horas > 1 ? 's' : ''})</span><br>
            <span>$${Number(r.precio).toLocaleString('es-CL')} /hora</span>
        `;
        contenedor.appendChild(item);
    });
}

// Cerrar sesión
document.getElementById('btnCerrarSesion').addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('usuarioLogueado');
    localStorage.removeItem('rolActivo');
    window.location.href = 'index.html';
});