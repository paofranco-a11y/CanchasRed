const inputBuscador = document.getElementById('buscadorCanchas');
const botonesFiltro = document.querySelectorAll('.btn-filtro');
let filtroActivo = 'todos';

function aplicarFiltros() {
    const texto = inputBuscador.value.trim().toLowerCase();
    const tarjetas = document.querySelectorAll('.item-cancha');

    tarjetas.forEach(function (tarjeta) {
        const nombre = tarjeta.dataset.nombre.toLowerCase();
        const comuna = tarjeta.dataset.comuna.toLowerCase();
        const deporte = tarjeta.dataset.deporte.toLowerCase();

        const coincideTexto = nombre.includes(texto) || comuna.includes(texto) || deporte.includes(texto);
        const coincideDeporte = filtroActivo === 'todos' || deporte === filtroActivo;

        tarjeta.style.display = (coincideTexto && coincideDeporte) ? '' : 'none';
    });
}

if (inputBuscador) {
    inputBuscador.addEventListener('input', aplicarFiltros);
}

botonesFiltro.forEach(function (boton) {
    boton.addEventListener('click', function () {
        botonesFiltro.forEach(function (b) {
            b.classList.remove('btn-primary');
            b.classList.add('btn-outline-primary');
        });

        boton.classList.remove('btn-outline-primary');
        boton.classList.add('btn-primary');

        filtroActivo = boton.dataset.filtro;
        aplicarFiltros();
    });
});

