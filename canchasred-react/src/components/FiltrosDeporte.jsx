import { DEPORTES } from '../data/canchas';

// Botones de filtro por deporte. El estado vive en el padre (activo / onCambiar).
function FiltrosDeporte({ activo, onCambiar }) {
  const opciones = ['Todos', ...DEPORTES];

  return (
    <nav className="barra-filtros text-center py-3" aria-label="Filtros por deporte">
      <div className="container">
        {opciones.map((deporte, i) => (
          <button
            key={deporte}
            type="button"
            className={
              (activo === deporte ? 'btn btn-primary' : 'btn btn-outline-primary') +
              (i < opciones.length - 1 ? ' me-2' : '') + ' mb-2 btn-filtro'
            }
            onClick={() => onCambiar(deporte)}
          >
            {deporte}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default FiltrosDeporte;
