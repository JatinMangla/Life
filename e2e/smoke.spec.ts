import { test, expect } from '@playwright/test';

test('home lists both projects and no removed ones', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /Mera Monitor/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Screen Coach/ })).toBeVisible();
  await expect(page.getByText(/Messaging Automation/i)).toHaveCount(0);
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

test('contact form reports validation errors without leaving the page', async ({ page }) => {
  await page.goto('/contact');
  await page.getByRole('button', { name: /send message/i }).click();

  // The browser's own constraint validation should block submission.
  await expect(page).toHaveURL(/\/contact$/);
});

test('theme toggle flips the document theme', async ({ page }) => {
  await page.goto('/');

  const body = page.locator('body');
  const before = await body.getAttribute('data-theme');

  await page.getByRole('button', { name: /toggle theme/i }).first().click();
  await expect(body).not.toHaveAttribute('data-theme', before ?? 'dark');
});
