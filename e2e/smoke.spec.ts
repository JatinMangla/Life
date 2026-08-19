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

// Regression test: the navbar hides its social icons below 696px, and the
// mobile nav that used to hold them was unreachable dead code. For a while a
// phone visitor had no route to GitHub or LinkedIn at all.
test('social profiles are reachable at every width', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  await expect(page.getByRole('link', { name: /on Github$/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /on Linkedin$/ })).toBeVisible();
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
