import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/resource-hub/',
  server: {
    port: 5173,
    open: false
  }
});

