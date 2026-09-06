import { test, expect } from '@playwright/test';

test.describe('KAN-38 Category Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page.locator('h1.brand-title')).toHaveText('TaskMaster Pro');
  });

  test('filters tasks by category and composes with search', async ({ page }) => {
    const timestamp = Date.now();
    const workTitle = `Work Task ${timestamp}`;
    const personalTitle = `Personal Task ${timestamp}`;

    // Create a Work task
    await page.click('#add-task-btn');
    await expect(page.locator('#create-task-form')).toBeVisible();
    await page.fill('#task-title-input', workTitle);
    await page.fill('#task-desc-input', 'Work category task for KAN-38 coverage');
    await page.selectOption('#task-priority-select', 'high');
    await page.selectOption('#task-category-select', 'work');
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: workTitle })).toBeVisible();

    // Create a Personal task
    await page.click('#add-task-btn');
    await expect(page.locator('#create-task-form')).toBeVisible();
    await page.fill('#task-title-input', personalTitle);
    await page.fill('#task-desc-input', 'Personal category task for KAN-38 coverage');
    await page.selectOption('#task-priority-select', 'low');
    await page.selectOption('#task-category-select', 'personal');
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: personalTitle })).toBeVisible();

    // Select "Work" category and assert only Work task is visible
    await page.selectOption('#category-select', 'work');
    await expect(page.locator('.task-title', { hasText: workTitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: personalTitle })).toBeHidden();

    // Select "Personal" category and assert only Personal task is visible
    await page.selectOption('#category-select', 'personal');
    await expect(page.locator('.task-title', { hasText: personalTitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: workTitle })).toBeHidden();

    // Select "All Categories" and assert both are visible again
    await page.selectOption('#category-select', 'all');
    await expect(page.locator('.task-title', { hasText: workTitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: personalTitle })).toBeVisible();

    // Composition check: category=Work + search for Personal task title should show nothing
    await page.selectOption('#category-select', 'work');
    await page.fill('#task-search-input', personalTitle);
    await expect(page.locator('.task-title', { hasText: personalTitle })).not.toBeVisible();

    // Reset search and category for test isolation
    await page.fill('#task-search-input', '');
    await page.selectOption('#category-select', 'all');
  });
});
