import { defineConfig } from 'vite';
import { vitePlugin as remix } from '@remix-run/dev';
import { vercelPreset } from '@vercel/remix/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  assetsInclude: ['**/*.glb', '**/*.hdr', '**/*.glsl'],
  build: {
    assetsInlineLimit: 1024,
  },
  server: {
    port: 7777,
  },
  plugins: [
    // The home page is routes/_index/, Remix's own index convention. It used
    // to be routes/home/ remapped to "/" here, which the flat-routes
    // convention *also* served at /home: a duplicate homepage.
    remix({
      presets: [vercelPreset()],
    }),
    tsconfigPaths(),
  ],
});
