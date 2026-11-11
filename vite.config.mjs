import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: process.env.VITE_BASE || './',
  plugins: [vue()],
  server: {
    port: 3000,
    host: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        landing: resolve(import.meta.dirname, 'pages/landing.html'),
        dashboard: resolve(import.meta.dirname, 'pages/dashboard.html'),
        storybook: resolve(import.meta.dirname, 'pages/storybook.html'),
        ecommerce: resolve(import.meta.dirname, 'pages/ecommerce.html'),
        messenger: resolve(import.meta.dirname, 'pages/messenger.html'),
        kanban: resolve(import.meta.dirname, 'pages/kanban.html'),
        multistep: resolve(import.meta.dirname, 'pages/multistep.html'),
      },
    },
  },
});
