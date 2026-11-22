import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/**
 * Archivo de configuración global para pruebas unitarias e integración (Testing Library / Jest / Vitest).
 * Extiende las afirmaciones (matchers) del DOM para facilitar la validación de componentes React en el entorno de testing.
 */
afterEach(() => { cleanup(); });
