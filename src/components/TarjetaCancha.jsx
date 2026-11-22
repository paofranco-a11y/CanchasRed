export function TarjetaCancha({
  nombre,
  comuna,
  deporte,
  descripcion,
  precio,
  imagen,
  rol,
  onReservar,
  onEliminar,
}) {
  return (
    <div
      className="col-lg-4 col-sm-6 mb-4 item-cancha"
      data-nombre={nombre}
      data-comuna={comuna}
      data-deporte={deporte}
    >
      <article className="card tarjeta-cancha h-100 text-start shadow-sm">
        <div className="tarjeta-foto-bloque">
          <span
            className="badge bg-success etiqueta-deporte"
            style={{ width: 'auto', display: 'inline-block' }}
          >
            {deporte}
          </span>
          <img
            src={imagen}
            alt={`Foto de ${nombre}`}
            className="card-img-top imagen-cancha"
          />
        </div>

        <div className="card-body tarjeta-informacion d-flex flex-column">
          <h2 className="card-title nombre-cancha h5">{nombre}</h2>
          <p className="comuna-cancha text-muted mb-2">{comuna}</p>
          <p className="card-text descripcion-cancha flex-grow-1">{descripcion}</p>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <span className="precio-hora">
              <strong>{precio}</strong> /hora
            </span>

            {(!rol || rol === 'deportista') && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={onReservar}
              >
                Reservar
              </button>
            )}

            {(rol === 'dueno' || rol === 'admin') && (
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={onEliminar}
              >
                Eliminar
              </button>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}