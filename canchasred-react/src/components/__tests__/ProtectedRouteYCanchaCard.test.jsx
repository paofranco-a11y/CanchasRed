import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import ProtectedRoute from '../ProtectedRoute';
import CanchaCard from '../CanchaCard';

describe('ProtectedRoute', () => {
  beforeEach(() => { localStorage.clear(); });

  it('sin sesión redirige a /login', () => {
    render(
      <MemoryRouter initialEntries={['/privada']}>
        <AuthProvider>
          <Routes>
            <Route path="/privada" element={<ProtectedRoute rol="deportista"><p>Contenido privado</p></ProtectedRoute>} />
            <Route path="/login" element={<p>Pantalla de login</p>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Pantalla de login')).toBeInTheDocument();
    expect(screen.queryByText('Contenido privado')).not.toBeInTheDocument();
  });
});

describe('CanchaCard', () => {
  it('muestra nombre, comuna, precio y el enlace al detalle', () => {
    const cancha = {
      id: 'est-1', nombre: 'Cancha Central Norte', deporte: 'Tenis', comuna: 'Ñuñoa',
      precio: 7000, descripcion: 'Descripción', imagen: 'foto.png',
    };
    render(<MemoryRouter><CanchaCard cancha={cancha} /></MemoryRouter>);
    expect(screen.getByText('Cancha Central Norte')).toBeInTheDocument();
    expect(screen.getByText('Ñuñoa')).toBeInTheDocument();
    expect(screen.getByText('$7.000').parentElement).toHaveTextContent('$7.000 /hora');
    expect(screen.getByRole('link', { name: 'Ver Detalle' })).toHaveAttribute('href', '/cancha/est-1');
  });
});
