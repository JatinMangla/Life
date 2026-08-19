import { chromium } from '@playwright/test';
import type { FullConfig } from '@playwright/test';

const routes = [
  '/',
  '/contact',
  '/uses',
  '/projects/mera-monitor',
  '/projects/screen-coach',
  '/this-page-does-not-exist',
];

/**
 * Visit every route once before the suite runs.
 *
 * On a cold cache the Vite dev server discovers and pre-bundles dependencies
 * on first request, and finishes by triggering a full page reload. That reload
 * destroys any execution context a test is mid-`evaluate` on, which shows up
 * as "Execution context was destroyed" on whichever test happened to go first.
 * Warming the routes here moves that reload outside the tests.
 */
export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use?.baseURL ?? 'http://localhost:7777';
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const route of routes) {
    await page.goto(new URL(route, baseURL).href, { waitUntil: 'load' });
    await page.waitForTimeout(500);
  }

  await browser.close();
}
