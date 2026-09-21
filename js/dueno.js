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

// Leer solo las canchas del dueño logueado
function obtenerCanchas() {
    const todas = JSON.parse(localStorage.getItem('misCanchas')) || [];
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioRegistrado'));
    if (!usuarioActual) return [];
    return todas.filter(c => c.correoDueno === usuarioActual.correo);
}

// Guarda las canchas del dueño actual sin borrar las de otros dueños
function guardarCanchas(canchasDelDueno) {
    const todas = JSON.parse(localStorage.getItem('misCanchas')) || [];
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioRegistrado'));
    const deOtrosDuenos = todas.filter(c => c.correoDueno !== usuarioActual.correo);
    const actualizadas = deOtrosDuenos.concat(canchasDelDueno);
    localStorage.setItem('misCanchas', JSON.stringify(actualizadas));
}

// Dibujar la lista de canchas del dueño
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
        const foto = c.imagen ? `<img src="${c.imagen}" style="width:60px;height:60px;object-fit:cover;border-radius:6px;margin-right:10px;">` : '';

        const item = document.createElement('div');
        item.className = 'list-group-item d-flex justify-content-between align-items-center flex-wrap';
        item.innerHTML = `
            <div class="d-flex align-items-center">
                ${foto}
                <div>
                    <strong>${c.nombre}</strong><br>
                    <span class="text-muted">${c.deporte}</span>
                    <span class="badge ${colorEstado} ms-2">${estado}</span>
                    <span class="ms-2">$${Number(c.precio).toLocaleString('es-CL')}/hr</span>
                </div>
            </div>
            <div>
                <button class="btn btn-outline-dark btn-sm me-2" onclick="editarCancha('${c.id}')">Ver detalle</button>
                <button class="btn btn-outline-danger btn-sm" onclick="abrirEliminar('${c.id}')">Eliminar</button>
            </div>
        `;
        contenedor.appendChild(item);
    });
}

// Precarga el formulario con los datos de una cancha existente
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

// Guarda la cancha (nueva o editada), incluyendo la imagen y el correo del dueño
function guardarConImagen(imagenBase64) {
    const canchas = obtenerCanchas();
    const idExistente = document.getElementById('canchaId').value;
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioRegistrado'));

    const datosCancha = {
        id: idExistente || Date.now().toString(),
        nombre: document.getElementById('nombreCancha').value.trim(),
        deporte: document.getElementById('deporteCancha').value,
        comuna: document.getElementById('comunaCancha').value,
        precio: Number(document.getElementById('precioCancha').value),
        descripcion: document.getElementById('descripcionCancha').value.trim(),
        disponible: document.getElementById('disponibleCancha').checked,
        imagen: imagenBase64 || '',
        correoDueno: usuarioActual ? usuarioActual.correo : ''
    };

    if (idExistente) {
        const indice = canchas.findIndex(c => c.id === idExistente);
        if (!imagenBase64) datosCancha.imagen = canchas[indice].imagen;
        canchas[indice] = datosCancha;
    } else {
        canchas.push(datosCancha);
    }

    guardarCanchas(canchas);
    mostrarSeccion('lista');
}

// Validar y enviar el formulario
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

    const archivoImagen = document.getElementById('imagenCancha').files[0];
    const idExistenteCheck = document.getElementById('canchaId').value;

    // La imagen es obligatoria solo al crear (al editar, puede conservar la anterior)
    if (!archivoImagen && !idExistenteCheck) {
        document.getElementById('imagenCancha').classList.add('is-invalid');
        valido = false;
    } else {
        document.getElementById('imagenCancha').classList.remove('is-invalid');
    }

    if (!valido) return;

    if (archivoImagen) {
        const lector = new FileReader();
        lector.onload = function () {
            guardarConImagen(lector.result);
        };
        lector.readAsDataURL(archivoImagen);
    } else {
        guardarConImagen(null);
    }
});

// Eliminar cancha
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

function mostrarResumen() {
    const canchas = obtenerCanchas();
    const activas = canchas.filter(c => c.disponible).length;
    const usuario = JSON.parse(localStorage.getItem('usuarioRegistrado'));

    document.getElementById('resumenTotal').textContent = canchas.length;
    document.getElementById('resumenActivas').textContent = activas;
    document.getElementById('resumenCorreo').textContent = usuario ? usuario.correo : '-';
}

mostrarResumen();

// Al cargar la página, muestra la lista
renderizarLista();