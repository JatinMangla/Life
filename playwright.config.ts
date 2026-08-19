import { defineConfig, devices } from '@playwright/test';

const PORT = 7777;

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',

  // axe walks the whole tree, and these pages carry large WebGL scenes.
  // Dev-mode first compile of the three.js chunks is slow; these pages carry
  // large WebGL scenes and axe walks the whole tree afterwards.
  timeout: 180_000,
  expect: { timeout: 15_000 },

  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Accessibility and layout problems show up at mobile widths that desktop
    // hides, and the nav switches behaviour here.
    { name: 'mobile', use: { ...devices['Pixel 5'] } },
  ],

  // The Vercel preset changes the build layout, so remix-serve cannot serve
  // it; the dev server is what these tests run against.
  webServer: {
    command: 'npm run dev',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
