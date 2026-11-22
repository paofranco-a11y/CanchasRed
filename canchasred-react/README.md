# CanchasRed (React)

Plataforma de reservas de canchas deportivas en Chile. Proyecto académico (DUOC UC, Full Stack 2, DSY1104) de Paola Franco y Alejandra Ruiz. Migración del sitio HTML/CSS/JS a **React 19 + Vite**.

Hay dos roles: **dueño** (publica y gestiona canchas) y **deportista** (busca y reserva). No hay backend: los datos se guardan en `localStorage`.

## Requisitos: instalar Node

1. Descarga Node.js **LTS (22 o superior)** desde https://nodejs.org e instálalo.
2. Reinicia la terminal y comprueba con `node -v`.

## Comandos (PowerShell)

```powershell
cd canchasred-react
npm install            # si falla con ERESOLVE: npm install --legacy-peer-deps
npm run dev            # abre http://localhost:5173
npm run test:run       # pruebas unitarias (Vitest)
npm run test:coverage  # pruebas + reporte de cobertura (carpeta coverage/)
npm run lint           # oxlint
npm run build          # build de producción en dist/
```

> En Windows, si PowerShell bloquea `npm` por la política de scripts, usa `npm.cmd` (por ejemplo `npm.cmd run dev`).

## Estructura

```
src/
  main.jsx  App.jsx  setupTests.js
  assets/      imágenes
  styles/      styles.css (Bootstrap + tema Agency, no modificar) y styles2.css (CSS propio)
  context/     AuthContext.jsx (sesión, login, registro, logout, cuenta admin)
  data/        canchas.js (canchas estáticas, DEPORTES y COMUNAS) y admin.js (datos fijos del panel)
  utils/       storage.js, validators.js, imagen.js
  components/  NavBar, Footer, MiniContacto, CanchaCard, FiltrosDeporte,
               ReservaModal, ConfirmModal, ProtectedRoute, CanchaForm, CanchasList,
               AdminLayout, InvitarUsuarioModal
  pages/       Home, Nosotros, Blogs, Contacto, Login, Registro,
               DetalleCancha, MisReservas, PerfilDueno, NotFound,
               ActividadAdmin, Usuarios, Analiticas
docs/          COBERTURA_TESTING.md, GUIA_PRESENTACION.md
```

## Roles y rutas

| Ruta | Acceso |
|---|---|
| `/`, `/nosotros`, `/blogs`, `/contacto`, `/cancha/:id` | todos (reservar requiere sesión de deportista) |
| `/login`, `/registro` | solo sin sesión (con sesión redirige a su página de inicio) |
| `/mis-reservas` | solo deportista |
| `/perfil-dueno` | solo dueño |
| `/actividad-admin`, `/usuarios`, `/analiticas` | solo admin |

Página de inicio tras iniciar sesión: dueño → `/perfil-dueno`, deportista → `/`, admin → `/actividad-admin`.

**Cuenta de administrador (fija, como en el sitio original):** `usuario_admin@duocuc.cl` / `123456`. No se puede registrar ese correo.

## Datos en localStorage

`usuarios`, `sesion`, `canchas`, `reservas`. Los datos del panel de administración (usuarios, métricas, ingresos) son fijos y viven en `src/data/admin.js`.

## Limitaciones conocidas

- **No hay backend**: todo vive en el navegador; borrar los datos del sitio borra las cuentas.
- **Las contraseñas se guardan en texto plano** en `localStorage` (solo válido para un proyecto académico).
- **Las imágenes se redimensionan** a 800 px de ancho (JPEG, calidad 0.8) antes de guardarse, porque `localStorage` tiene un límite de ~5 MB. Si aun así no hay espacio, se muestra un aviso.
- Los íconos de redes sociales (Font Awesome) y los del panel admin (Bootstrap Icons) se cargan desde internet (CDN).
- El panel de administración usa datos fijos; "Invitar usuario" valida el formulario y confirma, pero no guarda nada.
