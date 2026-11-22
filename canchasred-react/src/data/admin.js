// Datos fijos del panel de administración (iguales a los del sitio original)

export const METRICAS_ACTIVIDAD = [
  { titulo: 'Usuarios totales', valor: '7', detalle: '+2 este mes' },
  { titulo: 'Canchas publicadas', valor: '12', detalle: '+3 este mes' },
  { titulo: 'Reservas totales', valor: '48', detalle: '+11 esta semana' },
  { titulo: 'Ingresos totales', valor: '$384.000', detalle: '+$88.000 este mes' },
];

export const ACTIVIDAD_RECIENTE = [
  { texto: 'Nueva reserva — Cancha Central Norte', cuando: 'hace 3 min' },
  { texto: 'Usuario nuevo registrado — carlos.rojas', cuando: 'hace 1 hora' },
  { texto: 'Cancha aprobada — Court Tenis Las Flores', cuando: 'hace 5 horas' },
  { texto: 'Reserva cancelada — Multicancha Barrio Sur', cuando: 'hace 5 horas' },
  { texto: 'Nuevo dueño registrado — icbelly23', cuando: 'ayer' },
];

// rol: 'admin' | 'dueno' | 'deportista'
export const USUARIOS_ADMIN = [
  { nombre: 'María Alejandra Ruiz Pimentel', subtitulo: 'Owner', rol: 'admin', email: 'ana.ruiz@dueccc.cl', desde: '23 Jun 2026' },
  { nombre: 'Alejandra Ruiz', rol: 'dueno', email: 'alejandraespinoza@gmail.com', desde: '9 Sep 2026' },
  { nombre: 'hey.dicaho', rol: 'dueno', email: 'heydicaho@gmail.com', desde: '28 Jun 2026' },
  { nombre: 'hey.herrera', rol: 'dueno', email: 'hey.herrera@dueccc.cl', desde: '23 Jun 2026' },
  { nombre: 'icb.moreno', rol: 'deportista', email: 'icb.moreno@dueccc.cl', desde: '23 Jun 2026' },
  { nombre: 'icbelly23', rol: 'deportista', email: 'icbelly23@gmail.com', desde: '23 Jun 2026' },
  { nombre: 'carlos.rojas', rol: 'deportista', email: 'carlos.rojas@gmail.com', desde: '1 Jul 2026' },
];

// Texto y clase del badge de cada rol
export const ROLES_ADMIN = {
  admin: { etiqueta: 'admin', clase: 'badge text-bg-dark' },
  dueno: { etiqueta: 'dueño', clase: 'badge text-bg-secondary' },
  deportista: { etiqueta: 'deportista', clase: 'badge text-bg-light border' },
};

export const METRICAS_ANALITICAS = [
  { titulo: 'Ingresos este mes', valor: '$88.000', detalle: '25% vs mes anterior', icono: 'bi bi-arrow-up', clase: 'text-success small' },
  { titulo: 'Reservas este mes', valor: '11', detalle: '9 vs mes anterior', icono: 'bi bi-arrow-up', clase: 'text-success small' },
  { titulo: 'Ticket promedio', valor: '$8.000', detalle: 'por reserva', icono: '', clase: 'text-muted small' },
];

// Ingresos mensuales en miles de pesos (CLP)
export const INGRESOS_MENSUALES = [
  { mes: 'Ene', miles: 26 },
  { mes: 'Feb', miles: 36 },
  { mes: 'Mar', miles: 47 },
  { mes: 'Abr', miles: 54 },
  { mes: 'May', miles: 53 },
  { mes: 'Jun', miles: 70 },
  { mes: 'Jul', miles: 77 },
  { mes: 'Ago', miles: 61 },
  { mes: 'Sep', miles: 46 },
];

export const TOP_CANCHAS = [
  { cancha: 'Cancha Central Norte', reservas: 18, ingresos: '$144.000', ocupacion: '82%' },
  { cancha: 'Court Tenis Las Flores', reservas: 14, ingresos: '$168.000', ocupacion: '64%' },
  { cancha: 'Multicancha Barrio Sur', reservas: 9, ingresos: '$58.500', ocupacion: '47%' },
];
