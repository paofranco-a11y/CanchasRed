import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CanchaForm from '../CanchaForm';

// Mock del módulo de imágenes: en jsdom no existe canvas
vi.mock('../../utils/imagen', () => ({
  TIPOS_PERMITIDOS: ['image/png', 'image/jpeg'],
  leerImagen: vi.fn().mockResolvedValue('data:image/jpeg;base64,FAKE'),
}));

describe('CanchaForm', () => {
  let onGuardar;
  beforeEach(() => { onGuardar = vi.fn(); });
  afterEach(() => { vi.clearAllMocks(); });

  it('muestra error de precio fuera de rango y de imagen faltante', () => {
    render(<CanchaForm cancha={null} onGuardar={onGuardar} onCancelar={() => {}} />);
    fireEvent.change(screen.getByLabelText('Precio por hora ($)'), { target: { value: '500' } });
    fireEvent.click(screen.getByRole('button', { name: 'Publicar' }));
    expect(screen.getByText('El precio debe ser mayor a $1.000 y menor a $100.000.')).toBeInTheDocument();
    expect(screen.getByText('Debes subir una imagen de la cancha.')).toBeInTheDocument();
    expect(onGuardar).not.toHaveBeenCalled();
  });

  it('con datos válidos llama a onGuardar con los datos de la cancha', async () => {
    render(<CanchaForm cancha={null} onGuardar={onGuardar} onCancelar={() => {}} />);
    fireEvent.change(screen.getByLabelText('Nombre de la cancha'), { target: { value: 'Cancha Nueva' } });
    fireEvent.change(screen.getByLabelText('Tipo de deporte'), { target: { value: 'Pádel' } });
    fireEvent.change(screen.getByLabelText('Comuna'), { target: { value: 'Las Condes' } });
    fireEvent.change(screen.getByLabelText('Precio por hora ($)'), { target: { value: '15000' } });
    fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'Cancha techada' } });
    const archivo = new File(['x'], 'foto.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText('Imagen'), { target: { files: [archivo] } });
    // esperar a que se lea la imagen (promesa mockeada)
    await waitFor(() => expect(screen.queryByText('Debes subir una imagen de la cancha.')).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Publicar' }));

    expect(onGuardar).toHaveBeenCalledTimes(1);
    expect(onGuardar).toHaveBeenCalledWith({
      nombre: 'Cancha Nueva',
      deporte: 'Pádel',
      comuna: 'Las Condes',
      precio: 15000,
      descripcion: 'Cancha techada',
      imagen: 'data:image/jpeg;base64,FAKE',
      disponible: true,
    });
  });
});
