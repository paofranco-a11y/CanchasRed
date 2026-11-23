// import trae la librería Chart.js y el componente Bar de React para dibujar gráficos fácilmente.
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import AdminLayout from '../components/AdminLayout';
import { METRICAS_ANALITICAS, INGRESOS_MENSUALES, TOP_CANCHAS } from '../data/admin';

// Chart.js necesita que registremos sus módulos (escalas, barras, tooltips) antes de poder dibujar el gráfico.
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Dato calculado: calculamos el valor más alto de ingresos para destacar esa barra con un color más oscuro.
const maximo = Math.max(...INGRESOS_MENSUALES.map((m) => m.miles));

// Configuración de los datos del gráfico: le pasamos las etiquetas de los meses y las barras de valores.
// Cómo funciona el gráfico: Bar recibe este objeto y dibuja una barra vertical por cada mes.
const datosGrafico = {
  labels: INGRESOS_MENSUALES.map((m) => m.mes),
  datasets: [
    {
      label: 'Ingresos (miles de CLP)',
      data: INGRESOS_MENSUALES.map((m) => m.miles),
      // Si el mes tiene el valor máximo se pinta negro (#212529); los demás quedan grises claro (#e2e3e5).
      backgroundColor: INGRESOS_MENSUALES.map((m) => (m.miles === maximo ? '#212529' : '#e2e3e5')),
      borderColor: INGRESOS_MENSUALES.map((m) => (m.miles === maximo ? '#212529' : '#dee2e6')),
      borderWidth: 1,
    },
  ],
};

// Opciones visuales del gráfico: lo hace adaptable a pantallas y formatea los números con signo '$' y sufijo 'k'.
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
  // El return pinta la página completa: tarjetas de resumen, gráfico interactivo y tabla de mejores canchas.
  return (
    <AdminLayout>
      <header className="mb-4">
        <h1 className="h3 mb-0">Analíticas</h1>
        <p className="text-muted">Métricas de ingresos y actividad de la plataforma.</p>
      </header>

      {/* Fila con las 3 tarjetas de indicadores principales (ingresos, canchas, reservas) */}
      <div className="row g-3 mb-4">
        {/* .map genera una columna y tarjeta por cada métrica del arreglo */}
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

      {/* Tarjeta contenedora del gráfico de barras interactivo */}
      <div className="card mb-4">
        <div className="card-header bg-white d-flex flex-wrap justify-content-between align-items-center">
          <span className="fw-semibold">Ingresos mensuales ($)</span>
          <span className="text-muted small">*valores en miles de pesos (CLP)</span>
        </div>
        <div className="card-body">
          {/* El componente <Bar /> lee datosGrafico y opcionesGrafico para renderizar el canvas en el navegador */}
          <div style={{ height: '220px' }}>
            <Bar data={datosGrafico} options={opcionesGrafico} />
          </div>
        </div>
      </div>

      {/* Tabla con las canchas más rentables y su porcentaje de ocupación */}
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
              {/* .map recorre cada cancha del top para crear una fila con sus estadísticas */}
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

// export default permite que la página de analíticas pueda usarse en el enrutador de la aplicación.
export default Analiticas;
