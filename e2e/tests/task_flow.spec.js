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

  test('5. Category dropdown presence and filter by category', async ({ page }) => {
    const timestamp = Date.now();
    const backendTaskTitle = `QA Backend Task ${timestamp}`;
    const frontendTaskTitle = `QA Frontend Task ${timestamp}`;

    // Create a backend-category task
    await page.click('#add-task-btn');
    await page.fill('#task-title-input', backendTaskTitle);
    await page.selectOption('#task-category-select', 'backend');
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: backendTaskTitle })).toBeVisible();

    // Create a frontend-category task
    await page.click('#add-task-btn');
    await page.fill('#task-title-input', frontendTaskTitle);
    await page.selectOption('#task-category-select', 'frontend');
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: frontendTaskTitle })).toBeVisible();

    // Category dropdown is present with expected default option
    const categorySelect = page.locator('#category-select');
    await expect(categorySelect).toBeVisible();
    await expect(categorySelect.locator('option', { hasText: 'All Categories' })).toHaveCount(1);

    // Filter by "backend" category
    await categorySelect.selectOption('backend');
    await expect(page.locator('.task-title', { hasText: backendTaskTitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: frontendTaskTitle })).not.toBeVisible();
  });

  test('6. Reset Category filter back to "All Categories"', async ({ page }) => {
    const timestamp = Date.now();
    const backendTaskTitle = `QA Reset Backend Task ${timestamp}`;
    const frontendTaskTitle = `QA Reset Frontend Task ${timestamp}`;

    await page.click('#add-task-btn');
    await page.fill('#task-title-input', backendTaskTitle);
    await page.selectOption('#task-category-select', 'backend');
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: backendTaskTitle })).toBeVisible();

    await page.click('#add-task-btn');
    await page.fill('#task-title-input', frontendTaskTitle);
    await page.selectOption('#task-category-select', 'frontend');
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: frontendTaskTitle })).toBeVisible();

    const categorySelect = page.locator('#category-select');

    // Narrow to "frontend" only
    await categorySelect.selectOption('frontend');
    await expect(page.locator('.task-title', { hasText: frontendTaskTitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: backendTaskTitle })).not.toBeVisible();

    // Reset back to "All Categories" - both tasks should reappear
    await categorySelect.selectOption('all');
    await expect(categorySelect).toHaveValue('all');
    await expect(page.locator('.task-title', { hasText: backendTaskTitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: frontendTaskTitle })).toBeVisible();
  });

  test('7. Category filter combined with Search (regression)', async ({ page }) => {
    const timestamp = Date.now();
    const searchKeyword = `QAKeyword${timestamp}`;
    const matchingTaskTitle = `${searchKeyword} Backend Task`;
    const nonMatchingBackendTaskTitle = `Other Backend Task ${timestamp}`;
    const matchingFrontendTaskTitle = `${searchKeyword} Frontend Task`;

    // Matches both search keyword and "backend" category
    await page.click('#add-task-btn');
    await page.fill('#task-title-input', matchingTaskTitle);
    await page.selectOption('#task-category-select', 'backend');
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: matchingTaskTitle })).toBeVisible();

    // Matches "backend" category but not the search keyword
    await page.click('#add-task-btn');
    await page.fill('#task-title-input', nonMatchingBackendTaskTitle);
    await page.selectOption('#task-category-select', 'backend');
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: nonMatchingBackendTaskTitle })).toBeVisible();

    // Matches the search keyword but not the "backend" category
    await page.click('#add-task-btn');
    await page.fill('#task-title-input', matchingFrontendTaskTitle);
    await page.selectOption('#task-category-select', 'frontend');
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: matchingFrontendTaskTitle })).toBeVisible();

    // Apply category filter first
    await page.selectOption('#category-select', 'backend');
    await expect(page.locator('.task-title', { hasText: matchingTaskTitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: nonMatchingBackendTaskTitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: matchingFrontendTaskTitle })).not.toBeVisible();

    // Then apply search on top of the category filter
    await page.fill('#task-search-input', searchKeyword);
    await expect(page.locator('.task-title', { hasText: matchingTaskTitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: nonMatchingBackendTaskTitle })).not.toBeVisible();
    await expect(page.locator('.task-title', { hasText: matchingFrontendTaskTitle })).not.toBeVisible();

    // Clear search and category for hygiene
    await page.fill('#task-search-input', '');
    await page.selectOption('#category-select', 'all');
  });
});
