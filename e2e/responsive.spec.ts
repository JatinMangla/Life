import { test, expect } from '@playwright/test';
import { pages } from './routes';

// These set their own viewport sizes, so running them again under the
// `mobile` project would only repeat the same checks.
test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'sets its own viewports');
});

const screens = [
  { name: 'iPhone', width: 390, height: 844 },
  { name: 'iPad portrait', width: 768, height: 1024 },
  { name: 'iPad landscape', width: 1024, height: 768 },
];

// Regression test. body hides horizontal overflow, so scrollWidth always
// matched the screen — but iOS Safari still lets a page pan and zoom out
// sideways into anything wider. The /uses marquee was a 4,000px row on every
// phone and tablet. An element may only pass the right edge inside an
// ancestor that clips or scrolls it (the marquee, the case-study tables).
for (const screen of screens) {
  test(`no page is wider than an ${screen.name} screen`, async ({ page }) => {
    await page.setViewportSize({ width: screen.width, height: screen.height });

    for (const { path } of pages) {
      await page.goto(path);

      const offenders = await page.evaluate(() => {
        const width = window.innerWidth;
        const found: string[] = [];

        for (const element of document.querySelectorAll('body *')) {
          const box = element.getBoundingClientRect();

          if (box.width === 0 || box.right <= width + 1) continue;

          let parent = element.parentElement;
          let contained = false;

          while (parent && parent !== document.body) {
            if (/hidden|clip|auto|scroll/.test(getComputedStyle(parent).overflowX)) {
              contained = true;
              break;
            }
            parent = parent.parentElement;
          }

          if (!contained) found.push(`${element.tagName}.${element.className} → ${Math.round(box.right)}px`);
        }

        return found.slice(0, 5);
      });

      expect(offenders, `${path} at ${screen.width}px`).toEqual([]);
    }
  });
}

// Regression test. Between 697 and 1040px the hero got the desktop layout,
// with the 3D object drawn behind the copy — on an iPad in portrait it sat
// right on the headline. Upright tablets now stack it in a band above, like
// phones. The CSS orb always holds the object's place, WebGL or not, so it
// stands in for the scene here.
for (const size of [
  { width: 768, height: 1024 },
  { width: 820, height: 1180 },
  { width: 1024, height: 1366 },
]) {
  test(`hero object sits above the headline on a ${size.width}px upright tablet`, async ({
    page,
  }) => {
    await page.setViewportSize(size);
    await page.goto('/');

    const orb = await page.locator('#intro [class*="orb"]').boundingBox();
    const heading = await page.getByRole('heading', { level: 1 }).boundingBox();

    expect(orb).not.toBeNull();
    expect(heading).not.toBeNull();
    expect(orb!.y + orb!.height).toBeLessThanOrEqual(heading!.y);
  });
}

// Regression test. On a 768px-tall laptop the hero copy reaches the bottom of
// the screen and the absolutely placed "Scroll" cue landed on the third stat.
test('the scroll cue stays out of the way on a short laptop screen', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('/');

  await expect(page.getByRole('link', { name: 'Scroll to projects' })).toBeHidden();
});
