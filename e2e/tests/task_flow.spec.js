import { test, expect } from '@playwright/test';

test.describe('Task Management V1 Core Workflows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    // Ensure app renders properly
    await expect(page.locator('h1.brand-title')).toHaveText('TaskMaster Pro');
  });

  test('1. Create a new task', async ({ page }) => {
    const timestamp = Date.now();
    const taskTitle = `E2E Automated Task ${timestamp}`;
    const taskDesc = `Created via Playwright test automation ${timestamp}`;

    // Click "New Task" button to show form
    await page.click('#add-task-btn');
    await expect(page.locator('#create-task-form')).toBeVisible();

    // Fill in form inputs
    await page.fill('#task-title-input', taskTitle);
    await page.fill('#task-desc-input', taskDesc);
    await page.selectOption('#task-priority-select', 'high');
    await page.selectOption('#task-category-select', 'testing');

    // Submit form
    await page.click('#save-task-submit');

    // Verify created task appears in list
    await expect(page.locator('.task-title', { hasText: taskTitle })).toBeVisible();
    await expect(page.locator('.task-desc', { hasText: taskDesc })).toBeVisible();
  });

  test('2. Display existing tasks and filter', async ({ page }) => {
    // Create two tasks with distinct categories for category filtering assertions
    const timestamp = Date.now();
    const backendTitle = `E2E Backend Task ${timestamp}`;
    const testingTitle = `E2E Testing Task ${timestamp}`;

    // Create backend task
    await page.click('#add-task-btn');
    await page.fill('#task-title-input', backendTitle);
    await page.selectOption('#task-category-select', 'backend');
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: backendTitle })).toBeVisible();

    // Create testing task
    await page.click('#add-task-btn');
    await page.fill('#task-title-input', testingTitle);
    await page.selectOption('#task-category-select', 'testing');
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: testingTitle })).toBeVisible();

    // Category dropdown filtering: show only 'testing' tasks
    await page.selectOption('#category-select', 'testing');
    await expect(page.locator('.task-title', { hasText: testingTitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: backendTitle })).not.toBeVisible();

    // Combine with search filter while category=testing
    const searchTerm = 'Testing';
    await page.fill('#task-search-input', searchTerm);
    await expect(page.locator('.task-title', { hasText: testingTitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: backendTitle })).not.toBeVisible();

    // Reset filters
    await page.selectOption('#category-select', 'all');
    await page.fill('#task-search-input', '');
  });

  test('3. Mark task complete & toggle back', async ({ page }) => {
    const taskTitle = `Toggle Task ${Date.now()}`;
    
    // Create task
    await page.click('#add-task-btn');
    await page.fill('#task-title-input', taskTitle);
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: taskTitle })).toBeVisible();

    // Locate the task card and click checkbox
    const taskCard = page.locator('.task-card', { hasText: taskTitle });
    const checkbox = taskCard.locator('.custom-checkbox');
    await checkbox.click();

    // Verify task gets completed class
    await expect(taskCard).toHaveClass(/completed/);

    // Filter by Completed tab
    await page.click('#filter-completed-btn');
    await expect(page.locator('.task-title', { hasText: taskTitle })).toBeVisible();

    // Filter back to All tab
    await page.click('#filter-all-btn');
  });

  test('4. Delete a task', async ({ page }) => {
    const taskTitle = `Delete Me Task ${Date.now()}`;

    // Create task
    await page.click('#add-task-btn');
    await page.fill('#task-title-input', taskTitle);
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: taskTitle })).toBeVisible();

    // Click delete button on task card
    const taskCard = page.locator('.task-card', { hasText: taskTitle });
    await taskCard.locator('.delete-btn').click();

    // Verify task is removed from DOM
    await expect(page.locator('.task-title', { hasText: taskTitle })).not.toBeVisible();
  });
});
