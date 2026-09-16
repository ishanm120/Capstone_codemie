import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { FilterBar } from './FilterBar';

const baseFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  category: 'all',
  sortBy: 'created_at'
};

describe('FilterBar category filter', () => {
  it('renders the category dropdown with "All" and category options', () => {
    render(<FilterBar filters={baseFilters} setFilters={() => {}} />);

    const categorySelect = document.getElementById('category-select');

    expect(categorySelect).toBeInTheDocument();
    expect(categorySelect).toHaveTextContent('All Categories');
    expect(categorySelect).toHaveTextContent('Work');
    expect(categorySelect).toHaveTextContent('Personal');
    expect(categorySelect).toHaveTextContent('Testing');
  });

  it('selecting a category updates filters to that category', () => {
    const setFilters = vi.fn();
    render(<FilterBar filters={baseFilters} setFilters={setFilters} />);

    const categorySelect = document.getElementById('category-select');
    fireEvent.change(categorySelect, { target: { value: 'work' } });

    expect(setFilters).toHaveBeenCalledTimes(1);
    const updater = setFilters.mock.calls[0][0];
    expect(updater(baseFilters)).toEqual({ ...baseFilters, category: 'work' });
  });

  it('selecting "All" resets the category filter', () => {
    const setFilters = vi.fn();
    const filtersWithCategory = { ...baseFilters, category: 'work' };
    render(<FilterBar filters={filtersWithCategory} setFilters={setFilters} />);

    const categorySelect = document.getElementById('category-select');
    fireEvent.change(categorySelect, { target: { value: 'all' } });

    expect(setFilters).toHaveBeenCalledTimes(1);
    const updater = setFilters.mock.calls[0][0];
    expect(updater(filtersWithCategory)).toEqual({ ...filtersWithCategory, category: 'all' });
  });
});
