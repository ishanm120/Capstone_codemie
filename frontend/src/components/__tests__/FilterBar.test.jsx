import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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

    const categorySelect = screen.getByRole('combobox', { name: '' , hidden: false });
    // Since the component has no label, select by id
    expect(document.getElementById('category-select')).toBeTruthy();

    const select = document.getElementById('category-select');
    const optionValues = Array.from(select.options).map((o) => o.value);
    expect(optionValues).toEqual(['all', 'work', 'personal', 'health']);
  });

  it('selecting a category updates filters.category', async () => {
    const user = userEvent.setup();
    const { setFilters } = renderFilterBar({ category: 'all' });

    const select = document.getElementById('category-select');
    await user.selectOptions(select, 'work');

    expect(setFilters).toHaveBeenCalledTimes(1);
    const updater = setFilters.mock.calls[0][0];
    expect(typeof updater).toBe('function');
    expect(updater({ category: 'all' }).category).toBe('work');
  });

  it('selecting "All Categories" sets category back to "all"', async () => {
    const user = userEvent.setup();
    const { setFilters } = renderFilterBar({ category: 'work' });

    const select = document.getElementById('category-select');
    await user.selectOptions(select, 'all');

    const updater = setFilters.mock.calls[0][0];
    expect(updater({ category: 'work' }).category).toBe('all');
  });
});
