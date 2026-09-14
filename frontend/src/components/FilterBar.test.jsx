import React from 'react';
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

describe('FilterBar category filter', () => {
  it('renders a category dropdown with an "All Categories" option selected by default', () => {
    render(<FilterBar filters={baseFilters} setFilters={vi.fn()} />);

    const categorySelect = document.getElementById('category-select');

    expect(categorySelect).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'All Categories' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Work' })).toBeInTheDocument();
    expect(categorySelect.value).toBe('all');
  });

  it('calls setFilters with the selected category when an option is chosen', () => {
    const setFilters = vi.fn();
    render(<FilterBar filters={baseFilters} setFilters={setFilters} />);

    const categorySelect = document.getElementById('category-select');
    fireEvent.change(categorySelect, { target: { value: 'work' } });

    expect(setFilters).toHaveBeenCalledTimes(1);
    const updater = setFilters.mock.calls[0][0];
    expect(updater(baseFilters)).toEqual({ ...baseFilters, category: 'work' });
  });

  it('resets the category filter back to "all" when "All Categories" is chosen', () => {
    const setFilters = vi.fn();
    const filtersWithCategory = { ...baseFilters, category: 'work' };
    render(<FilterBar filters={filtersWithCategory} setFilters={setFilters} />);

    const categorySelect = document.getElementById('category-select');
    fireEvent.change(categorySelect, { target: { value: 'all' } });

    const updater = setFilters.mock.calls[0][0];
    expect(updater(filtersWithCategory)).toEqual({ ...filtersWithCategory, category: 'all' });
  });
});
