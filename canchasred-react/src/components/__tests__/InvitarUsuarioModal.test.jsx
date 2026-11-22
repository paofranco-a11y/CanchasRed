import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InvitarUsuarioModal from '../InvitarUsuarioModal';

describe('InvitarUsuarioModal', () => {
  afterEach(() => { vi.restoreAllMocks(); });

  it('con el formulario vacío muestra los errores y no llama a onInvitar', () => {
    // preparar
    const onInvitar = vi.fn();
    render(<InvitarUsuarioModal onInvitar={onInvitar} onCerrar={() => {}} />);
    // actuar
    fireEvent.click(screen.getByRole('button', { name: 'Enviar invitación' }));
    // comprobar
    expect(screen.getByText('Ingresa el nombre completo (mínimo 3 caracteres).')).toBeInTheDocument();
    expect(screen.getByText('Ingresa un correo electrónico válido.')).toBeInTheDocument();
    expect(screen.getByText('Debes seleccionar un rol.')).toBeInTheDocument();
    expect(onInvitar).not.toHaveBeenCalled();
  });

  it('con datos válidos llama una vez a onInvitar con nombre, correo y rol', () => {
    const onInvitar = vi.fn();
    render(<InvitarUsuarioModal onInvitar={onInvitar} onCerrar={() => {}} />);
    fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: 'Pedro Pérez' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'pedro@mail.com' } });
    fireEvent.change(screen.getByLabelText('Rol'), { target: { value: 'dueno' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar invitación' }));
    expect(onInvitar).toHaveBeenCalledTimes(1);
    expect(onInvitar).toHaveBeenCalledWith({ nombre: 'Pedro Pérez', correo: 'pedro@mail.com', rol: 'dueno' });
  });
});
