import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base можно переопределить при размещении в подпапке: BASE=/proem/ npm run build
export default defineConfig({
  base: process.env.BASE ?? '/',
  plugins: [react()],
  server: { port: 5180 },
  preview: { port: 5181 },
});
