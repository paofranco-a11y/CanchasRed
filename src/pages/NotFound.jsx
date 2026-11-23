import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

function NotFound() {
  return (
    <>
      <NavBar solido />
      <main className="container text-center" style={{ paddingTop: '10rem', paddingBottom: '6rem' }}>
        <h1 className="mb-3">Página no encontrada</h1>
        <p className="text-muted">La página que buscas no existe.</p>
        <Link to="/" className="btn btn-primary">Volver al inicio</Link>
      </main>
      <Footer />
    </>
  );
}

export default NotFound;
