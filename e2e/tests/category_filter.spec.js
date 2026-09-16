import { test, expect } from '@playwright/test';

test.describe('KAN-110 Category Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    // Ensure app renders properly
    await expect(page.locator('h1.brand-title')).toHaveText('TaskMaster Pro');
  });

  test('1. Category dropdown is visible and populated with categories', async ({ page }) => {
    const categorySelect = page.locator('#category-select');
    await expect(categorySelect).toBeVisible();

    const optionLabels = await categorySelect.locator('option').allTextContents();
    expect(optionLabels).toContain('All Categories');
    expect(optionLabels).toContain('Design');
    expect(optionLabels).toContain('Backend');
  });

  test('2. Selecting a category filters the task list to that category', async ({ page }) => {
    // Seeded tasks span multiple categories
    await expect(page.locator('.task-title', { hasText: 'Design modern dashboard layout' })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: 'Implement Express API endpoints' })).toBeVisible();

    await page.selectOption('#category-select', 'design');

    await expect(page.locator('.task-title', { hasText: 'Design modern dashboard layout' })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: 'Implement Express API endpoints' })).not.toBeVisible();
  });

  test('3. Clearing the category selection restores the full unfiltered list', async ({ page }) => {
    await page.selectOption('#category-select', 'backend');
    await expect(page.locator('.task-title', { hasText: 'Implement Express API endpoints' })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: 'Design modern dashboard layout' })).not.toBeVisible();

    await page.selectOption('#category-select', 'all');

    await expect(page.locator('.task-title', { hasText: 'Design modern dashboard layout' })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: 'Implement Express API endpoints' })).toBeVisible();
  });
});
