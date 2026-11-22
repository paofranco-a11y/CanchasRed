function agregarCanchasDelDueño() {
    const canchasGuardadas = JSON.parse(localStorage.getItem('misCanchas')) || [];
    const canchasDisponibles = canchasGuardadas.filter(c => c.disponible);

    const contenedor = document.getElementById('contenedorCanchas');

    canchasDisponibles.forEach(function (c) {
        const columna = document.createElement('div');
        columna.className = 'col-lg-4 col-sm-6 mb-4 item-cancha';
        columna.dataset.nombre = c.nombre;
        columna.dataset.comuna = c.comuna;
        columna.dataset.deporte = c.deporte.toLowerCase();

        const foto = c.imagen ? `<img src="${c.imagen}" alt="${c.nombre}" class="card-img-top imagen-cancha"/>` : '';

        columna.innerHTML = `
            <article class="card tarjeta-cancha h-100">
                <div class="tarjeta-foto-bloque">
                    <span class="badge bg-success etiqueta-deporte">${c.deporte}</span>
                    ${foto}
                </div>
                <div class="card-body tarjeta-informacion">
                    <h2 class="card-title nombre-cancha h5">${c.nombre}</h2>
                    <p class="comuna-cancha text-muted">${c.comuna}</p>
                    <p class="card-text descripcion-cancha">${c.descripcion}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="precio-hora"><strong>$${Number(c.precio).toLocaleString('es-CL')}</strong> /hora</span>
                        <a href="detalle-cancha.html?id=${c.id}" class="btn btn-primary btn-sm">Ver Detalle</a>
                    </div>
                </div>
            </article>
        `;
        contenedor.appendChild(columna);
    });
}

agregarCanchasDelDueño();