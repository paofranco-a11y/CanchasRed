import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/styles.css'
import './styles/styles2.css'
import App from './App.jsx'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

/**
 * Punto de entrada principal de la aplicación React.
 * Inicializa el DOM virtual mediante createRoot, envuelve la aplicación en el modo estricto
 * de React (<StrictMode>) e integra el enrutador principal (<BrowserRouter>) para la navegación global.
 * Además, importa los estilos CSS globales y los scripts de Bootstrap.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
