// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:8080'
    }
  },
  resolve: {
    // so you can import .ts/.tsx without extension
    extensions: [
      '.mjs',
      '.js',
      '.ts',
      '.tsx',
      '.jsx',
      '.json'
    ]
  },
  plugins: [
    react()
  ]
});