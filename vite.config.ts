import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
    ViteImageOptimizer({
      test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
      includePublic: true,
      logStats: true,

      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupNumericValues: false,
              },
            },
          },
          'removeViewBox',
          'sortAttrs',
          {
            name: 'addAttributesToSVGElement',
            params: {
              attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
            },
          },
        ],
      },

      png: {
        quality: 90,
        compressionLevel: 9,
      },

      jpeg: {
        quality: 85,
        progressive: true,
        mozjpeg: true,
      },

      jpg: {
        quality: 85,
        progressive: true,
        mozjpeg: true,
      },

      webp: {
        quality: 85,
        lossless: false,
      },

      avif: {
        quality: 80,
        lossless: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://skyrise-backend-wh9o.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
