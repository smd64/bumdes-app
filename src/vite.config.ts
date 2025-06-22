import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // ✅ tambahkan ini

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@features': path.resolve(__dirname, 'src/features'), // ✅ ini bagian penting
    },
  },
  optimizeDeps: {
    include: [
      '@chakra-ui/react',
      '@chakra-ui/system',
      '@chakra-ui/utils',
      '@chakra-ui/theme-tools',
      '@chakra-ui/color-mode',
      '@chakra-ui/layout',
      '@emotion/react',
      '@emotion/styled',
      'framer-motion',
    ],
  },
});
