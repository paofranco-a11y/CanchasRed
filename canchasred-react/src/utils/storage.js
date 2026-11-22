// Lee un valor JSON de localStorage. Si no existe o está dañado, devuelve porDefecto.
/**
 * Módulo de utilidades para la persistencia local de datos.
 * Encapsula la interacción con `localStorage` (o `sessionStorage`) para guardar, obtener y eliminar
 * la información de sesión de los usuarios, listados de canchas guardadas y credenciales de acceso de forma segura.
 */

export function leer(clave, porDefecto) {
  try {
    const texto = localStorage.getItem(clave);
    return texto === null ? porDefecto : JSON.parse(texto);
  } catch {
    return porDefecto;
  }
}

// Guarda un valor como JSON. Devuelve false si no hay espacio (QuotaExceededError) u otro error.
export function guardar(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

// Borra una clave de localStorage.
export function borrar(clave) {
  try {
    localStorage.removeItem(clave);
  } catch {
    // no hay nada que hacer si falla
  }
}
