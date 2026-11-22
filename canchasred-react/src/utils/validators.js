/**
 * Funciones auxiliares de validación de formularios y datos de entrada.
 * Incluye validaciones para formatos de correo electrónico, seguridad de contraseñas,
 * coincidencia de campos en el registro, y campos requeridos para la creación y edición de canchas.
 */

// Expresiones regulares de validación
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
export const TELEFONO_RE = /^[0-9+\s]{7,15}$/;

// Quita tildes y mayúsculas para comparar textos ("Fútbol" → "futbol")
export function normalizar(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// Formatea un precio con puntos de miles: 7000 → "$7.000"
export function formatearPrecio(valor) {
  return '$' + String(Math.round(Number(valor) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
