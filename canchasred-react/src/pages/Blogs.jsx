// import: traemos componentes compartidos (NavBar y Footer) y las fotos para los artículos del blog
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import imgBlog1 from '../assets/img/ImgBlog1.jpg';
import imgBlog2 from '../assets/img/ImgBlog2.jpg';
import imgBlog4 from '../assets/img/ImgBlog4.jpg';

// Página informativa con artículos sobre los beneficios de digitalizar reservas y casos de éxito de recintos
function Blogs() {
  return (
    <>
      {/* Pasamos solido para que el menú tenga fondo oscuro fijo, porque esta página no tiene foto hero */}
      <NavBar solido />
      <main className="contenedor-detalle-articulo" style={{ paddingTop: '8rem' }}>
        <div className="container">
          <article className="articulo-completo">
            <h1>Beneficios de la Digitalización</h1>
            <p className="resumen-articulo">
              Gracias a la digitalización del inventario y la reserva inmediata, el recinto pasó
              de planillas manuales a registrar más de 120 horas arrendadas al mes sin cancelaciones de último minuto.
            </p>
            <p>
              En mayo de 2026, el complejo "Central Norte" de Ñuñoa administraba cuatro canchas únicamente
              mediante WhatsApp y llamadas telefónicas. El cruce de reservas y los turnos sin pagar de los
              días martes y miércoles por la noche generaban pérdidas continuas.
            </p>
            <img src={imgBlog1} alt="Foto del Complejo Cancha Central Norte" className="imagen-cancha-detalle" />
            <div className="cuerpo-historia">
              <p>
                Tras integrarse a la plataforma <strong>CanchasRed</strong>, publicaron sus horarios disponibles
                con confirmación inmediata y pasarela de pago directa. El resultado fue inmediato:
              </p>
              <ul className="lista-resultados">
                <li>Reducción del 80% en horas nocturnas sin ocupar.</li>
                <li>Eliminación total de reservas duplicadas.</li>
                <li>Más de $1.800.000 generados en reservas automáticas durante su primer mes en el sistema.</li>
              </ul>
            </div>

            <h2>Deportistas organizaron su primer torneo relámpago en menos de 48 horas</h2>
            <p>
              Coordinar a varios planteles para jugar en un mismo lugar solía tardar semanas
              de negociaciones individuales con distintos administradores de recintos.
            </p>
            <img src={imgBlog2} alt="Equipos jugando partido nocturno" className="imagen-cancha-detalle" />
            <div className="cuerpo-historia">
              <p>
                A través del filtro por comuna y disponibilidad horaria de <strong>CanchasRed</strong>,
                los capitanes de la "Liga Nocturna Santiago" reservaron dos multicanchas simultáneas
                para el fin de semana en menos de 15 minutos.
              </p>
              <ul className="lista-resultados">
                <li>Coordinación de 8 equipos en menos de 48 horas.</li>
                <li>Reserva garantizada sin pagos dobles ni cruces de horario.</li>
                <li>Más de 40 jugadores disfrutando el deporte sin complicaciones de gestión.</li>
              </ul>
            </div>
            <img src={imgBlog4} alt="Foto del Complejo Cancha Central Norte" className="imagen-cancha-detalle" />
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}

// export default: exporta la página para que las rutas en App.jsx puedan mostrarla cuando entramos a /blogs
export default Blogs;
