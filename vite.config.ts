import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Required for GitHub Pages (project site: https://<user>.github.io/MC-Check/)
  base: '/MC-Check/',
});
