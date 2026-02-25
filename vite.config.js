import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [react()],
    // Relative base so assets load correctly on GitHub Pages (works at any path, e.g. /MC-Check/)
    base: './',
});
