# REPORTE DE MIGRACIÓN — CanchasRed a React

Fuente: `Downloads\CanchasRed-main (1)\CanchasRed-main` (versión del 28‑sep, con todos los cambios de la rama).

## Qué quedó listo
- P0 completo: Vite + React 19, rutas, `AuthContext`, `NavBar`, `Footer`, `ProtectedRoute`, Login/Registro con roles, Home (buscador + filtros), PerfilDueno (CRUD con imagen redimensionada), DetalleCancha + reservas + MisReservas, Contacto y MiniContacto.
- P1: 46 pruebas (2 por cada uno de los 7 formularios, más las de Home, ProtectedRoute, CanchaCard, rol admin, páginas y utilidades), mocks y cobertura (94 % de líneas). Docs `COBERTURA_TESTING.md` y `GUIA_PRESENTACION.md` actualizados.
- P2: Nosotros y Blogs, lint sin errores, build exitoso, README.
- **Migración del panel admin (nuevo en esta versión del repo):**
  - Rol `admin` con cuenta fija `usuario_admin@duocuc.cl` / `123456` en `AuthContext`; el correo no se puede registrar.
  - Páginas `/actividad-admin`, `/usuarios`, `/analiticas`, protegidas con `ProtectedRoute rol="admin"`.
  - Componentes nuevos: `AdminLayout` (barra lateral) e `InvitarUsuarioModal` (formulario, con sus 2 tests).
  - Gráfico de Analíticas con `chart.js` + `react-chartjs-2` (`Bar`) y los mismos valores del diseño original.
  - NavBar y Footer para admin: Inicio, Panel Admin, Salir.
- Los archivos HTML/JS/CSS originales **no se tocaron**.

## Diferencias detectadas entre el repo anterior y CanchasRed-main
- Nuevo: `actividad-admin.html`, `analiticas.html`, `usuarios.html`.
- Cambió `js/login.js` (cuenta admin → `actividad-admin.html`).
- Textos del menú "Blogs" en `contacto.html` y `login.html` (el resto dice "Blog"): se mantuvo "Blog".
- Sin cambios en `registro`, `index`, `nosotros`, `blogs`, `perfil-dueno`, `detalle-cancha`, `mis-reservas`, `styles.css`, `styles2.css` y el resto de los JS.
- Las 3 páginas admin referencian `css/style.css` y `js/main.js`, que **no existen** en el repo: no se pudo saber qué estilo o comportamiento debían tener.

## Decisiones que se apartaron del documento / del sitio original
- **Git**: por indicación expresa no se creó rama, commits ni push.
- **Admin, decisiones acordadas:** buscador y filtro por rol de Usuarios **sí filtran** la tabla (en el original no hacían nada); "Enviar invitación" valida y muestra "Invitación enviada a {correo}" **sin guardar nada**; se agregó el enlace **"Salir"** al pie de la barra lateral (el original no tenía cómo cerrar sesión); los datos del admin son **estáticos** (`src/data/admin.js`), como en el original.
- **Estilo del admin:** el original cargaba Bootstrap 5.3.3 por CDN; aquí se usa el Bootstrap de `styles.css` más `src/styles/admin.css` (solo trae `bg-secondary-subtle` y el ancho de la barra lateral). Bootstrap Icons por CDN en `index.html`. Por el tema Agency, las tipografías del panel pueden verse algo distintas al original; **no se comparó visualmente**.
- **Responsivo del admin:** en el original la barra lateral tenía 260 px fijos; en pantallas < 768 px ahora queda arriba a todo el ancho.
- El gráfico de Analíticas usa los valores reales de las etiquetas ($26k … $46k); en el original las alturas de las barras eran de relleno y no coincidían con esos valores.
- Un admin con sesión que visita las páginas públicas ve el menú "Inicio, Panel Admin, Salir" y no puede reservar ("Solo los deportistas pueden reservar.").
- Blog: se copió con las 3 imágenes del original (`ImgBlog1`, `ImgBlog2`, `ImgBlog4`).
- Precio con `formatearPrecio()` (puntos de miles) en vez de `toLocaleString('es-CL')`.
- `utils/imagen.js`: utilidad extra (lectura + redimensionado con canvas).
- Textos de error de Contacto/MiniContacto tomados de los HTML originales.
- `alert()` se mantiene en "Debes iniciar sesión…", "¡Reserva confirmada!" y "Cuenta creada correctamente…".
- Validación extra "La fecha no puede ser anterior a hoy." en `ReservaModal`.
- Font Awesome (CDN) en `index.html`; `npm.cmd` en vez de `npm` por la política de scripts de PowerShell.

## Qué falta
- **Exportación a Excel**: ninguna página la usa, así que no se implementó (`xlsx` y `file-saver` siguen en `package.json` sin uso).
- No se probó visualmente en navegador ni en 375 / 768 / 1200 px: solo build, lint y tests. Falta el recorrido manual del checklist.
- Las imágenes de Nosotros y Blog pesan 2–4 MB cada una (así venían); conviene comprimirlas.
- El build avisa que el JS pasa de 500 kB (por Chart.js); no afecta el funcionamiento.

## Imágenes
- Todas las imágenes usadas existen en `assets/img/`; no existe `imgG/`. No faltó ninguna. Todo se importa desde `src/assets/`.
- El CSS solo referencia `map-image.png` (existe); el documento mencionaba `header-bg.jpg`, que no existe ni se usa.
- No se copiaron los logos sin uso (`facebook`, `google`, `ibm`) ni el PDF de `assets/img/about/`.

## Resultados
| Comando | Resultado |
|---|---|
| `npm install` | OK. Avisos `EBADENGINE`: `jsdom 30` pide Node ≥ 22.22 y el equipo tiene 22.16.0; funcionó igual. 1 vulnerabilidad "high" reportada por `npm audit` (no revisada). |
| `npm run lint` | 0 errores, 1 advertencia (`react(purity)` por `Date.now()` dentro de un manejador de `DetalleCancha.jsx`; falso positivo). |
| `npm run test:run` | 46/46 pasan |
| `npm run test:coverage` | 94.04 % de líneas (components 90.47, context 100, pages 94.92, utils 100) |
| `npm run build` | OK |

## Jasmine/Karma vs Vitest
La rúbrica nombra Jasmine y Karma, pero el proyecto del profesor usa Vitest + Testing Library. Se usó **Vitest** con `describe / it / expect` (equivalente a Jasmine) y no se instaló Karma. Conviene confirmarlo con el profesor.
