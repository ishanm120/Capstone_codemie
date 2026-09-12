import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterBar } from './FilterBar';

const baseFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  category: 'all',
  sortBy: 'created_at'
};

describe('FilterBar category dropdown', () => {
  it('renders the category dropdown with an All Categories option', () => {
    render(<FilterBar filters={baseFilters} setFilters={vi.fn()} />);

    const select = document.getElementById('category-select');
    expect(select).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'All Categories' })).toBeInTheDocument();
  });

  it('selecting a specific category calls setFilters with an updater that sets category', () => {
    const setFilters = vi.fn();
    render(<FilterBar filters={baseFilters} setFilters={setFilters} />);

    const select = document.getElementById('category-select');
    fireEvent.change(select, { target: { value: 'work' } });

    expect(setFilters).toHaveBeenCalledTimes(1);
    const updater = setFilters.mock.calls[0][0];
    expect(typeof updater).toBe('function');
    expect(updater(baseFilters)).toEqual({ ...baseFilters, category: 'work' });
  });

  it('selecting All Categories sets category to "all"', () => {
    const setFilters = vi.fn();
    render(<FilterBar filters={{ ...baseFilters, category: 'work' }} setFilters={setFilters} />);

    const select = document.getElementById('category-select');
    fireEvent.change(select, { target: { value: 'all' } });

    expect(setFilters).toHaveBeenCalledTimes(1);
    const updater = setFilters.mock.calls[0][0];
    expect(updater({ ...baseFilters, category: 'work' })).toEqual({ ...baseFilters, category: 'all' });
  });
});
