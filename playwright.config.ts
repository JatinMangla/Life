import { defineConfig, devices } from '@playwright/test';

const PORT = 7777;

/**
 * Set to a deployed URL (a Vercel preview, via the deployment_status workflow)
 * to test the real production build. Without it the suite runs against the
 * dev server, which missed the one production outage so far: Response.json
 * existed in dev but not in the deployed runtime.
 */
const BASE_URL = process.env.BASE_URL;

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // In CI, annotations on the run plus an HTML report the workflow uploads as
  // an artifact; 'github' alone writes no files, so the upload found nothing.
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',

  // axe walks the whole tree, and these pages carry large WebGL scenes.
  // Dev-mode first compile of the three.js chunks is slow; these pages carry
  // large WebGL scenes and axe walks the whole tree afterwards.
  timeout: 180_000,
  expect: { timeout: 15_000 },

  use: {
    baseURL: BASE_URL ?? `http://localhost:${PORT}`,
    // Lets the deployed-build job through Vercel's preview protection.
    extraHTTPHeaders: process.env.VERCEL_AUTOMATION_BYPASS_SECRET
      ? { 'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET }
      : undefined,
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Accessibility and layout problems show up at mobile widths that desktop
    // hides, and the nav switches behaviour here.
    { name: 'mobile', use: { ...devices['Pixel 5'] } },
    // The site loads dark; the accessibility spec switches this project to the
    // light theme with the toggle first, so both themes are audited.
    {
      name: 'light',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /accessibility\.spec\.ts/,
    },
  ],

  // The Vercel preset changes the build layout, so remix-serve cannot serve
  // it; the dev server is what these tests run against.
  webServer: BASE_URL
    ? undefined
    : {
        command: 'npm run dev',
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
});
