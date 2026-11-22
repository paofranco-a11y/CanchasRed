// Canchas de ejemplo, iguales a las del index (para que "detalle" también las conozca)
const canchasEstaticas = {
    "Cancha Central Norte": { deporte: "Tenis", comuna: "Ñuñoa", precio: 7000, descripcion: "Cancha de pasto sintético con iluminación nocturna. Capacidad para 10 personas.", imagen: "assets/img/portfolio/canchaTenis.png" },
    "Multicancha Barrio Sur": { deporte: "Fútbol", comuna: "San Miguel", precio: 6500, descripcion: "Cancha de cemento pulido con tableros reglamentarios y graderías.", imagen: "assets/img/portfolio/canchaFutbol.jpg" },
    "Court Providencia": { deporte: "Basquetbol", comuna: "Providencia", precio: 12000, descripcion: "Cancha techada con piso de madera y tableros profesionales.", imagen: "assets/img/portfolio/canchaBasquet.jpg" }
};

// Lee los parámetros que vienen en la URL (?cancha=... o ?id=...)
const parametros = new URLSearchParams(window.location.search);
const nombreParam = parametros.get('cancha');
const idParam = parametros.get('id');

let cancha = null;

if (nombreParam && canchasEstaticas[nombreParam]) {
    cancha = { nombre: nombreParam, ...canchasEstaticas[nombreParam] };
} else if (idParam) {
    const canchasDelDueño = JSON.parse(localStorage.getItem('misCanchas')) || [];
    cancha = canchasDelDueño.find(c => c.id === idParam);
}

if (cancha) {
    document.getElementById('detalleNombre').textContent = cancha.nombre;
    document.getElementById('detalleDeporte').textContent = cancha.deporte;
    document.getElementById('detalleComuna').textContent = cancha.comuna;
    document.getElementById('detalleDescripcion').textContent = cancha.descripcion;
    document.getElementById('detallePrecio').textContent = '$' + Number(cancha.precio).toLocaleString('es-CL');
    document.getElementById('detalleImagen').src = cancha.imagen || 'assets/img/portfolio/canchaTenis.png';
    document.getElementById('detalleImagen').alt = cancha.nombre;
}

// Abrir modal de reserva: solo si hay sesión activa
document.getElementById('btnAbrirReserva').addEventListener('click', function () {
    const estaLogueado = localStorage.getItem('usuarioLogueado');

    if (!estaLogueado) {
        alert('Debes iniciar sesión para reservar una cancha.');
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('reservaNombreCancha').textContent = cancha.nombre;
    document.getElementById('reservaPrecioCancha').textContent = '$' + Number(cancha.precio).toLocaleString('es-CL') + ' /hora';

    const modal = new bootstrap.Modal(document.getElementById('modalReserva'));
    modal.show();
});

// Confirmar reserva, guardando a qué usuario pertenece
document.getElementById('btnConfirmarReserva').addEventListener('click', function () {
    const fecha = document.getElementById('reservaFecha').value;
    const hora = document.getElementById('reservaHora').value;
    const horas = document.getElementById('reservaHoras').value;

    if (!fecha || !hora) {
        alert('Debes elegir fecha y hora.');
        return;
    }

    const usuarioActual = JSON.parse(localStorage.getItem('usuarioRegistrado'));
    const reservas = JSON.parse(localStorage.getItem('misReservas')) || [];
    reservas.push({
        id: Date.now().toString(),
        cancha: cancha.nombre,
        precio: cancha.precio,
        fecha: fecha,
        hora: hora,
        horas: horas,
        correoUsuario: usuarioActual ? usuarioActual.correo : ''
    });
    localStorage.setItem('misReservas', JSON.stringify(reservas));

    const modal = bootstrap.Modal.getInstance(document.getElementById('modalReserva'));
    modal.hide();

    alert('¡Reserva confirmada!');
    window.location.href = 'index.html';
});