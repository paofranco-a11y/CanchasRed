import canchaTenis from '../assets/img/portfolio/canchaTenis.png';
import canchaFutbol from '../assets/img/portfolio/canchaFutbol.jpg';
import canchaBasquet from '../assets/img/portfolio/canchaBasquet.jpg';

export const DEPORTES = ['Fútbol', 'Tenis', 'Basquetbol', 'Vóleibol', 'Pádel'];

export const COMUNAS = ['Ñuñoa', 'Providencia', 'San Miguel', 'Las Condes', 'La Florida'];

// Imagen por defecto cuando una cancha no tiene foto
export const IMAGEN_POR_DEFECTO = canchaTenis;

// Canchas estáticas: siempre visibles y no editables
export const CANCHAS_ESTATICAS = [
  {
    id: 'est-1',
    nombre: 'Cancha Central Norte',
    deporte: 'Tenis',
    comuna: 'Ñuñoa',
    precio: 7000,
    descripcion: 'Cancha de pasto sintético con iluminación nocturna. Capacidad para 10 personas.',
    disponible: true,
    imagen: canchaTenis,
    correoDueno: '',
  },
  {
    id: 'est-2',
    nombre: 'Multicancha Barrio Sur',
    deporte: 'Fútbol',
    comuna: 'San Miguel',
    precio: 6500,
    descripcion: 'Cancha de cemento pulido con tableros reglamentarios y graderías.',
    disponible: true,
    imagen: canchaFutbol,
    correoDueno: '',
  },
  {
    id: 'est-3',
    nombre: 'Court Providencia',
    deporte: 'Basquetbol',
    comuna: 'Providencia',
    precio: 12000,
    descripcion: 'Cancha techada con piso de madera y tableros profesionales.',
    disponible: true,
    imagen: canchaBasquet,
    correoDueno: '',
  },
];
