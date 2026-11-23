import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { beforeEach, afterEach, vi } from 'vitest';

// En pruebas unitarias simulamos fetch sin red por defecto para que respondan al instante
beforeEach(() => {
  vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline-test'));
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
