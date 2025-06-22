import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// GANTI ini dengan nama repo kamu di GitHub
const repoName = 'bumdes-app'; // contoh: jika url kamu https://username.github.io/bumdes-app/

export default defineConfig({
  root: __dirname, // asumsikan ini sudah di apps/dashboard
  plugins: [react()],
  base: `/${repoName}/`, // ← wajib untuk GitHub Pages
  build: {
    outDir: 'dist', // default
    emptyOutDir: true,
  },
});
