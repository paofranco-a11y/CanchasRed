// import: traemos la lista DEPORTES desde nuestro archivo de datos para no escribir los nombres a mano
import { DEPORTES } from '../data/canchas';

// props: recibimos 'activo' (qué botón está seleccionado) y 'onCambiar' (función para avisarle al padre cuando cambia)
function FiltrosDeporte({ activo, onCambiar }) {
  // Agregamos 'Todos' al principio de la lista de deportes para permitir quitar cualquier filtro
  const opciones = ['Todos', ...DEPORTES];

  return (
    <nav className="barra-filtros text-center py-3" aria-label="Filtros por deporte">
      <div className="container">
        {/* .map: recorre el arreglo y transforma cada deporte en un botón HTML en pantalla */}
        {opciones.map((deporte, i) => (
          <button
            // key: identificador único obligatorio en React para que sepa qué elemento de la lista cambió
            key={deporte}
            type="button"
            // Si el botón coincide con el deporte activo lo pinta azul (btn-primary), si no, solo con borde (btn-outline-primary)
            className={
              (activo === deporte ? 'btn btn-primary' : 'btn btn-outline-primary') +
              (i < opciones.length - 1 ? ' me-2' : '') + ' mb-2 btn-filtro'
            }
            // Al hacer clic, ejecuta la función que nos pasó el padre enviándole el deporte elegido
            onClick={() => onCambiar(deporte)}
          >
            {deporte}
          </button>
        ))}
      </div>
    </nav>
  );
}

// export default: exporta este componente para que Home.jsx pueda mostrar la barra de filtros
export default FiltrosDeporte;
