import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3000',
        changeOrigin: true,
      },
      '/ws': {
        target: process.env.VITE_WS_URL || 'ws://localhost:3001',
        ws: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        // Rolldown (Vite 8) requires manualChunks as a function, not an object
        manualChunks(id) {
          if (['react', 'react-dom', 'react-router-dom'].some((p) => id.includes(`/node_modules/${p}/`))) {
            return 'react-vendor';
          }
          if (['wagmi', 'viem', '@rainbow-me/rainbowkit'].some((p) => id.includes(`/node_modules/${p}/`))) {
            return 'wagmi-vendor';
          }
        },
      },
    },
  },
});
