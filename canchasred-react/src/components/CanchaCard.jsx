// import: traemos Link de react-router-dom para navegar sin recargar la página y una función para dar formato al precio
import { Link } from 'react-router-dom';
import { formatearPrecio } from '../utils/validators';

// props: datos que el componente padre (Home) le pasa al hijo (CanchaCard); aquí recibimos la cancha para mostrarla
function CanchaCard({ cancha }) {
  return (
    <div className="col-lg-4 col-sm-6 mb-4 item-cancha">
      <article className="card tarjeta-cancha h-100">
        <div className="tarjeta-foto-bloque">
          <span className="badge bg-success etiqueta-deporte">{cancha.deporte}</span>
          <img src={cancha.imagen} alt={`Foto de ${cancha.nombre}`} className="card-img-top imagen-cancha" />
        </div>
        <div className="card-body tarjeta-informacion">
          <h2 className="card-title nombre-cancha h5">{cancha.nombre}</h2>
          <p className="comuna-cancha text-muted">{cancha.comuna}</p>
          <p className="card-text descripcion-cancha">{cancha.descripcion}</p>
          <div className="d-flex justify-content-between align-items-center">
            {/* Convierte el número (ej: 7000) a texto chileno ("$7.000") para que se vea ordenado */}
            <span className="precio-hora"><strong>{formatearPrecio(cancha.precio)}</strong> /hora</span>
            {/* Link cambia la URL en el navegador sin recargar toda la página web como haría un <a> común */}
            <Link to={`/cancha/${cancha.id}`} className="btn btn-primary btn-sm">Ver Detalle</Link>
          </div>
        </div>
      </article>
    </div>
  );
}

// export default: comparte este componente para que otros archivos (como Home.jsx) lo puedan importar y usar
export default CanchaCard;
