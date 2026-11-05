import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  // GitHub Pages serves this project from /aleksandra_masaz/.
  base: '/aleksandra_masaz/',
  server: {
    port: 5173,
  },
  build: {
    assetsInlineLimit: 4096,
  },
  plugins: [
    ViteImageOptimizer({
      // Keep <symbol> sprites intact (icons.svg) — SVGO drops "unused" symbols and ids by default
      svg: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: { removeHiddenElems: false, cleanupIds: false, removeUselessDefs: false },
            },
          },
        ],
      },
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { quality: 80 },
    }),
  ],
});
