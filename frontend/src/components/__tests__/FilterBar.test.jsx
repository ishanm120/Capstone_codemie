import React, { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { FilterBar } from '../FilterBar';

const baseFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  category: 'all',
  sortBy: 'created_at'
};

const CATEGORY_OPTIONS = ['all', 'general', 'work', 'personal', 'design', 'backend', 'frontend', 'testing'];

function ControlledFilterBar({ initialFilters, onSetFilters }) {
  const [filters, setFilters] = useState(initialFilters);
  const handleSetFilters = (updater) => {
    onSetFilters(updater);
    setFilters(updater);
  };
  return <FilterBar filters={filters} setFilters={handleSetFilters} />;
}

describe('FilterBar - Category dropdown', () => {
  it('renders the category dropdown with the expected options', () => {
    render(<FilterBar filters={baseFilters} setFilters={vi.fn()} />);

    const select = document.getElementById('category-select');
    expect(select).toBeInTheDocument();

    const optionValues = Array.from(select.options).map(option => option.value);
    expect(optionValues).toEqual(CATEGORY_OPTIONS);
  });

  it('calls setFilters and updates the category when a category is selected', () => {
    const onSetFilters = vi.fn();
    render(<ControlledFilterBar initialFilters={baseFilters} onSetFilters={onSetFilters} />);

    const select = document.getElementById('category-select');
    fireEvent.change(select, { target: { value: 'design' } });

    expect(onSetFilters).toHaveBeenCalledTimes(1);
    expect(select.value).toBe('design');
  });

  it('resets category back to "all" when All Categories is selected', () => {
    const onSetFilters = vi.fn();
    render(
      <ControlledFilterBar
        initialFilters={{ ...baseFilters, category: 'work' }}
        onSetFilters={onSetFilters}
      />
    );

    const select = document.getElementById('category-select');
    expect(select.value).toBe('work');

    fireEvent.change(select, { target: { value: 'all' } });

    expect(onSetFilters).toHaveBeenCalledTimes(1);
    expect(select.value).toBe('all');
  });
});
