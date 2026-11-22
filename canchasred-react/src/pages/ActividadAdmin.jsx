import AdminLayout from '../components/AdminLayout';
import { METRICAS_ACTIVIDAD, ACTIVIDAD_RECIENTE } from '../data/admin';

function ActividadAdmin() {
  return (
    <AdminLayout>
      <header className="mb-4">
        <h1 className="h3 mb-0">Actividad</h1>
        <p className="text-muted">Resumen general de la plataforma.</p>
      </header>

      <div className="row g-3 mb-4">
        {METRICAS_ACTIVIDAD.map((m) => (
          <div key={m.titulo} className="col-sm-6 col-lg-3">
            <div className="card h-100">
              <div className="card-body">
                <div className="text-uppercase text-muted small mb-1">{m.titulo}</div>
                <div className="fs-3 fw-bold">{m.valor}</div>
                <div className="text-success small">{m.detalle}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header bg-white fw-semibold">Actividad reciente</div>
        <ul className="list-group list-group-flush">
          {ACTIVIDAD_RECIENTE.map((a) => (
            <li key={a.texto} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{a.texto}</span>
              <span className="text-muted small">{a.cuando}</span>
            </li>
          ))}
        </ul>
      </div>
    </AdminLayout>
  );
}

export default ActividadAdmin;
