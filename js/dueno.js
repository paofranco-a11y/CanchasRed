// Protección: solo dueños logueados pueden ver esta página
const estaLogueado = localStorage.getItem('usuarioLogueado');
const rolActivo = localStorage.getItem('rolActivo');

if (!estaLogueado || rolActivo !== 'dueno') {
    window.location.href = 'login.html';
}

// Cambiar entre pestañas
function mostrarSeccion(seccion) {
    const lista = document.getElementById('seccionLista');
    const form = document.getElementById('seccionForm');
    const tabLista = document.getElementById('tabMisCanchas');
    const tabForm = document.getElementById('tabAgregar');

    if (seccion === 'lista') {
        lista.classList.remove('d-none');
        form.classList.add('d-none');
        tabLista.classList.add('active');
        tabForm.classList.remove('active');
        renderizarLista();
    } else {
        lista.classList.add('d-none');
        form.classList.remove('d-none');
        tabLista.classList.remove('active');
        tabForm.classList.add('active');
    }
}

// Preparar formulario para una cancha nueva
function nuevaCancha() {
    document.getElementById('formCancha').reset();
    document.getElementById('canchaId').value = '';
    document.getElementById('tituloForm').textContent = 'Agregar Cancha';
    document.getElementById('subtituloForm').textContent = 'Completa los datos para publicar tu cancha';
    document.getElementById('btnGuardarCancha').textContent = 'Publicar';
    document.getElementById('btnCancelarForm').classList.add('d-none');
    mostrarSeccion('form');
}

// Leer canchas guardadas
function obtenerCanchas() {
    return JSON.parse(localStorage.getItem('misCanchas')) || [];
}

function guardarCanchas(canchas) {
    localStorage.setItem('misCanchas', JSON.stringify(canchas));
}

// Dibujar la lista de canchas
function renderizarLista() {
    const canchas = obtenerCanchas();
    const contenedor = document.getElementById('listaCanchas');
    const vacio = document.getElementById('listaVacia');

    contenedor.innerHTML = '';

    if (canchas.length === 0) {
        vacio.classList.remove('d-none');
        return;
    }
    vacio.classList.add('d-none');

    canchas.forEach(function (c) {
        const estado = c.disponible ? 'Activa' : 'Inactiva';
        const colorEstado = c.disponible ? 'bg-success' : 'bg-secondary';

        const item = document.createElement('div');
        item.className = 'list-group-item d-flex justify-content-between align-items-center flex-wrap';
        item.innerHTML = `
            <div>
                <strong>${c.nombre}</strong><br>
                <span class="text-muted">${c.deporte}</span>
                <span class="badge ${colorEstado} ms-2">${estado}</span>
                <span class="ms-2">$${Number(c.precio).toLocaleString('es-CL')}/hr</span>
            </div>
            <div>
                <button class="btn btn-outline-dark btn-sm me-2" onclick="editarCancha('${c.id}')">Ver detalle</button>
                <button class="btn btn-outline-danger btn-sm" onclick="abrirEliminar('${c.id}')">Eliminar</button>
            </div>
        `;
        contenedor.appendChild(item);
    });
}

// Editar: precarga el formulario con los datos existentes
function editarCancha(id) {
    const canchas = obtenerCanchas();
    const cancha = canchas.find(c => c.id === id);
    if (!cancha) return;

    document.getElementById('canchaId').value = cancha.id;
    document.getElementById('nombreCancha').value = cancha.nombre;
    document.getElementById('deporteCancha').value = cancha.deporte;
    document.getElementById('comunaCancha').value = cancha.comuna;
    document.getElementById('precioCancha').value = cancha.precio;
    document.getElementById('descripcionCancha').value = cancha.descripcion;
    document.getElementById('disponibleCancha').checked = cancha.disponible;

    document.getElementById('tituloForm').textContent = 'Editar Cancha';
    document.getElementById('subtituloForm').textContent = 'Modifica los datos de tu cancha';
    document.getElementById('btnGuardarCancha').textContent = 'Guardar Cambios';
    document.getElementById('btnCancelarForm').classList.remove('d-none');

    mostrarSeccion('form');
}

// Guardar (crear o actualizar) al enviar el formulario
document.getElementById('formCancha').addEventListener('submit', function (e) {
    e.preventDefault();

    const precio = Number(document.getElementById('precioCancha').value);
    const descripcion = document.getElementById('descripcionCancha').value.trim();
    let valido = true;

    if (precio < 1000 || precio > 100000) {
        document.getElementById('precioCancha').classList.add('is-invalid');
        valido = false;
    } else {
        document.getElementById('precioCancha').classList.remove('is-invalid');
    }

    if (descripcion.length > 500 || descripcion === '') {
        document.getElementById('descripcionCancha').classList.add('is-invalid');
        valido = false;
    } else {
        document.getElementById('descripcionCancha').classList.remove('is-invalid');
    }

    if (!document.getElementById('nombreCancha').value.trim()) {
        document.getElementById('nombreCancha').classList.add('is-invalid');
        valido = false;
    } else {
        document.getElementById('nombreCancha').classList.remove('is-invalid');
    }

    if (!document.getElementById('deporteCancha').value) {
        document.getElementById('deporteCancha').classList.add('is-invalid');
        valido = false;
    } else {
        document.getElementById('deporteCancha').classList.remove('is-invalid');
    }

    if (!document.getElementById('comunaCancha').value) {
        document.getElementById('comunaCancha').classList.add('is-invalid');
        valido = false;
    } else {
        document.getElementById('comunaCancha').classList.remove('is-invalid');
    }

    if (!valido) return;

    const canchas = obtenerCanchas();
    const idExistente = document.getElementById('canchaId').value;

    const datosCancha = {
        id: idExistente || Date.now().toString(),
        nombre: document.getElementById('nombreCancha').value.trim(),
        deporte: document.getElementById('deporteCancha').value,
        comuna: document.getElementById('comunaCancha').value,
        precio: precio,
        descripcion: descripcion,
        disponible: document.getElementById('disponibleCancha').checked
    };

    if (idExistente) {
        const indice = canchas.findIndex(c => c.id === idExistente);
        canchas[indice] = datosCancha;
    } else {
        canchas.push(datosCancha);
    }

    guardarCanchas(canchas);
    mostrarSeccion('lista');
});

// Eliminar
let idAEliminar = null;

function abrirEliminar(id) {
    const canchas = obtenerCanchas();
    const cancha = canchas.find(c => c.id === id);
    if (!cancha) return;

    idAEliminar = id;
    document.getElementById('nombreCanchaEliminar').textContent = cancha.nombre;

    const modal = new bootstrap.Modal(document.getElementById('modalEliminar'));
    modal.show();
}

document.getElementById('btnConfirmarEliminar').addEventListener('click', function () {
    let canchas = obtenerCanchas();
    canchas = canchas.filter(c => c.id !== idAEliminar);
    guardarCanchas(canchas);

    const modal = bootstrap.Modal.getInstance(document.getElementById('modalEliminar'));
    modal.hide();

    renderizarLista();
});

// Al cargar la página, muestra la lista
renderizarLista();