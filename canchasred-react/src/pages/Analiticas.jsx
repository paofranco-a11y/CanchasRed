import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import AdminLayout from '../components/AdminLayout';
import { METRICAS_ANALITICAS, INGRESOS_MENSUALES, TOP_CANCHAS } from '../data/admin';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// El mes con más ingresos va en oscuro (como en el diseño original)
const maximo = Math.max(...INGRESOS_MENSUALES.map((m) => m.miles));

const datosGrafico = {
  labels: INGRESOS_MENSUALES.map((m) => m.mes),
  datasets: [
    {
      label: 'Ingresos (miles de CLP)',
      data: INGRESOS_MENSUALES.map((m) => m.miles),
      backgroundColor: INGRESOS_MENSUALES.map((m) => (m.miles === maximo ? '#212529' : '#e2e3e5')),
      borderColor: INGRESOS_MENSUALES.map((m) => (m.miles === maximo ? '#212529' : '#dee2e6')),
      borderWidth: 1,
    },
  ],
};

const opcionesGrafico = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: (item) => `$${item.parsed.y}k` } },
  },
  scales: { y: { ticks: { callback: (valor) => `$${valor}k` } } },
};

function Analiticas() {
  return (
    <AdminLayout>
      <header className="mb-4">
        <h1 className="h3 mb-0">Analíticas</h1>
        <p className="text-muted">Métricas de ingresos y actividad de la plataforma.</p>
      </header>

      <div className="row g-3 mb-4">
        {METRICAS_ANALITICAS.map((m) => (
          <div key={m.titulo} className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="text-uppercase text-muted small mb-1">{m.titulo}</div>
                <div className="fs-3 fw-bold">{m.valor}</div>
                <div className={m.clase}>{m.icono && <i className={m.icono}></i>} {m.detalle}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card mb-4">
        <div className="card-header bg-white d-flex flex-wrap justify-content-between align-items-center">
          <span className="fw-semibold">Ingresos mensuales ($)</span>
          <span className="text-muted small">*valores en miles de pesos (CLP)</span>
        </div>
        <div className="card-body">
          <div style={{ height: '220px' }}>
            <Bar data={datosGrafico} options={opcionesGrafico} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header bg-white fw-semibold">Top canchas por ingresos</div>
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">Cancha</th>
                <th scope="col" className="text-end">Reservas</th>
                <th scope="col" className="text-end">Ingresos</th>
                <th scope="col" className="text-end">Ocup.</th>
              </tr>
            </thead>
            <tbody>
              {TOP_CANCHAS.map((c) => (
                <tr key={c.cancha}>
                  <td>{c.cancha}</td>
                  <td className="text-end">{c.reservas}</td>
                  <td className="text-end">{c.ingresos}</td>
                  <td className="text-end">{c.ocupacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Analiticas;
