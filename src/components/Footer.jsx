export function Footer() {
    return (
        <footer className="footer py-4">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-4 text-lg-start">Copyright &copy; CanchasRed 2026</div>
                    <div className="col-lg-4 my-3 my-lg-0">
                        <a className="btn btn-dark btn-social mx-2" href="#!" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                        <a className="btn btn-dark btn-social mx-2" href="#!" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                        <a className="btn btn-dark btn-social mx-2" href="#!" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                    <div className="col-lg-4 text-lg-end">
                        <a href="/" className="link-dark text-decoration-none me-3">Inicio</a>
                        <a href="/nosotros" className="link-dark text-decoration-none me-3">Nosotros</a>
                        <a href="/contacto" className="link-dark text-decoration-none me-3">Contacto</a>
                        <a href="/blogs" className="link-dark text-decoration-none me-3">Blog</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}