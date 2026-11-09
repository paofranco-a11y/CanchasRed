/**
 * Utilidad para el procesamiento y manejo de imágenes.
 * Proporciona funciones de conversión (ej. a Base64), procesamiento de URLs predeterminadas,
 * o validación de formatos y tamaños de imagen cargados para las publicaciones del dueño de cancha.
 */

const ANCHO_MAXIMO = 800;
export const TIPOS_PERMITIDOS = ['image/png', 'image/jpeg'];

// Lee un archivo como data URL (base64)
function leerComoDataUrl(archivo) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => resolve(lector.result);
    lector.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    lector.readAsDataURL(archivo);
  });
}

// Lee la imagen y la redimensiona con canvas (máx. 800 px de ancho, JPEG calidad 0.8)
// para no llenar el límite de ~5 MB de localStorage.
export async function leerImagen(archivo) {
  const dataUrl = await leerComoDataUrl(archivo);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const escala = Math.min(1, ANCHO_MAXIMO / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * escala);
      canvas.height = Math.round(img.height * escala);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = () => reject(new Error('La imagen no es válida.'));
    img.src = dataUrl;
  });
}
