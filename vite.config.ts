// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@/': '/src/', // Adjust according to your project structure if needed
    },
  },
});