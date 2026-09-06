import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterBar } from '../FilterBar';

function renderFilterBar(overrides = {}) {
  const filters = {
    search: '',
    status: 'all',
    priority: 'all',
    category: 'all',
    sortBy: 'created_at',
    ...overrides,
  };

  const setFilters = vi.fn();
  render(<FilterBar filters={filters} setFilters={setFilters} />);

  return { setFilters };
}

describe('FilterBar - Category filter', () => {
  it('renders category dropdown with expected options', () => {
    renderFilterBar();

    // Since the component has no label, select by id (or test id if present)
    const select = document.getElementById('category-select');
    expect(select).not.toBeNull();

    /** @type {HTMLSelectElement} */
    const categorySelect = select;

    const optionData = Array.from(categorySelect.options).map((o) => ({
      value: o.value,
      text: o.text,
    }));

    expect(optionData).toEqual([
      { value: 'all', text: 'All Categories' },
      { value: 'work', text: 'Work' },
      { value: 'personal', text: 'Personal' },
      { value: 'health', text: 'Health' },
    ]);
  });

  it('selecting a category updates filters.category', async () => {
    const user = userEvent.setup();
    const { setFilters } = renderFilterBar({ category: 'all' });

    const select = document.getElementById('category-select');
    expect(select).not.toBeNull();

    await user.selectOptions(/** @type {HTMLSelectElement} */ (select), 'work');

    expect(setFilters).toHaveBeenCalledTimes(1);
    const updater = setFilters.mock.calls[0][0];
    expect(typeof updater).toBe('function');
    expect(updater({ category: 'all' }).category).toBe('work');
  });

  it('selecting "All Categories" sets category back to "all"', async () => {
    const user = userEvent.setup();
    const { setFilters } = renderFilterBar({ category: 'work' });

    const select = document.getElementById('category-select');
    expect(select).not.toBeNull();

    await user.selectOptions(/** @type {HTMLSelectElement} */ (select), 'all');

    const updater = setFilters.mock.calls[0][0];
    expect(updater({ category: 'work' }).category).toBe('all');
  });
});
