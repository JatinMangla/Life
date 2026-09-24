import { test, expect } from '@playwright/test';
import { projects, projectPath } from '../app/data/projects';
import { readFileSync } from 'node:fs';

// Read rather than imported: Playwright loads specs as native ES modules,
// which refuse a JSON import without an import attribute.
const config = JSON.parse(
  readFileSync(new URL('../app/config.json', import.meta.url), 'utf8')
) as { url: string; email: string };

test('home lists every project and no removed ones', async ({ page }) => {
  await page.goto('/');

  for (const project of projects) {
    await expect(
      page.getByRole('heading', { level: 2, name: project.shortTitle, exact: true })
    ).toBeAttached();
    await expect(page.locator(`a[href="${projectPath(project.slug)}"]`).first()).toBeAttached();
  }

  await expect(page.getByText(/Messaging Automation/i)).toHaveCount(0);
});

test('the work history and a direct email are on the home page', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /where i.ve worked/i })).toBeAttached();
  await expect(page.locator(`a[href="mailto:${config.email}"]`).first()).toBeAttached();
});

test('/home is not a second copy of the homepage', async ({ page }) => {
  const response = await page.goto('/home');

  // The app answers 404; on Vercel, vercel.json redirects it to / first.
  // Either is fine — serving the homepage again at /home is not.
  const redirectedHome = new URL(page.url()).pathname === '/';

  expect(redirectedHome || response?.status() === 404).toBe(true);
});

test('skip link is reachable by keyboard and lands on main', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');

  const skipLink = page.getByRole('link', { name: /skip to main content/i });

  await expect(skipLink).toBeFocused();
  await expect(skipLink).toHaveAttribute('href', '#main-content');
  await expect(page.locator('#main-content')).toBeAttached();
});

// Regression test. The navbar used to hide its social icons below 696px and
// delegate them to a mobile nav sheet that has been unreachable since the
// hamburger was removed, so phones had no route to either profile. The footer
// covered it for a while; with the footer gone the navbar is the only route.
test('social profiles are reachable at every width', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('link', { name: 'Github', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Linkedin', exact: true })).toBeVisible();
});

test('contact form confirms a sent message and moves focus to it', async ({ page }) => {
  // The real route sends mail through Gmail; the form's behaviour is what is
  // under test here, and route.test.ts covers the server side.
  await page.route('**/api/contact*', route =>
    route.fulfill({ json: { success: true, name: 'Ada' } })
  );

  await page.goto('/contact');
  await page.getByLabel('Your name').fill('Ada');
  await page.getByLabel('Your email').fill('ada@example.com');
  await page.getByLabel('Message').fill('Hello there.');
  await page.getByRole('button', { name: /send message/i }).click();

  const confirmation = page.getByRole('heading', { name: 'Message Sent' });

  await expect(confirmation).toBeVisible();
  await expect(confirmation).toBeFocused();
  await expect(page.getByRole('status')).toHaveText('Message sent.');
});

test('contact form blocks an empty submission', async ({ page }) => {
  let submitted = false;

  await page.route('**/api/contact*', route => {
    submitted = true;
    return route.fulfill({ json: { success: true } });
  });

  await page.goto('/contact');
  await page.getByRole('button', { name: /send message/i }).click();
  await page.waitForTimeout(500);

  // Required fields stop the browser from submitting at all.
  expect(submitted).toBe(false);
  await expect(page.getByRole('heading', { name: 'Message Sent' })).toHaveCount(0);
});

test('theme toggle flips the document theme', async ({ page }) => {
  await page.goto('/');

  const body = page.locator('body');
  const before = await body.getAttribute('data-theme');

  await page.getByRole('button', { name: /toggle theme/i }).first().click();
  await expect(body).not.toHaveAttribute('data-theme', before ?? 'dark');
});

test('robots.txt and the sitemap advertise the canonical origin', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text();
  const sitemap = await (await request.get('/sitemap.xml')).text();

  expect(robots).toContain(`Sitemap: ${config.url}/sitemap.xml`);

  for (const project of projects) {
    expect(sitemap).toContain(`<loc>${config.url}${projectPath(project.slug)}</loc>`);
  }
});
