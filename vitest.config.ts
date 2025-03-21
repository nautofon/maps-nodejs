import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],
  test: {
    include: ['**/*.test.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
    },
  },
});
