import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: true, // Keep this true for now, or set to false if you want to disable the overlay
    },
  },
});