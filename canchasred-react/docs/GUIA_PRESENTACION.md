# Guía de presentación — CanchasRed (React)

Guion en palabras simples para que cada integrante pueda exponer.

## a) React + Vite y estructura de carpetas

- **React** arma la pantalla con *componentes*: funciones que devuelven HTML (JSX) y se reutilizan.
- **Vite** es la herramienta que levanta el proyecto (`npm run dev`) y lo empaqueta (`npm run build`).
- **Bootstrap** se usa solo desde `styles.css` (ya trae Bootstrap + tema Agency). El JS de Bootstrap se importa en `main.jsx`.
- **react-router-dom** maneja las rutas (`/`, `/login`, `/cancha/:id`, …) sin recargar la página.

```
src/
  pages/       una por pantalla (Home, Login, PerfilDueno…)
  components/  piezas reutilizables (CanchaCard, NavBar, CanchaForm…)
  context/     AuthContext: guarda quién inició sesión
  data/        canchas.js: datos fijos
  utils/       storage.js, validators.js, imagen.js: funciones sueltas
```

Flujo: `main.jsx` → `BrowserRouter` → `App.jsx` (define las rutas dentro de `AuthProvider`) → cada página arma su pantalla con componentes.

## b) Componentes con props y estado

**Props** = datos que el padre le pasa al hijo. **Estado** (`useState`) = datos que cambian y hacen que la pantalla se vuelva a dibujar.

### 1. `CanchaCard` — solo props
```jsx
function CanchaCard({ cancha }) { ... <h2>{cancha.nombre}</h2> ... }
// Home: {visibles.map((c) => <CanchaCard key={c.id} cancha={c} />)}
```
No tiene estado: solo muestra lo que recibe. Se usa con `.map()` y `key`.

### 2. `FiltrosDeporte` + `Home` — levantar estado
```jsx
// Home.jsx (el estado vive en el padre)
const [deporte, setDeporte] = useState('Todos');
<FiltrosDeporte activo={deporte} onCambiar={setDeporte} />

// FiltrosDeporte.jsx (el hijo avisa con un callback)
<button onClick={() => onCambiar(d)}>…</button>
```
Los datos que se ven (`visibles`) **no se guardan**: se calculan en cada render filtrando por texto y deporte (*estado derivado*).

### 3. `MiniContacto` / `Contacto` — formulario controlado
```jsx
const [values, setValues] = useState({ nombre: '', email: '' });
const [touched, setTouched] = useState({...});
const [submitted, setSubmitted] = useState(false);
const errors = { email: EMAIL_RE.test(values.email) ? '' : 'Ingresa un correo válido.' }; // derivado
```
Los errores se **derivan** de `values`. Las clases `is-valid` / `is-invalid` de Bootstrap se muestran cuando el campo fue tocado (`touched`) o se envió el formulario (`submitted`).

### 4. `AuthContext` — Context y roles
```jsx
const { usuario, login, logout } = useAuth();
```
Un único Context guarda la sesión (`usuario = { correo, rol }`) en `localStorage`. Hay **tres roles**: `deportista`, `dueno` y `admin` (cuenta fija `usuario_admin@duocuc.cl`). `NavBar`, `Footer` y `ProtectedRoute` lo leen para mostrar un menú distinto según el rol y proteger rutas:
```jsx
<Route path="/usuarios" element={<ProtectedRoute rol="admin"><Usuarios /></ProtectedRoute>} />
```

### 5. `InvitarUsuarioModal` y `Usuarios` — props, callbacks y filtros
```jsx
// Usuarios.jsx (padre): estado de modal, búsqueda y filtro
<InvitarUsuarioModal onInvitar={invitar} onCerrar={() => setModalAbierto(false)} />
// InvitarUsuarioModal.jsx (hijo): valida y avisa con el callback
if (todoValido) onInvitar({ nombre, correo, rol });
```
La tabla se filtra con estado derivado (`visibles`) según `busqueda` y `filtroRol`. La invitación no se guarda (no hay backend): solo se confirma con un mensaje.

### 6. `Analiticas` — gráfico con Chart.js
```jsx
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
<Bar data={datosGrafico} options={opcionesGrafico} />
```
Los datos salen de `src/data/admin.js`. El mes con más ingresos se pinta en oscuro.

### Otros ejemplos
- `CanchaForm cancha onGuardar onCancelar`: sirve para crear (cancha = null) y editar.
- `ReservaModal cancha onConfirmar onCerrar` y `ConfirmModal`: modales de Bootstrap controlados por estado (`modalAbierto` en la página padre).

## c) Diseño responsivo con Bootstrap

- **Grid**: las tarjetas usan `col-lg-4 col-sm-6` → 3 por fila en escritorio, 2 en tablet, 1 en móvil.
- **Navbar colapsable**: `navbar-expand-lg`; en pantallas chicas aparece el botón "Menu" (controlado con `useState`).
- **Formularios**: `row` + `col-md-6` se apilan en móvil; en `Registro` y `Login` la tarjeta usa `max-width` y `width: 100%`.
- **Utilidades**: `d-flex`, `flex-wrap`, `gap-2`, `mb-3 mb-md-0`, `text-break`.

| Ancho | Qué se ve |
|---|---|
| Móvil 375 px | Menú colapsado, 1 tarjeta por fila, formularios apilados; en el panel admin la barra lateral queda arriba, a todo el ancho |
| Tablet 768 px | 2 tarjetas por fila, formulario de contacto en 2 columnas; el panel admin muestra la barra lateral a la izquierda |
| Escritorio 1200 px | Menú completo, 3 tarjetas por fila, detalle en 2 columnas (imagen 7/12 + datos 5/12); métricas admin en 4 columnas |

Para mostrarlo: abrir `npm run dev`, F12 → modo dispositivo → cambiar el ancho.

## d) Proceso de testeo

1. **Configuración**: Vitest + jsdom + Testing Library (`vite.config.js` y `src/setupTests.js`).
2. **Cómo se escribe un test** (preparar → actuar → comprobar):
```jsx
it('Muestra los errores al enviar vacío', () => {
  render(<ContactForm />);                                        // preparar
  fireEvent.click(screen.getByRole('button', { name: /Enviar/i })); // actuar
  expect(screen.getByText('Ingresa tu nombre.')).toBeInTheDocument(); // comprobar
});
```
3. **Mocks** (simulan cosas externas): `vi.fn()` para callbacks (`onGuardar`), `vi.mock('react-router-dom')` para `useNavigate`, `vi.spyOn(window, 'alert')`, `vi.spyOn(Storage.prototype, 'setItem')` para simular localStorage lleno.
4. **Resultados**: `npm run test:run` → 46 tests pasan. `npm run test:coverage` → 94.04 % de líneas. Ver `docs/COBERTURA_TESTING.md`.
5. **Leer la cobertura**: *Stmts* = sentencias ejecutadas, *Branch* = ramas de `if`/ternarios, *Funcs* = funciones llamadas, *Lines* = líneas. "Uncovered Line #s" muestra lo que ningún test ejecutó. Reporte visual: `coverage/index.html`.

## e) Preguntas probables y respuestas cortas

- **¿Por qué Vitest y no Jasmine/Karma?** Es lo que se enseñó en clase y funciona con Vite; la API (`describe/it/expect`) es la misma de Jasmine.
- **¿Qué diferencia hay entre props y estado?** Props vienen del padre y no se modifican; el estado es propio del componente y al cambiar redibuja.
- **¿Qué es "levantar el estado"?** Poner el estado en el padre común (Home) para que dos hijos (filtros y lista) compartan datos.
- **¿Por qué los errores no son estado?** Porque se pueden calcular desde `values`; guardarlos duplicaría datos.
- **¿Cómo se protege una ruta?** `ProtectedRoute` lee la sesión del Context y, si no hay sesión o el rol no corresponde, hace `<Navigate to="/login" />`. Las páginas de admin usan `rol="admin"`.
- **¿Cómo entra el administrador?** Con la cuenta fija `usuario_admin@duocuc.cl` / `123456` (la misma del sitio original); no se puede registrar ese correo.
- **¿Dónde se guardan los datos?** En `localStorage` (`usuarios`, `sesion`, `canchas`, `reservas`); no hay backend.
- **¿Qué pasa si la imagen es muy grande?** Se reduce con `canvas` a 800 px (JPEG 0.8) y, si igual no cabe, se avisa al usuario.
- **¿Qué es un mock?** Un reemplazo falso de algo externo para probar solo nuestra lógica.
- **¿Limitación de seguridad?** Las contraseñas están en texto plano porque no hay backend.
