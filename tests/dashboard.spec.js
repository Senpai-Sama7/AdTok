import { test, expect } from '@playwright/test';

test.describe('AdTok dashboard smoke tests', () => {
  test('renders default dashboard view and hides others', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#home')).toBeVisible();
    await expect(page.locator('#psychology')).toHaveClass(/hidden/);
    await expect(page.locator('#scripts')).toHaveClass(/hidden/);
  });

  test('sidebar navigation updates aria state and reveals panel', async ({ page }) => {
    await page.goto('/');

    const psychologyNav = page.getByRole('tab', { name: 'Psychology', exact: true });
    await psychologyNav.click();

    await expect(psychologyNav).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#psychology')).not.toHaveClass(/hidden/);
    await expect(page.locator('#home')).toHaveClass(/hidden/);

    const dashboardShortcut = page.getByRole('button', { name: 'Dashboard' });
    await dashboardShortcut.click();

    await expect(dashboardShortcut).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#home')).not.toHaveClass(/hidden/);
  });

  test('charts initialize with non-zero canvas dimensions', async ({ page }) => {
    await page.goto('/');

    const canvases = ['line', 'bars', 'pie', 'gantt'].map(id => page.locator(`#${id}`));

    for (const canvas of canvases) {
      await expect.poll(async () => await canvas.evaluate(el => el.width || 0)).toBeGreaterThan(0);
      await expect(canvas).toBeVisible();
    }
  });
});
