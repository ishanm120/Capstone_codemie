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
    // Search for a specific seeded task or created task
    await page.fill('#task-search-input', 'Express');
    await expect(page.locator('.task-title', { hasText: 'Implement Express API endpoints' })).toBeVisible();

    // Clear search
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

  test('TC-01 Category dropdown options and filtering', async ({ page }) => {
    const timestamp = Date.now();
    const backendTaskTitle = `QA Cat Backend ${timestamp}`;
    const designTaskTitle = `QA Cat Design ${timestamp}`;

    // Verify Category dropdown exists with default value "all" and label "All Categories"
    const categorySelect = page.locator('#category-select');
    await expect(categorySelect).toBeVisible();
    await expect(categorySelect).toHaveValue('all');
    await expect(categorySelect.locator('option[value="all"]')).toHaveText('All Categories');

    // Verify dropdown options include exactly the approved values
    const optionValues = await categorySelect.locator('option').evaluateAll(
      opts => opts.map(o => o.value)
    );
    expect(optionValues).toEqual(['all', 'general', 'work', 'personal', 'design', 'backend', 'frontend', 'testing']);

    // Create a task categorized as "backend"
    await page.click('#add-task-btn');
    await page.fill('#task-title-input', backendTaskTitle);
    await page.selectOption('#task-category-select', 'backend');
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: backendTaskTitle })).toBeVisible();

    // Create a task categorized as "design"
    await page.click('#add-task-btn');
    await page.fill('#task-title-input', designTaskTitle);
    await page.selectOption('#task-category-select', 'design');
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: designTaskTitle })).toBeVisible();

    // Select category "backend" and assert only the backend task is visible
    await page.selectOption('#category-select', 'backend');
    await expect(page.locator('.task-title', { hasText: backendTaskTitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: designTaskTitle })).not.toBeVisible();

    // Reset to "All Categories" and assert both tasks are visible again
    await page.selectOption('#category-select', 'all');
    await expect(page.locator('.task-title', { hasText: backendTaskTitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: designTaskTitle })).toBeVisible();
  });
});
