import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterBar } from '../FilterBar';

const CATEGORY_OPTIONS = ['all', 'general', 'work', 'personal', 'design', 'backend', 'frontend', 'testing'];

function baseFilters(overrides = {}) {
  return {
    search: 'report',
    status: 'active',
    priority: 'high',
    category: 'all',
    sortBy: 'due_date',
    ...overrides
  };
}

describe('FilterBar category dropdown', () => {
  it('renders the category dropdown', () => {
    render(<FilterBar filters={baseFilters()} setFilters={() => {}} />);
    expect(document.querySelector('#category-select')).toBeInTheDocument();
  });

  it('defaults to "all" when filters.category is "all"', () => {
    render(<FilterBar filters={baseFilters({ category: 'all' })} setFilters={() => {}} />);
    expect(document.querySelector('#category-select').value).toBe('all');
  });

  it('includes all required category options', () => {
    render(<FilterBar filters={baseFilters()} setFilters={() => {}} />);
    const select = document.querySelector('#category-select');
    const values = Array.from(select.options).map(option => option.value);
    CATEGORY_OPTIONS.forEach(value => {
      expect(values).toContain(value);
    });
    expect(screen.getByText('All Categories')).toBeInTheDocument();
  });

  it('updates only category when changed, preserving other filter keys', async () => {
    const prevFilters = baseFilters({ category: 'all' });
    let nextFilters = null;
    const setFilters = vi.fn((updater) => {
      nextFilters = updater(prevFilters);
    });
    render(<FilterBar filters={prevFilters} setFilters={setFilters} />);

    const user = userEvent.setup();
    await user.selectOptions(document.querySelector('#category-select'), 'backend');

    expect(setFilters).toHaveBeenCalledTimes(1);
    expect(setFilters.mock.calls[0][0]).toBeTypeOf('function');
    expect(nextFilters.category).toBe('backend');
    expect(nextFilters.search).toBe(prevFilters.search);
    expect(nextFilters.status).toBe(prevFilters.status);
    expect(nextFilters.priority).toBe(prevFilters.priority);
    expect(nextFilters.sortBy).toBe(prevFilters.sortBy);
  });
});
