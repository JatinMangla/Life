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
  // One copy of React and three.js for everything. The R3F scenes load
  // lazily, so without this the dev server discovered them mid-session,
  // re-bundled, and handed the canvas a second React ("Invalid hook call")
  // and drei a second three.js.
  resolve: {
    dedupe: ['react', 'react-dom', 'three'],
  },
  optimizeDeps: {
    include: ['three', 'three-stdlib', '@react-three/fiber', '@react-three/drei'],
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
