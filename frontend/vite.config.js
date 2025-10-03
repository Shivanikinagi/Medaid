import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    proxy: {
      '/api': {
        target: 'https://medaid-b-production.up.railway.app',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});