import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  { name: 'home', path: '/' },
  { name: 'contact', path: '/contact' },
  { name: 'tech stack', path: '/uses' },
  { name: 'Mera Monitor case study', path: '/projects/mera-monitor' },
  { name: 'Screen Coach case study', path: '/projects/screen-coach' },
  { name: 'Kundli Predict case study', path: '/projects/kundli-predict' },
  { name: 'CareerPilot AI case study', path: '/projects/careerpilot-ai' },
  { name: '404', path: '/this-page-does-not-exist' },
];

/**
 * Sections reveal on scroll by transitioning from `opacity: 0`, and axe
 * measures the blended colour it finds. Auditing without scrolling therefore
 * reports every un-revealed section as a contrast failure — white at 8%
 * opacity over #111 reads as #252525. Scroll the page the way a reader would,
 * then let the transitions settle, so axe sees the final state.
 */
/**
 * The dev server can reload the page out from under an `evaluate` while it
 * pre-bundles a newly discovered dependency. Global setup warms the routes to
 * make that rare; this swallows the one-off if it still happens.
 */
async function scrollTolerantly<T>(
  page: Page,
  fn: () => T,
  fallback: T
): Promise<T> {
  try {
    return await page.evaluate(fn);
  } catch {
    await page.waitForTimeout(500);
    try {
      return await page.evaluate(fn);
    } catch {
      return fallback;
    }
  }
}

async function scrollTo(page: Page, y: number) {
  try {
    await page.evaluate(offset => window.scrollTo(0, offset), y);
  } catch {
    // Context went away mid-scroll; the next step will carry on.
  }
}

async function revealPage(page: Page) {
  await page.locator('#main-content').waitFor({ state: 'attached' });

  // Let hydration finish first. Stepping the scroll while Remix is still
  // taking over the document destroys the evaluate context mid-call.
  await page.waitForLoadState('load');
  await page.waitForTimeout(500);

  const height = await scrollTolerantly(page, () => document.body.scrollHeight, 0);
  const steps = 6;

  // One short evaluate per step, driven from here rather than a single long
  // in-page loop, so a transient context teardown costs one step, not the test.
  for (let i = 1; i <= steps; i += 1) {
    await scrollTo(page, (height / steps) * i);
    await page.waitForTimeout(150);
  }

  await scrollTo(page, 0);

  // Longest reveal transition in the theme is 800ms, plus collapse delays.
  await page.waitForTimeout(1500);
}

for (const { name, path } of pages) {
  test(`${name} has no detectable accessibility violations`, async ({ page }) => {
    await page.goto(path);
    await revealPage(page);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}
