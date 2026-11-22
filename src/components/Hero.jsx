export function Hero() {
  return (
    <header className="masthead">
      <div className="container contenido-centrado">
        <div className="masthead-heading text-uppercase">Encuentra tu Cancha</div>
        <p className="masthead-subheading">Descubre las mejores canchas de deporte en tu área.</p>
        <div className="caja-busqueda">
          <input type="text" className="form-control" id="buscadorCanchas" placeholder="Buscar canchas por ubicación o deporte" />
        </div>
      </div>

    
    </header>

    
  );
}