// import: traemos componentes compartidos (NavBar y Footer) y las fotos para la historia y el equipo
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import img1 from '../assets/img/about/1.jpg';
import img3 from '../assets/img/about/3.jpg';
import img4 from '../assets/img/about/4.jpg';
import equipo1 from '../assets/img/portfolio/ImgNosotros1.jpg';
import equipo3 from '../assets/img/portfolio/ImgNosotros3.jpg';
import equipo4 from '../assets/img/portfolio/ImgNosotros4.jpg';

// Arreglo de hitos históricos; los guardamos en una lista de objetos para dibujarlos con .map sin repetir HTML
const HITOS = [
  {
    cifra: '+40', imagen: img1,
    titulo: 'Complejos deportivos impulsados en todo Chile',
    texto: 'Conectamos recintos deportivos a lo largo de todo el país, modernizando su administración y visibilidad para que más jugadores encuentren su espacio ideal cada semana!',
  },
  {
    cifra: '+120', imagen: img4,
    titulo: 'Canchas activas con gestión y reservas automáticas',
    texto: 'Digitalizamos el inventario de canchas en tiempo real, eliminando planillas manuales, cruces de horarios y cobros fallidos mediante reservas automáticas',
  },
  {
    cifra: '+2', imagen: img3,
    titulo: 'Años de experiencia',
    texto: 'Acompañamos a dueños de complejos y deportistas amateurs en la evolución de su gestión, integrando tecnología práctica para hacer del arriendo deportivo un proceso rápido y transparente',
  },
];

// Lista con las integrantes del equipo para mostrarlas en tarjetas con su foto, cargo y redes
const EQUIPO = [
  { nombre: 'Analistas de mercado', cargo: 'Diseño y Marketing', imagen: equipo1, alt: 'Foto de la cancha Central Norte' },
  { nombre: 'Paola Franco', cargo: 'Programadora Web', imagen: equipo4, alt: '...' },
  { nombre: 'Alejandra Ruiz', cargo: 'Analista de Datos', imagen: equipo3, alt: '...' },
];

// Componente de página que muestra la historia, logros y el equipo de CanchasRed
function Nosotros() {
  return (
    <>
      <NavBar />
      <header className="masthead masthead-2">
        <div className="container contenido-centrado">
          <div className="masthead-heading text-uppercase">De lo más pequeño a lo más grande</div>
          <p className="masthead-subheading">Descubre las mejores canchas de deporte en tu área.</p>
        </div>
      </header>

      <section className="seccion-historia">
        <h2>Nacimos para ser el aliado estratégico de los recintos deportivos</h2>
        <p>
          Surgimos con el propósito de resolver los problemas de comunicación en los centros deportivos,
          eliminar la incertidumbre al momento de arrendar y ayudar a los complejos a profesionalizar
          la gestión de sus espacios.
        </p>
        <p>
          Con el tiempo, comprendimos que muchos de los desafíos que enfrentan los recintos estaban
          profundamente conectados entre sí. La disponibilidad de horarios, el cobro transparente,
          el mantenimiento de las instalaciones y la fidelización de los jugadores no podían abordarse de forma aislada.
        </p>
      </section>

      <section className="page-section" id="about">
        <div className="container">
          <div className="text-center">
            <h2 className="section-heading text-uppercase">Conectando la pasión del deporte con la tecnología en todo Chile</h2><br />
          </div>
          <ul className="timeline">
            {/* .map: recorre la lista de hitos y usa el índice (i % 2 === 1) para alternar las fotos entre izquierda y derecha */}
            {HITOS.map((h, i) => (
              <li key={h.cifra} className={i % 2 === 1 ? 'timeline-inverted' : ''}>
                <div className="timeline-image"><img className="rounded-circle img-fluid" src={h.imagen} alt="..." /></div>
                <div className="timeline-panel">
                  <div className="timeline-heading">
                    <h4>{h.cifra}</h4>
                    <h4 className="subheading">{h.titulo}</h4>
                  </div>
                  <div className="timeline-body"><p className="text-muted">{h.texto}</p></div>
                </div>
              </li>
            ))}
            <li className="timeline-inverted">
              <div className="timeline-image">
                <h4>Se parte<br />de nuestra<br />historia!</h4>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <main className="contenedor-nosotros">
        <section className="page-section bg-light" id="team">
          <div className="container">
            <div className="text-center">
              <h2 className="section-heading text-uppercase">Nuestro increíble equipo</h2>
              <h3 className="section-subheading text-muted">Un equipo que da todo por el éxito de nuestros clientes.</h3>
            </div>
            <div className="row">
              {/* .map: transforma cada integrante en una columna responsiva de Bootstrap con su información y redes sociales */}
              {EQUIPO.map((p) => (
                <div key={p.nombre} className="col-lg-4">
                  <div className="team-member">
                    <img className="mx-auto rounded-circle" src={p.imagen} alt={p.alt} />
                    <h4>{p.nombre}</h4>
                    <p className="text-muted">{p.cargo}</p>
                    <a className="btn btn-dark btn-social mx-2" href="#!" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                    <a className="btn btn-dark btn-social mx-2" href="#!" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                    <a className="btn btn-dark btn-social mx-2" href="#!" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                  </div>
                </div>
              ))}
            </div>
            <div className="row">
              <div className="col-lg-8 mx-auto text-center">
                <p className="large text-muted">Por eso creamos <strong>CanchasRed</strong>: un ecosistema donde los dueños maximizan el uso de sus canchas y los deportistas encuentran su lugar ideal para jugar en cuestión de segundos.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

// export default: permite que el router de la aplicación (App.jsx) cargue esta página al visitar /nosotros
export default Nosotros;
