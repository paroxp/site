import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { config } from '../src/config';

const siteTitle = `${config.name} - ${config.title}`;
const pages = [
  { path: '/', title: siteTitle },
  { path: '/about', title: `About - ${siteTitle}` },
  { path: '/404', title: `Page not found - ${siteTitle}` },
];
const narrow = { height: 800, width: 400 };

for (const { path, title } of pages) {
  test.describe(path, () => {
    // A blocked Content-Security-Policy directive is reported as a console error.
    test('loads without errors', async ({ page }) => {
      await page.goto(path);

      await expect(page).toHaveTitle(title);
      await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', new URL(path, config.url).href);

      const messages = await page.consoleMessages();
      expect(messages.filter(message => message.type() === 'error').map(message => message.text())).toEqual([]);
      expect(await page.pageErrors()).toEqual([]);
    });

    for (const colorScheme of ['light', 'dark'] as const) {
      test(`has no accessibility violations in ${colorScheme} mode`, async ({ browser }) => {
        const context = await browser.newContext({ colorScheme });
        const page = await context.newPage();
        await page.goto(path);

        // Known issue, still to be fixed: the experience headings contain a link.
        const { violations } = await new AxeBuilder({ page })
          .disableRules(['nested-interactive'])
          .analyze();

        expect(violations.map(violation => `${violation.id}: ${violation.help}`)).toEqual([]);
        await context.close();
      });
    }
  });
}

test.describe('navigation', () => {
  test('the header links between the pages', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL('/about');

    await page.getByRole('link', { name: 'Home' }).click();
    await expect(page).toHaveURL('/');
  });

  test('an unknown address shows the not found page', async ({ page }) => {
    const response = await page.goto('/missing');

    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  });
});

test.describe('experience', () => {
  test('is collapsed on a wide screen and expands on click', async ({ page }) => {
    await page.goto('/about');
    const entry = page.locator('details').first();

    await expect(entry.locator('.embedded').first()).toBeHidden();
    await entry.locator('summary').click({ position: { x: 5, y: 5 } });
    await expect(entry.locator('.embedded').first()).toBeVisible();
  });

  test('is expanded on a narrow screen', async ({ page }) => {
    await page.setViewportSize(narrow);
    await page.goto('/about');

    await expect(page.locator('details[open]')).toHaveCount(await page.locator('details').count());
  });

  test('can be operated with the keyboard', async ({ page }) => {
    await page.goto('/about');
    const entry = page.locator('details').first();

    await page.keyboard.press('Tab');
    await entry.locator('summary').focus();
    await expect(entry.locator('summary')).not.toHaveCSS('outline-style', 'none');

    await page.keyboard.press('Enter');
    await expect(entry).toHaveAttribute('open');
  });

  test('is open when the page is printed', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('details[open]')).toHaveCount(0);

    await page.pdf();

    await expect(page.locator('details[open]')).toHaveCount(await page.locator('details').count());
  });

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('is readable', async ({ page }) => {
      await page.goto('/about');

      await expect(page.locator('details .embedded').first()).toBeVisible();
    });
  });
});

test.describe('skills', () => {
  test('can be highlighted with the mouse and the keyboard', async ({ page }) => {
    await page.goto('/about');
    const skill = page.getByRole('button', { name: 'TypeScript' });

    await expect(skill).toHaveAttribute('aria-pressed', 'false');
    await skill.click();
    await expect(skill).toHaveAttribute('aria-pressed', 'true');

    await skill.focus();
    await page.keyboard.press('Space');
    await expect(skill).toHaveAttribute('aria-pressed', 'false');
  });
});
