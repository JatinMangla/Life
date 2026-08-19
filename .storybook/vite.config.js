import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  process.env = { ...process.env, ...env };

  return {
    // Matches the app's vite.config.js so stories can import the same assets.
    assetsInclude: ['**/*.glb', '**/*.hdr', '**/*.glsl'],
    plugins: [tsconfigPaths(), react()],
  };
});
