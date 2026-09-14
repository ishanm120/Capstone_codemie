import { test, expect } from '@playwright/test';

test.describe('KAN-109 Category Filter Dropdown', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page.locator('h1.brand-title')).toHaveText('TaskMaster Pro');
  });

  test('1. Category dropdown is present with "All" and category options', async ({ page }) => {
    const categorySelect = page.locator('#category-select');
    await expect(categorySelect).toBeVisible();

    await expect(categorySelect.locator('option', { hasText: 'All Categories' })).toHaveCount(1);
    await expect(categorySelect.locator('option', { hasText: 'Work' })).toHaveCount(1);
    await expect(categorySelect).toHaveValue('all');
  });

  test('2. Selecting a category filters the list, and "All" restores it', async ({ page }) => {
    const timestamp = Date.now();
    const workTitle = `QA107 Work Task ${timestamp}`;
    const personalTitle = `QA107 Personal Task ${timestamp}`;

    await page.click('#add-task-btn');
    await page.fill('#task-title-input', workTitle);
    await page.selectOption('#task-category-select', 'work');
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: workTitle })).toBeVisible();

    await page.click('#add-task-btn');
    await page.fill('#task-title-input', personalTitle);
    await page.selectOption('#task-category-select', 'personal');
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: personalTitle })).toBeVisible();

    await page.selectOption('#category-select', 'work');
    await expect(page.locator('.task-title', { hasText: workTitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: personalTitle })).not.toBeVisible();

    await page.selectOption('#category-select', 'all');
    await expect(page.locator('.task-title', { hasText: workTitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: personalTitle })).toBeVisible();
  });

  test('3. Category filter combines with search and status filters without leakage', async ({ page }) => {
    const timestamp = Date.now();
    const alphaTitle = `QA107Combo Alpha ${timestamp}`;
    const betaTitle = `QA107Combo Beta ${timestamp}`;

    await page.click('#add-task-btn');
    await page.fill('#task-title-input', alphaTitle);
    await page.selectOption('#task-category-select', 'work');
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: alphaTitle })).toBeVisible();

    await page.click('#add-task-btn');
    await page.fill('#task-title-input', betaTitle);
    await page.selectOption('#task-category-select', 'personal');
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: betaTitle })).toBeVisible();

    // Category filter narrows to the matching category regardless of a shared search prefix.
    await page.selectOption('#category-select', 'work');
    await page.fill('#task-search-input', 'QA107Combo');
    await expect(page.locator('.task-title', { hasText: alphaTitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: betaTitle })).not.toBeVisible();

    // Searching for the other-category task's title still yields no leakage while category filter is active.
    await page.fill('#task-search-input', 'Beta');
    await expect(page.locator('.task-title', { hasText: betaTitle })).not.toBeVisible();

    await page.fill('#task-search-input', 'QA107Combo');

    // Category selection persists across status filter toggles.
    const alphaCard = page.locator('.task-card', { hasText: alphaTitle });
    await alphaCard.locator('.custom-checkbox').click();
    await expect(alphaCard).toHaveClass(/completed/);

    await page.click('#filter-completed-btn');
    await expect(page.locator('#category-select')).toHaveValue('work');
    await expect(page.locator('.task-title', { hasText: alphaTitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: betaTitle })).not.toBeVisible();

    await page.click('#filter-all-btn');
    await page.fill('#task-search-input', '');
    await page.selectOption('#category-select', 'all');
    await expect(page.locator('.task-title', { hasText: alphaTitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: betaTitle })).toBeVisible();
  });

  test('4. Category filter is reflected in the URL and survives a page reload', async ({ page }) => {
    const timestamp = Date.now();
    const workTitle = `QA109 Work Task ${timestamp}`;
    const personalTitle = `QA109 Personal Task ${timestamp}`;

    await page.click('#add-task-btn');
    await page.fill('#task-title-input', workTitle);
    await page.selectOption('#task-category-select', 'work');
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: workTitle })).toBeVisible();

    await page.click('#add-task-btn');
    await page.fill('#task-title-input', personalTitle);
    await page.selectOption('#task-category-select', 'personal');
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: personalTitle })).toBeVisible();

    await page.selectOption('#category-select', 'work');
    await expect(page.locator('.task-title', { hasText: workTitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: personalTitle })).not.toBeVisible();
    expect(new URL(page.url()).searchParams.get('category')).toBe('work');

    await page.reload();
    await expect(page.locator('#category-select')).toHaveValue('work');
    await expect(page.locator('.task-title', { hasText: workTitle })).toBeVisible();
    await expect(page.locator('.task-title', { hasText: personalTitle })).not.toBeVisible();
  });

  test('5. Browser back/forward navigation restores the previous category selection', async ({ page }) => {
    const timestamp = Date.now();
    const workTitle = `QA109 History Work Task ${timestamp}`;

    await page.click('#add-task-btn');
    await page.fill('#task-title-input', workTitle);
    await page.selectOption('#task-category-select', 'work');
    await page.click('#save-task-submit');
    await expect(page.locator('.task-title', { hasText: workTitle })).toBeVisible();

    await page.selectOption('#category-select', 'work');
    expect(new URL(page.url()).searchParams.get('category')).toBe('work');

    await page.selectOption('#category-select', 'all');
    expect(new URL(page.url()).searchParams.get('category')).toBeNull();

    await page.goBack();
    await expect(page.locator('#category-select')).toHaveValue('work');
    expect(new URL(page.url()).searchParams.get('category')).toBe('work');

    await page.goForward();
    await expect(page.locator('#category-select')).toHaveValue('all');
    expect(new URL(page.url()).searchParams.get('category')).toBeNull();
  });
});
