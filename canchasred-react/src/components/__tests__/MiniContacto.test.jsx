import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MiniContacto from '../MiniContacto';

describe('MiniContacto', () => {
  it('muestra error cuando el correo tiene mal formato', () => {
    render(<MiniContacto />);
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'correo-malo' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }));
    expect(screen.getByText('Ingresa un correo válido.')).toBeInTheDocument();
    expect(screen.queryByText('¡Gracias! Te contactaremos pronto.')).not.toBeInTheDocument();
  });

  it('con datos válidos muestra el agradecimiento y limpia los campos', () => {
    render(<MiniContacto />);
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ale' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'ale@mail.com' } });
    fireEvent.change(screen.getByLabelText('Teléfono'), { target: { value: '912345678' } });
    fireEvent.change(screen.getByLabelText('Mensaje'), { target: { value: 'Busco cancha de tenis' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }));
    expect(screen.getByText('¡Gracias! Te contactaremos pronto.')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre')).toHaveValue('');
    expect(screen.getByLabelText('Correo electrónico')).toHaveValue('');
  });
});
