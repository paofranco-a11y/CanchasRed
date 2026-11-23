import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';

// Envuelve el componente con router y contexto de autenticación para los tests
export function renderConProveedores(ui, { ruta = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
}
