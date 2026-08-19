import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  { name: 'home', path: '/' },
  { name: 'contact', path: '/contact' },
  { name: 'tech stack', path: '/uses' },
  { name: 'Mera Monitor case study', path: '/projects/mera-monitor' },
  { name: 'Screen Coach case study', path: '/projects/screen-coach' },
  { name: '404', path: '/this-page-does-not-exist' },
];

/**
 * Sections reveal on scroll by transitioning from `opacity: 0`, and axe
 * measures the blended colour it finds. Auditing without scrolling therefore
 * reports every un-revealed section as a contrast failure — white at 8%
 * opacity over #111 reads as #252525. Scroll the page the way a reader would,
 * then let the transitions settle, so axe sees the final state.
 */
async function revealPage(page: Page) {
  await page.locator('#main-content').waitFor({ state: 'attached' });

  await page.evaluate(async () => {
    const height = document.body.scrollHeight;
    const steps = 6;

    for (let i = 1; i <= steps; i += 1) {
      window.scrollTo(0, (height / steps) * i);
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    window.scrollTo(0, 0);
  });

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
