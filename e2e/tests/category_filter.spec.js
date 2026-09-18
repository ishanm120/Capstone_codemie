import { test, expect } from '@playwright/test';

test.describe('KAN-115: Category Filter Dropdown', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page.locator('h1.brand-title')).toHaveText('TaskMaster Pro');
  });

  test('AC1: Category dropdown is visible in the Filter Bar with an "All" option', async ({ page }) => {
    const categorySelect = page.locator('#category-select');
    await expect(categorySelect).toBeVisible();
    await expect(categorySelect.locator('option[value="all"]')).toHaveText('All Categories');
    await expect(categorySelect).toHaveValue('all');
  });

  test('AC2 & AC3: selecting a category filters the list, clearing shows all categories again', async ({ page }) => {
    const timestamp = Date.now();
    const designTitle = `E2E Design Task ${timestamp}`;
    const workTitle = `E2E Work Task ${timestamp}`;

    await page.click('#add-task-btn');
    await page.fill('#task-title-input', designTitle);
    await page.selectOption('#task-category-select', 'design');
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: designTitle })).toBeVisible();

    await page.click('#add-task-btn');
    await page.fill('#task-title-input', workTitle);
    await page.selectOption('#task-category-select', 'work');
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: workTitle })).toBeVisible();

    // AC2: selecting a category shows only tasks in that category
    await page.selectOption('#category-select', 'design');
    await expect(page.locator('.task-title', { hasText: designTitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: workTitle })).not.toBeVisible();

    // AC3: clearing the selection ("All") shows tasks from all categories again
    await page.selectOption('#category-select', 'all');
    await expect(page.locator('.task-title', { hasText: designTitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: workTitle })).toBeVisible();
  });

  test('AC4: selected category persists while navigating within the app', async ({ page }) => {
    const timestamp = Date.now();
    const taskTitle = `E2E Persist Task ${timestamp}`;

    await page.click('#add-task-btn');
    await page.fill('#task-title-input', taskTitle);
    await page.selectOption('#task-category-select', 'personal');
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: taskTitle })).toBeVisible();

    await page.selectOption('#category-select', 'personal');
    await expect(page.locator('#category-select')).toHaveValue('personal');

    // Navigate within the app using an existing UI control (open/close the task form)
    await page.click('#add-task-btn');
    await expect(page.locator('#create-task-form')).toBeVisible();
    await page.click('.form-card .icon-btn');
    await expect(page.locator('#create-task-form')).not.toBeVisible();

    // Category filter should still be selected, unchanged by navigation
    await expect(page.locator('#category-select')).toHaveValue('personal');
    await expect(page.locator('.task-title', { hasText: taskTitle })).toBeVisible();
  });
});
