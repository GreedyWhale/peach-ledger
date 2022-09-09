import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import postcssPxToViewport8Plugin from 'postcss-px-to-viewport-8-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '~/': path.join(__dirname, '/src/'),
    },
  },
  css: {
    postcss: {
      plugins: [
        postcssPxToViewport8Plugin({
          unitToConvert: 'px',
          viewportWidth: 750,
          unitPrecision: 5,
          viewportUnit: 'vw',
          minPixelValue: 1,
          mediaQuery: true,
          exclude: [/node_modules/],
        }),
      ],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: any) {
          if (id.includes('echarts')) {
            return 'echarts';
          }

          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
