import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import Contacto from '../Contacto';
import { renderConProveedores } from '../../components/__tests__/renderConProveedores';

describe('Contacto', () => {
  beforeEach(() => { localStorage.clear(); });

  it('muestra los errores de nombre, email, teléfono y mensaje al enviar vacío', () => {
    renderConProveedores(<Contacto />);
    fireEvent.click(screen.getByRole('button', { name: /Enviar Mensaje/i }));
    expect(screen.getByText('Ingresa tu nombre.')).toBeInTheDocument();
    expect(screen.getByText('Ingresa un email válido.')).toBeInTheDocument();
    expect(screen.getByText('Ingresa tu teléfono.')).toBeInTheDocument();
    expect(screen.getByText('Escribe tu mensaje.')).toBeInTheDocument();
  });

  it('con datos válidos muestra el éxito y limpia los campos', () => {
    renderConProveedores(<Contacto />);
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Paola' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'paola@mail.com' } });
    fireEvent.change(screen.getByLabelText('Teléfono'), { target: { value: '+56 9 1234 5678' } });
    fireEvent.change(screen.getByLabelText('Mensaje'), { target: { value: 'Hola, tengo una consulta' } });
    fireEvent.click(screen.getByRole('button', { name: /Enviar Mensaje/i }));
    expect(screen.getByText('¡Mensaje enviado con éxito!')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre')).toHaveValue('');
    expect(screen.getByLabelText('Mensaje')).toHaveValue('');
  });
});
