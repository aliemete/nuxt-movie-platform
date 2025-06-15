import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node', // Используем node окружение вместо happy-dom
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});