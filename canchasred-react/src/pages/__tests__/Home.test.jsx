import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderConProveedores } from '../../components/__tests__/renderConProveedores';
import Home from '../Home';

describe('Home', () => {
  beforeEach(() => { localStorage.clear(); });

  it('al filtrar por Tenis solo queda la cancha de tenis', () => {
    renderConProveedores(<Home />);
    expect(screen.getByText('3 canchas disponibles')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Tenis' }));
    expect(screen.getByText('Cancha Central Norte')).toBeInTheDocument();
    expect(screen.queryByText('Multicancha Barrio Sur')).not.toBeInTheDocument();
    expect(screen.queryByText('Court Providencia')).not.toBeInTheDocument();
  });

  it('al buscar "san miguel" (sin tildes ni mayúsculas) solo queda la Multicancha', () => {
    renderConProveedores(<Home />);
    fireEvent.change(screen.getByLabelText('Buscar canchas'), { target: { value: 'san miguel' } });
    expect(screen.getByText('Multicancha Barrio Sur')).toBeInTheDocument();
    expect(screen.queryByText('Cancha Central Norte')).not.toBeInTheDocument();
  });
});
