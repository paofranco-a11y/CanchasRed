# Documento de cobertura de testing — CanchasRed

## 1. Herramientas y entorno

| Elemento | Detalle |
|---|---|
| Ejecutor de pruebas | **Vitest** 5.1 (API `describe / it / expect`, equivalente a Jasmine) |
| Entorno | `jsdom` (simula el navegador) |
| Componentes | `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event` |
| Cobertura | `@vitest/coverage-v8` (reportes `text` y `html`) |
| Configuración | `vite.config.js` (bloque `test`) y `src/setupTests.js` (jest-dom + `cleanup()` tras cada test) |

> La rúbrica menciona Jasmine y Karma, pero en clase se enseñó Vitest + Testing Library. Se usó Vitest y los tests se escriben con `describe / it / expect`, igual que en Jasmine. No se instaló Karma.

Comandos: `npm run test:run` (ejecuta), `npm run test:coverage` (ejecuta + cobertura; el HTML queda en `coverage/index.html`).

Los tests viven en `src/components/__tests__/`, `src/pages/__tests__/` y `src/utils/__tests__/`. Los componentes que usan router o contexto se envuelven con el helper `renderConProveedores` (`MemoryRouter` + `AuthProvider`). `localStorage` se limpia en `beforeEach`.

## 2. Regla: 2 pruebas por formulario (válido e inválido)

Hay **7 formularios** = 14 pruebas, todas con el orden **preparar → actuar → comprobar** y nombre descriptivo.

| # | Formulario | Archivo | Qué verifica |
|---|---|---|---|
| 1 | Login | `Login.test.jsx` | Vacío muestra "Ingresa tu correo." y "Ingresa tu contraseña." |
| 2 | Login | `Login.test.jsx` | Credenciales correctas guardan `sesion` y navegan a `/perfil-dueno` |
| 3 | Registro | `Registro.test.jsx` | Contraseñas distintas muestran "Las contraseñas no coinciden." |
| 4 | Registro | `Registro.test.jsx` | Datos válidos guardan el usuario con su rol y navegan a `/login` |
| 5 | Contacto | `Contacto.test.jsx` | Vacío muestra errores de nombre, email, teléfono y mensaje |
| 6 | Contacto | `Contacto.test.jsx` | Válido muestra "¡Mensaje enviado con éxito!" y limpia los campos |
| 7 | MiniContacto | `MiniContacto.test.jsx` | Correo con mal formato muestra error |
| 8 | MiniContacto | `MiniContacto.test.jsx` | Válido muestra "¡Gracias! Te contactaremos pronto." y limpia |
| 9 | CanchaForm | `CanchaForm.test.jsx` | Precio fuera de rango y sin imagen muestran errores; no llama a `onGuardar` |
| 10 | CanchaForm | `CanchaForm.test.jsx` | Datos válidos llaman a `onGuardar` con los datos de la cancha |
| 11 | ReservaModal | `ReservaModal.test.jsx` | Sin fecha y hora muestra el error y no llama a `onConfirmar` |
| 12 | ReservaModal | `ReservaModal.test.jsx` | Válido llama una vez a `onConfirmar` con `{ fecha, hora, horas }` |
| 13 | **InvitarUsuarioModal** (nuevo) | `InvitarUsuarioModal.test.jsx` | Vacío muestra los 3 errores (nombre, correo, rol) y no llama a `onInvitar` |
| 14 | **InvitarUsuarioModal** (nuevo) | `InvitarUsuarioModal.test.jsx` | Válido llama una vez a `onInvitar` con `{ nombre, correo, rol }` |

Otros componentes pedidos: `Home` filtra por "Tenis" y busca "san miguel" (`Home.test.jsx`, 2 tests); `ProtectedRoute` sin sesión redirige a `/login` y `CanchaCard` muestra nombre, comuna, `$7.000 /hora` y enlace `/cancha/est-1` (`ProtectedRouteYCanchaCard.test.jsx`).

## 3. Pruebas adicionales

- `RolAdmin.test.jsx` (11): login de la cuenta admin (válido: navega a `/actividad-admin`; inválido: "Correo o contraseña incorrectos."), registro bloquea el correo admin, `ProtectedRoute` por rol (deportista y sin sesión no entran a rutas admin; el admin sí), menús de `NavBar` y `Footer` para admin, `ActividadAdmin`, "Salir" del panel, `Analiticas` (gráfico mockeado + tabla) y `Usuarios` (buscador, filtro por rol, invitación con confirmación, pestaña de pendientes).
- `PaginasConSesion.test.jsx` (11): reservar sin sesión / como dueño / como deportista, cancha inexistente, `MisReservas` filtra por correo y estado vacío, `PerfilDueno` (solo canchas propias, editar conservando imagen, eliminar con confirmación, aviso de falta de espacio) y páginas informativas.
- `utils.test.js` (6): `storage` (guardar/leer/borrar, `QuotaExceededError`, JSON dañado), `normalizar`, `formatearPrecio` y `leerImagen`.

## 4. Mocks utilizados

| Mock | Dónde | Para qué |
|---|---|---|
| `vi.fn()` | `CanchaForm`, `ReservaModal`, `InvitarUsuarioModal` | Simular callbacks por props (`onGuardar`, `onConfirmar`, `onInvitar`) |
| `vi.mock('react-router-dom', …)` + `vi.hoisted` | `Login`, `Registro`, `RolAdmin` | Reemplazar `useNavigate` y comprobar la redirección |
| `vi.mock('react-chartjs-2', …)` | `RolAdmin` | jsdom no tiene `canvas`: `Bar` se reemplaza por un `div` con las etiquetas |
| `vi.spyOn(window, 'alert')` | `Registro`, `PaginasConSesion`, `RolAdmin` | jsdom no implementa `alert`; además se verifica el mensaje |
| `vi.spyOn(Storage.prototype, 'setItem')` | `utils`, `PerfilDueno` | Simular `localStorage` lleno (`QuotaExceededError`) |
| `vi.mock('../../utils/imagen')` | `CanchaForm` | Simular lectura/redimensionado de imagen |
| `vi.stubGlobal('Image', …)` + spies de `canvas` | `utils` | Probar el redimensionado sin navegador real |
| `vi.restoreAllMocks()` | `afterEach` | Dejar todo limpio entre pruebas |

## 5. Resultado real de la ejecución

`npm run test:coverage` (Node 22.16, Windows):

```
Test Files  12 passed (12)
     Tests  46 passed (46)
```

## 6. Tabla de cobertura real

| Archivo | % Sentencias | % Ramas | % Funciones | % Líneas |
|---|---|---|---|---|
| **Todos** | **91.57** | **91.48** | **82.43** | **94.04** |
| components/AdminLayout.jsx | 87.5 | 100 | 66.66 | 87.5 |
| components/CanchaCard.jsx | 100 | 100 | 100 | 100 |
| components/CanchaForm.jsx | 78.72 | 93.1 | 75 | 80.48 |
| components/CanchasList.jsx | 100 | 75 | 100 | 100 |
| components/ConfirmModal.jsx | 100 | 100 | 100 | 100 |
| components/FiltrosDeporte.jsx | 100 | 100 | 100 | 100 |
| components/Footer.jsx | 100 | 100 | 100 | 100 |
| components/InvitarUsuarioModal.jsx | 95.83 | 100 | 85.71 | 100 |
| components/MiniContacto.jsx | 96.29 | 90 | 83.33 | 100 |
| components/NavBar.jsx | 72.72 | 89.47 | 57.14 | 73.68 |
| components/ProtectedRoute.jsx | 100 | 100 | 100 | 100 |
| components/ReservaModal.jsx | 100 | 84.61 | 100 | 100 |
| context/AuthContext.jsx | 96.66 | 91.66 | 88.88 | 100 |
| pages/ActividadAdmin.jsx | 100 | 100 | 100 | 100 |
| pages/Analiticas.jsx | 85.71 | 100 | 80 | 84.61 |
| pages/Blogs.jsx | 100 | 100 | 100 | 100 |
| pages/Contacto.jsx | 96.29 | 90 | 83.33 | 100 |
| pages/DetalleCancha.jsx | 96 | 91.66 | 80 | 95.83 |
| pages/Home.jsx | 93.33 | 90 | 85.71 | 100 |
| pages/Login.jsx | 96.29 | 96 | 80 | 100 |
| pages/MisReservas.jsx | 100 | 75 | 100 | 100 |
| pages/Nosotros.jsx | 100 | 100 | 100 | 100 |
| pages/NotFound.jsx | 100 | 100 | 100 | 100 |
| pages/PerfilDueno.jsx | 85 | 83.33 | 66.66 | 85.71 |
| pages/Registro.jsx | 93.93 | 92.85 | 85.71 | 100 |
| pages/Usuarios.jsx | 91.3 | 95.23 | 80 | 90.9 |
| utils/imagen.js | 90.9 | 100 | 75 | 100 |
| utils/storage.js | 100 | 100 | 100 | 100 |
| utils/validators.js | 100 | 50 | 100 | 100 |

Por carpeta (líneas): components 90.47 %, context 100 %, pages 94.92 %, utils 100 %. Meta del proyecto (≥ 70 % en `components`, `pages` y `utils`): **cumplida**.

## 7. Qué queda sin cubrir y por qué

- **NavBar**: el listener de `scroll` (agrega `navbar-shrink`) y el botón "Salir" no tienen test; son comportamiento visual probado a mano.
- **CanchaForm**: archivo con tipo no permitido y el botón "Cancelar" del modo edición.
- **PerfilDueno**: cambio de pestañas y "Cancelar".
- **Analiticas**: las funciones de formato del gráfico (`tooltip` y ejes) no se ejecutan porque `Bar` está mockeado.
- **AdminLayout** y **Usuarios**: el buscador lateral decorativo y el botón de cerrar (X) del modal.
- `App.jsx` y `main.jsx` no están en el alcance de cobertura configurado (`vite.config.js`).
