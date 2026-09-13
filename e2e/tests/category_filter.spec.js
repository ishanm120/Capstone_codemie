import { test, expect } from '@playwright/test';

test.describe('KAN-106 Category filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page.locator('h1.brand-title')).toHaveText('TaskMaster Pro');
  });

  test('1. Category dropdown is visible in the toolbar', async ({ page }) => {
    await expect(page.locator('#category-select')).toBeVisible();
    await expect(page.locator('#category-select option', { hasText: 'All Categories' })).toHaveCount(1);
  });

  test('2-4. Filtering, reset, and persistence with search/status controls', async ({ page }) => {
    const timestamp = Date.now();
    const workTitle = `E2E Work Task ${timestamp}`;
    const personalTitle = `E2E Personal Task ${timestamp}`;

    // Create a task in the "work" category
    await page.click('#add-task-btn');
    await expect(page.locator('#create-task-form')).toBeVisible();
    await page.fill('#task-title-input', workTitle);
    await page.selectOption('#task-category-select', 'work');
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: workTitle })).toBeVisible();

    // Create a task in the "personal" category
    await page.click('#add-task-btn');
    await expect(page.locator('#create-task-form')).toBeVisible();
    await page.fill('#task-title-input', personalTitle);
    await page.selectOption('#task-category-select', 'personal');
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: personalTitle })).toBeVisible();

    // --- Scenario 2: Filtering ---
    await page.selectOption('#category-select', 'work');
    await expect(page.locator('.task-title', { hasText: workTitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: personalTitle })).not.toBeVisible();

    // --- Scenario 3: Reset ---
    await page.selectOption('#category-select', 'all');
    await expect(page.locator('.task-title', { hasText: workTitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: personalTitle })).toBeVisible();

    // --- Scenario 4: Persistence alongside Search ---
    await page.selectOption('#category-select', 'work');
    await expect(page.locator('.task-title', { hasText: workTitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: personalTitle })).not.toBeVisible();

    await page.fill('#task-search-input', 'E2E');
    await expect(page.locator('#category-select')).toHaveValue('work');
    await expect(page.locator('.task-title', { hasText: workTitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: personalTitle })).not.toBeVisible();
    await page.fill('#task-search-input', '');

    // --- Persistence alongside the Completed status tab ---
    await page.click('#filter-completed-btn');
    await expect(page.locator('#category-select')).toHaveValue('work');
    await expect(page.locator('.task-title', { hasText: workTitle })).not.toBeVisible();
    await expect(page.locator('.task-title', { hasText: personalTitle })).not.toBeVisible();

    await page.click('#filter-all-btn');
    await expect(page.locator('#category-select')).toHaveValue('work');
    await expect(page.locator('.task-title', { hasText: workTitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: personalTitle })).not.toBeVisible();

    // Reset category filter so the two created tasks remain visible for cleanup/other tests
    await page.selectOption('#category-select', 'all');
    await expect(page.locator('.task-title', { hasText: personalTitle })).toBeVisible();
  });
});
