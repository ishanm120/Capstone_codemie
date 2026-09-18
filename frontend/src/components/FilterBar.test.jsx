import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import React, { useEffect, useState } from 'react';
import { FilterBar } from './FilterBar';

const initialFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  category: 'all',
  sortBy: 'created_at'
};

function Wrapper({ onFiltersChange }) {
  const [filters, setFilters] = useState(initialFilters);
  useEffect(() => { onFiltersChange(filters); }, [filters, onFiltersChange]);
  return <FilterBar filters={filters} setFilters={setFilters} />;
}

describe('FilterBar category filter', () => {
  it('renders a Category dropdown defaulting to "All Categories"', () => {
    const { container } = render(<Wrapper onFiltersChange={() => {}} />);
    const select = container.querySelector('#category-select');

    expect(select).not.toBeNull();
    expect(select.value).toBe('all');
    expect(select.querySelector('option[value="design"]')).not.toBeNull();
  });

  it('selecting a category updates filters.category', () => {
    const onFiltersChange = vi.fn();
    const { container } = render(<Wrapper onFiltersChange={onFiltersChange} />);
    const select = container.querySelector('#category-select');

    fireEvent.change(select, { target: { value: 'design' } });

    expect(select.value).toBe('design');
    expect(onFiltersChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ category: 'design' })
    );
  });

  it('selecting "All Categories" clears the category filter', () => {
    const onFiltersChange = vi.fn();
    const { container } = render(<Wrapper onFiltersChange={onFiltersChange} />);
    const select = container.querySelector('#category-select');

    fireEvent.change(select, { target: { value: 'design' } });
    fireEvent.change(select, { target: { value: 'all' } });

    expect(select.value).toBe('all');
    expect(onFiltersChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ category: 'all' })
    );
  });

  it('changing category leaves other filters untouched', () => {
    const onFiltersChange = vi.fn();
    const { container } = render(<Wrapper onFiltersChange={onFiltersChange} />);

    fireEvent.change(container.querySelector('#priority-select'), { target: { value: 'high' } });
    fireEvent.change(container.querySelector('#category-select'), { target: { value: 'design' } });

    expect(onFiltersChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ category: 'design', priority: 'high' })
    );
  });
});
