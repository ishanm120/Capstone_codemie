import { test, expect } from '@playwright/test';

test.describe('KAN-113 Category Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page.locator('h1.brand-title')).toHaveText('TaskMaster Pro');
  });

  test('AC1: category dropdown is visible and includes an All option', async ({ page }) => {
    const categoryFilter = page.locator('[data-testid="category-filter"]');
    await expect(categoryFilter).toBeVisible();
    await expect(categoryFilter.locator('option', { hasText: 'All Categories' })).toHaveCount(1);
  });

  test('AC2-AC4: category filter isolates tasks, composes with search, and persists across SPA interactions', async ({ page }) => {
    const timestamp = Date.now();
    const taskATitle = `Category Filter Work Task ${timestamp}`;
    const taskBTitle = `Category Filter Personal Task ${timestamp}`;
    const categoryFilter = page.locator('[data-testid="category-filter"]');

    // Create task A (category: work)
    await page.click('#add-task-btn');
    await page.fill('#task-title-input', taskATitle);
    await page.selectOption('#task-category-select', 'work');
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: taskATitle })).toBeVisible();

    // Create task B (category: personal)
    await page.click('#add-task-btn');
    await page.fill('#task-title-input', taskBTitle);
    await page.selectOption('#task-category-select', 'personal');
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: taskBTitle })).toBeVisible();

    // AC2: selecting "work" shows only task A; "All" resets to show both
    await categoryFilter.selectOption('work');
    await expect(page.locator('.task-title', { hasText: taskATitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: taskBTitle })).not.toBeVisible();

    await categoryFilter.selectOption('all');
    await expect(page.locator('.task-title', { hasText: taskATitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: taskBTitle })).toBeVisible();

    // AC3: category filter composes with the existing search filter
    await categoryFilter.selectOption('work');
    await page.fill('#task-search-input', taskATitle);
    await expect(page.locator('.task-title', { hasText: taskATitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: taskBTitle })).not.toBeVisible();

    await page.fill('#task-search-input', '');
    await expect(page.locator('.task-title', { hasText: taskATitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: taskBTitle })).not.toBeVisible();

    // AC4: category selection persists in app state through other SPA interactions (no reload)
    await page.click('#filter-completed-btn');
    await expect(page.locator('.task-title', { hasText: taskATitle })).not.toBeVisible();

    await page.click('#filter-all-btn');
    await expect(categoryFilter).toHaveValue('work');
    await expect(page.locator('.task-title', { hasText: taskATitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: taskBTitle })).not.toBeVisible();

    // Reset filter so subsequent tests/runs are unaffected
    await categoryFilter.selectOption('all');
  });
});
