import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

/**
 * GitHub Pages serves 404.html for unknown paths. Copying index.html there
 * lets the client-side router handle deep links such as /projects/<id>.
 */
function spaFallback(): Plugin {
  let outDir = 'dist';
  return {
    name: 'spa-fallback-404',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'));
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), spaFallback()],
  build: {
    // three.js alone is about 560 kB. It is split off and only loaded on
    // the start page (src/components/hero), so the warning doesn't apply.
    chunkSizeWarningLimit: 600,
  },
});
