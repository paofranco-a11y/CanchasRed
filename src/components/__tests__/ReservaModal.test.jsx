import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ReservaModal from '../ReservaModal';

const cancha = { id: 'est-1', nombre: 'Cancha Central Norte', precio: 7000 };

describe('ReservaModal', () => {
  afterEach(() => { vi.restoreAllMocks(); });

  it('sin fecha y hora muestra el error y no llama a onConfirmar', () => {
    const onConfirmar = vi.fn();
    render(<ReservaModal cancha={cancha} onConfirmar={onConfirmar} onCerrar={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Reserva' }));
    expect(screen.getByText('Debes elegir fecha y hora.')).toBeInTheDocument();
    expect(onConfirmar).not.toHaveBeenCalled();
  });

  it('con fecha, hora y horas válidas llama una vez a onConfirmar', () => {
    const onConfirmar = vi.fn();
    render(<ReservaModal cancha={cancha} onConfirmar={onConfirmar} onCerrar={() => {}} />);
    fireEvent.change(screen.getByLabelText('Fecha'), { target: { value: '2099-12-31' } });
    fireEvent.change(screen.getByLabelText('Hora'), { target: { value: '18:30' } });
    fireEvent.change(screen.getByLabelText('Cantidad de horas'), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Reserva' }));
    expect(onConfirmar).toHaveBeenCalledTimes(1);
    expect(onConfirmar).toHaveBeenCalledWith({ fecha: '2099-12-31', hora: '18:30', horas: 2 });
  });
});
